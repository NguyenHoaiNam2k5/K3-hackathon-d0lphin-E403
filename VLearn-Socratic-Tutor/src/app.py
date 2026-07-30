from __future__ import annotations

import json
from pathlib import Path
from typing import Any
from flask import Flask, jsonify, render_template, request

from data_pack import data_pack_summary
from env_loader import load_lab_env
from providers import make_provider
from tools import TOOL_FUNCTIONS, SlideContext, get_marked_transcript_context, load_tool_declarations, to_openai_tools
from versioning import artifact_version_dict, build_artifact_version
from chat import run_model_tool_loop

ROOT = Path(__file__).parent
ARTIFACTS_DIR = ROOT / 'artifacts'

load_lab_env(ROOT)

app = Flask(__name__, template_folder='templates', static_folder='static')

def bool_field(value: Any, default: bool) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() not in {"0", "false", "no", "off"}
    return default

def text_list(value: Any) -> tuple[str, ...]:
    if isinstance(value, str):
        stripped = value.strip()
        return (stripped,) if stripped else ()
    if isinstance(value, list):
        return tuple(str(item).strip() for item in value if str(item).strip())
    return ()

def slide_context_from_request(data: dict[str, Any], slide_id: str) -> SlideContext:
    return SlideContext(
        slide_id=slide_id,
        slide_title=data.get('slide_title', '').strip(),
        nearby_text=text_list(data.get('nearby_text', [])),
        slide_text=data.get('slide_text', '').strip(),
    )

def transcript_context_text(context: dict[str, Any]) -> str:
    chunks = context.get('chunks', [])
    return "\n\n".join(
        f"[{chunk['paragraph_id']}] {chunk['text']}"
        for chunk in chunks
        if isinstance(chunk, dict) and chunk.get('paragraph_id') and chunk.get('text')
    )

def apply_deepseek_summary(
    context: dict[str, Any],
    marked_text: str,
    student_question: str = "",
) -> dict[str, Any]:
    provider = make_provider('deepseek')
    model = getattr(provider, 'default_model', None)
    source_text = transcript_context_text(context)
    if not source_text:
        return context

    messages = [
        {
            'role': 'system',
            'content': (
                'Bạn là VLearn Socratic Tutor. Giải thích phần học viên bôi trên slide '
                'bằng tiếng Việt dễ hiểu, chỉ dựa trên transcript được cung cấp. '
                'Không thêm kiến thức ngoài. Nếu transcript không đủ căn cứ, hãy nói rõ. '
                'Luôn ưu tiên trả lời đúng câu hỏi của học viên, không chỉ giải thích đoạn mark. '
                'Nếu câu hỏi của học viên hỏi sang nội dung không được đoạn transcript hỗ trợ, '
                'hãy nói rõ đoạn được chọn không đề cập nội dung đó, không trả lời bằng kiến thức ngoài, '
                'và không tự suy diễn. '
                'Luôn trích dẫn mã đoạn như [T06-126].'
            ),
        },
        {
            'role': 'user',
            'content': (
                f'Học viên mark trên slide: {marked_text}\n\n'
                f'Câu hỏi của học viên: {student_question or "Hãy giải thích phần được mark."}\n\n'
                f'Transcript context:\n{source_text}\n\n'
                'Trả về ngắn gọn theo cấu trúc:\n'
                '1. Ý chính: một câu tóm tắt.\n'
                '2. Giải thích: 2-4 câu giúp học viên hiểu phần được mark dựa trên transcript.\n'
                '3. Tự kiểm tra: một câu hỏi Socratic gợi mở.\n'
                'Nếu câu hỏi không được transcript hỗ trợ, phần Ý chính phải nói rõ '
                '"đoạn bạn chọn không đề cập..." và phần Giải thích chỉ nêu transcript đang nói gì, '
                'không trả lời câu hỏi ngoài phạm vi.\n'
                'Mỗi phần phải có citation khi dùng ý từ transcript.'
            ),
        },
    ]

    response = provider.complete(messages, tools=None, model=model, temperature=0.1)
    summary_text = (response.text or '').strip()
    if not summary_text:
        return context

    summary = dict(context.get('summary', {}))
    summary['short'] = summary_text
    summary['explanation'] = summary_text
    context['summary'] = summary
    context['assistant_text'] = summary_text
    context['summary_provider'] = 'deepseek'
    context['summary_model'] = model
    context['summary_status'] = 'generated'
    return context

