from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path
from traceback import format_exc
from typing import Any

from chat_runtime.agent import ResearchAgent
from core.env_loader import load_lab_env
from core.versioning import artifact_version_dict, build_artifact_version
from eval_runner.cases import case_messages, load_cases, load_dataset_info, safe_slug, validate_expected_tools
from eval_runner.grading import evaluate_phase_b, print_table, summarize
from providers import make_provider
from tools import load_tool_declarations, to_openai_tools

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS_DIR = ROOT / "artifacts"
DATA_DIR = ROOT / "data"
load_lab_env(ROOT)


def provider_error_result(case: dict[str, Any], exc: Exception) -> dict[str, Any]:
    return {
        "passed": False,
        "failure_type": "provider_error",
        "case_failure_type": case.get("failure_type"),
        "observed_mismatch": "provider_error",
        "failures": [f"{type(exc).__name__}: {str(exc)} {format_exc()}"],
        "actual_tool_calls": [],
        "actual_text": None,
        "routing_correct": False,
        "args_correct": False,
    }


def evaluate_case(case: dict[str, Any], agent: ResearchAgent) -> dict[str, Any]:
    try:
        tool_choice = None if case["expect"].get("no_tool") else "required"
        run = agent.run(case_messages(case), tool_choice=tool_choice)
        calls = [{"name": call.name, "args": call.args} for call in run.tool_calls]
        result = evaluate_phase_b(case, calls, run.text)
        tool_results = run.tool_results
    except RuntimeError as exc:
        result = provider_error_result(case, exc)
        tool_results = []
    return {
        "id": case["id"],
        "phase": case["phase"],
        "case_suite": case.get("suite"),
        "is_multiturn": "turns" in case,
        "metadata": case.get("metadata", {}),
        "input": case.get("input") or case.get("query") or case.get("turns"),
        "expect": case["expect"],
        "result": result,
        "tool_results": tool_results,
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run Research Agent live evals.")
    parser.add_argument("--phase", choices=["B"], default="B")
    parser.add_argument("--suite", choices=["base", "group", "cross", "extension"], default="base", help="Run label saved to JSON; does not filter --eval-cases.")
    parser.add_argument("--version", required=True)
    parser.add_argument("--provider", choices=["openai", "openrouter", "anthropic", "gemini", "deepseek"], required=True)
    parser.add_argument("--model", default=None)
    parser.add_argument("--system-prompt", type=Path, default=ARTIFACTS_DIR / "system_prompt.md")
    parser.add_argument("--tools", type=Path, default=ARTIFACTS_DIR / "tools.yaml")
    parser.add_argument("--eval-cases", type=Path, default=DATA_DIR / "eval_base.json")
    parser.add_argument("--runs-dir", type=Path, default=ROOT / "runs")
    return parser


def run_eval(args: argparse.Namespace) -> dict[str, Any]:
    system_prompt = args.system_prompt.read_text(encoding="utf-8")
    artifact_version = build_artifact_version(args.version, args.system_prompt, args.tools)
    provider = make_provider(args.provider)
    selected_model = args.model or getattr(provider, "default_model", None)
    dataset_info = load_dataset_info(args.eval_cases)
    cases = load_cases(args.eval_cases, args.phase)
    if not cases:
        raise SystemExit(f"No cases matched phase={args.phase!r} in {args.eval_cases}")

    tool_declarations = load_tool_declarations(args.tools)
    validate_expected_tools(cases, tool_declarations, args.eval_cases)
    openai_tools = to_openai_tools(tool_declarations)
    results: list[dict[str, Any]] = []

    for case in cases:
        print(f"Running {case['id']}...", flush=True)
        agent = ResearchAgent(provider, system_prompt=system_prompt, tools=openai_tools, model=args.model)
        case_result = evaluate_case(case, agent)
        case_result["suite"] = args.suite
        results.append(case_result)

    summary = summarize(results)
    return {
        "artifact_version": artifact_version,
        "dataset_info": dataset_info,
        "model": selected_model,
        "results": results,
        "summary": summary,
    }


def write_run(args: argparse.Namespace, run: dict[str, Any]) -> Path:
    args.runs_dir.mkdir(parents=True, exist_ok=True)
    now = datetime.now()
    timestamp = now.strftime("%Y%m%dT%H%M%S%f")
    run_id = "_".join([
        safe_slug(args.version),
        safe_slug(args.phase),
        safe_slug(args.suite),
        safe_slug(args.provider),
        timestamp,
    ])
    artifact_version = run["artifact_version"]
    payload = {
        "run_id": run_id,
        "version": args.version,
        **artifact_version_dict(artifact_version),
        "phase": args.phase,
        "suite": args.suite,
        "provider": args.provider,
        "model": run["model"],
        "system_prompt": str(args.system_prompt),
        "tools": str(args.tools),
        "eval_cases": str(args.eval_cases),
        **run["dataset_info"],
        "generated_at": now.isoformat(timespec="seconds"),
        "summary": run["summary"],
        "results": run["results"],
    }
    out_path = args.runs_dir / f"{run_id}.json"
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2, default=str), encoding="utf-8")
    return out_path


def main() -> None:
    args = build_parser().parse_args()
    run = run_eval(args)
    out_path = write_run(args, run)
    print_table(run["results"], run["summary"])
    print(f"\nArtifact version: {run['artifact_version'].artifact_version}")
    print(f"\nSaved: {out_path}")


if __name__ == "__main__":
    main()
