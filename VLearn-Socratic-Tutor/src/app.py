from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, render_template, request

from chat_runtime.loop import run_model_tool_loop
from core.data_pack import data_pack_summary
from core.env_loader import load_lab_env
from providers import configured_provider_name, make_provider
from services.marked_text_service import apply_llm_summary
from tools import (
    SlideContext,
    get_marked_transcript_context,
    load_tool_declarations,
    to_openai_tools,
)
from core.versioning import ArtifactVersion, artifact_version_dict, build_artifact_version

ROOT = Path(__file__).parent
ARTIFACTS_DIR = ROOT / 'artifacts'

load_lab_env(ROOT)

app = Flask(__name__, template_folder='templates', static_folder='static')


@dataclass(frozen=True, slots=True)
class AgentConfig:
    system_prompt: str
    tool_declarations: list[dict[str, Any]]
    openai_tools: list[dict[str, Any]]
    artifact_version: ArtifactVersion


def parse_bool_field(value: Any, default: bool) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() not in {"0", "false", "no", "off"}
    return default


def parse_text_sequence(value: Any) -> tuple[str, ...]:
    if isinstance(value, str):
        stripped = value.strip()
        return (stripped,) if stripped else ()
    if isinstance(value, list):
        return tuple(str(item).strip() for item in value if str(item).strip())
    return ()


def parse_text_field(value: Any, default: str = "") -> str:
    if value is None:
        return default
    return str(value).strip()


def slide_context_from_request(data: dict[str, Any], slide_id: str) -> SlideContext:
    return SlideContext(
        slide_id=slide_id,
        slide_title=parse_text_field(data.get('slide_title')),
        nearby_text=parse_text_sequence(data.get('nearby_text', [])),
        slide_text=parse_text_field(data.get('slide_text')),
    )


def get_agent_config(version_label: str = 'v3') -> AgentConfig:
    system_prompt_path = ARTIFACTS_DIR / 'system_prompt.md'
    tools_path = ARTIFACTS_DIR / 'tools.yaml'

    system_prompt = system_prompt_path.read_text(encoding='utf-8') if system_prompt_path.exists() else ''
    tool_declarations = load_tool_declarations(tools_path) if tools_path.exists() else []
    artifact_ver = build_artifact_version(version_label, system_prompt_path, tools_path)

    return AgentConfig(
        system_prompt=system_prompt,
        tool_declarations=tool_declarations,
        openai_tools=to_openai_tools(tool_declarations),
        artifact_version=artifact_ver,
    )


@app.route('/')
def index() -> str:
    return render_template('index.html')


@app.route('/api/version', methods=['GET'])
def api_version() -> Any:
    cfg = get_agent_config('v3')
    ver_dict = artifact_version_dict(cfg.artifact_version)
    data_pack = data_pack_summary()
    return jsonify({
        **ver_dict,
        'system_prompt_text': cfg.system_prompt,
        'tools_count': len(cfg.tool_declarations),
        'tools': [tool['name'] for tool in cfg.tool_declarations],
        'data_pack': {
            'root': data_pack['root'],
            'transcript_paragraph_count': data_pack['transcripts']['paragraph_count'],
            'slide_file_count': data_pack['slides']['file_count'],
            'chatlog_rows': data_pack['chatlog']['row_count'],
        },
    })


@app.route('/api/data-pack', methods=['GET'])
def api_data_pack() -> Any:
    return jsonify(data_pack_summary())


@app.route('/api/chat', methods=['POST'])
def api_chat() -> Any:
    data = request.json or {}
    user_message = parse_text_field(data.get('message'))
    marked_text = parse_text_field(data.get('marked_text'))
    slide_id = parse_text_field(data.get('slide_id'), 'unknown') or 'unknown'
    slide_context = slide_context_from_request(data, slide_id)
    history = data.get('history', [])
    provider_name = configured_provider_name(data.get('provider'))
    version_label = data.get('version', 'v3')

    if not user_message and not marked_text:
        return jsonify({'error': 'Empty message'}), 400

    cfg = get_agent_config(version_label)
    provider = make_provider(provider_name)
    model = getattr(provider, 'default_model', None)

    transcript_context = None
    grounded_user_message = user_message
    if marked_text:
        transcript_context = get_marked_transcript_context(marked_text, slide_context)
        grounded_user_message = (
            f"Marked slide text: {marked_text}\n"
            f"Slide title: {slide_context.slide_title or slide_context.slide_id}\n"
            f"Nearby slide text: {json.dumps(slide_context.nearby_text, ensure_ascii=False)}\n"
            f"Student question: {user_message or 'Hãy giải thích phần được mark.'}\n\n"
            "Transcript context JSON:\n"
            f"{json.dumps(transcript_context, ensure_ascii=False, default=str)}\n\n"
            "Answer using only this transcript context. Cite paragraph IDs like [T06-126]."
        )

    messages = [
        {'role': 'system', 'content': cfg.system_prompt},
        *history,
        {'role': 'user', 'content': grounded_user_message},
    ]

    try:
        loop_result = run_model_tool_loop(
            provider=provider,
            messages=messages,
            tools=cfg.openai_tools,
            model=model,
            max_tool_rounds=4,
        )

        assistant_text = loop_result.get('assistant_text', '')

        return jsonify({
            'status': loop_result.get('status', 'answered'),
            'assistant_text': assistant_text,
            'transcript_context': transcript_context,
            'tool_calls': loop_result.get('tool_events', []),
            'artifact_version': cfg.artifact_version.artifact_version,
            'provider': provider_name,
            'model': model,
        })
    except Exception as exc:
        return jsonify({
            'status': 'error',
            'error': f'{type(exc).__name__}: {str(exc)}',
            'artifact_version': cfg.artifact_version.artifact_version,
        }), 500


@app.route('/api/marked-text', methods=['POST'])
def api_marked_text() -> Any:
    data = request.json or {}
    marked_text = parse_text_field(data.get('marked_text'))
    student_question = parse_text_field(data.get('student_question'))
    slide_id = parse_text_field(data.get('slide_id'), 'unknown') or 'unknown'
    slide_context = slide_context_from_request(data, slide_id)
    use_ai_summary = parse_bool_field(data.get('use_ai_summary', True), True)
    provider_name = configured_provider_name(data.get('provider'))

    if not marked_text:
        return jsonify({'error': 'Empty marked_text'}), 400

    context = get_marked_transcript_context(marked_text, slide_context)
    context['summary_provider'] = 'deterministic'
    context['summary_status'] = 'fallback'
    if use_ai_summary and context.get('status') == 'matched':
        try:
            context = apply_llm_summary(context, marked_text, student_question, provider_name)
        except RuntimeError as exc:
            context['summary_error'] = str(exc)
    return jsonify(context)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8501, debug=False)