def get_agent_config(version_label: str = 'v3') -> dict[str, Any]:
    system_prompt_path = ARTIFACTS_DIR / 'system_prompt.md'
    tools_path = ARTIFACTS_DIR / 'tools.yaml'
    
    system_prompt = system_prompt_path.read_text(encoding='utf-8') if system_prompt_path.exists() else ''
    tool_declarations = load_tool_declarations(tools_path) if tools_path.exists() else []
    artifact_ver = build_artifact_version(version_label, system_prompt_path, tools_path)
    
    return {
        'system_prompt': system_prompt,
        'tool_declarations': tool_declarations,
        'openai_tools': to_openai_tools(tool_declarations),
        'artifact_version': artifact_ver,
    }

@app.route('/')
def index() -> str:
    return render_template('index.html')

@app.route('/api/version', methods=['GET'])
def api_version() -> Any:
    cfg = get_agent_config('v3')
    ver_dict = artifact_version_dict(cfg['artifact_version'])
    data_pack = data_pack_summary()
    return jsonify({
        **ver_dict,
        'system_prompt_text': cfg['system_prompt'],
        'tools_count': len(cfg['tool_declarations']),
        'tools': [t['name'] for t in cfg['tool_declarations']],
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
    user_message = data.get('message', '').strip()
    marked_text = data.get('marked_text', '').strip()
    slide_id = data.get('slide_id', 'unknown').strip() or 'unknown'
    slide_context = slide_context_from_request(data, slide_id)
    history = data.get('history', [])
    provider_name = data.get('provider', 'deepseek')
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
        {'role': 'system', 'content': cfg['system_prompt']},
        *history,
        {'role': 'user', 'content': grounded_user_message},
    ]

    try:
        loop_result = run_model_tool_loop(
            provider=provider,
            messages=messages,
            tools=cfg['openai_tools'],
            model=model,
            max_tool_rounds=4,
        )

        assistant_text = loop_result.get('assistant_text', '')

        return jsonify({
            'status': loop_result.get('status', 'answered'),
            'assistant_text': assistant_text,
            'transcript_context': transcript_context,
            'tool_calls': loop_result.get('tool_events', []),
            'artifact_version': cfg['artifact_version'].artifact_version,
            'provider': provider_name,
            'model': model,
        })
    except Exception as exc:
        return jsonify({
            'status': 'error',
            'error': f'{type(exc).__name__}: {str(exc)}',
            'artifact_version': cfg['artifact_version'].artifact_version,
        }), 500

@app.route('/api/marked-text', methods=['POST'])
def api_marked_text() -> Any:
    data = request.json or {}
    marked_text = data.get('marked_text', '').strip()
    student_question = data.get('student_question', '').strip()
    slide_id = data.get('slide_id', 'unknown').strip() or 'unknown'
    slide_context = slide_context_from_request(data, slide_id)
    use_ai_summary = bool_field(data.get('use_ai_summary', True), True)

    if not marked_text:
        return jsonify({'error': 'Empty marked_text'}), 400

    context = get_marked_transcript_context(marked_text, slide_context)
    context['summary_provider'] = 'deterministic'
    context['summary_status'] = 'fallback'
    if use_ai_summary and context.get('status') == 'matched':
        try:
            context = apply_deepseek_summary(context, marked_text, student_question)
        except RuntimeError as exc:
            context['summary_error'] = str(exc)
    return jsonify(context)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8501, debug=False)
