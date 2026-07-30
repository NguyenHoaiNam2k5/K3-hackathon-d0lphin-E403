# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "flask",
#   "openai>=1.0.0",
#   "rank-bm25>=0.2.2",
# ]
# ///
# ─── How to run ───
# python eval/run_marked_text_eval.py

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EVAL_DIR = Path(__file__).resolve().parent
SRC_DIR = ROOT / "src"
sys.path.insert(0, str(EVAL_DIR))
sys.path.insert(0, str(SRC_DIR))

from core.env_loader import load_lab_env  # noqa: E402
from guardrails import grade_guardrails  # noqa: E402
from providers import configured_provider_name  # noqa: E402
from services.marked_text_service import apply_llm_summary  # noqa: E402
from tools import SlideContext, get_marked_transcript_context  # noqa: E402

DATASET_PATH = ROOT / "eval" / "golden_set.json"
RUNS_DIR = ROOT / "eval" / "runs"
load_lab_env(SRC_DIR)
PROVIDER_NAME = configured_provider_name()


def text_list(value):
    if value is None:
        return ()
    if isinstance(value, str):
        stripped = value.strip()
        return (stripped,) if stripped else ()
    return tuple(str(item).strip() for item in value if str(item).strip())


def chunk_id(chunk):
    for key in ("id", "paragraph_id", "citation_id"):
        if key in chunk:
            return chunk[key]
    return None


def slide_context(case):
    slide = case["input"].get("slide_context") or {}
    return SlideContext(
        slide_id=slide.get("slide_id") or case["id"],
        slide_title=slide.get("slide_title") or "",
        nearby_text=text_list(slide.get("nearby_text")),
        slide_text=slide.get("slide_text") or "",
    )


def evaluate_case(case):
    result = get_marked_transcript_context(case["input"]["marked_text"], slide_context(case))
    result = apply_llm_summary(
        result,
        case["input"]["marked_text"],
        case["input"].get("student_question") or "",
        PROVIDER_NAME,
    )
    chunk_ids = [cid for cid in (chunk_id(chunk) for chunk in result.get("chunks", [])) if cid]
    guardrail_grade = grade_guardrails(case, result, chunk_ids)
    return {
        "id": case["id"],
        "behavior": case["must_answer"].get("behavior"),
        "passed": guardrail_grade["passed"],
        "guardrail_results": guardrail_grade["checks"],
        "summary_provider": result.get("summary_provider"),
        "summary_status": result.get("summary_status"),
        "summary_model": result.get("summary_model"),
        "required_citations": case["guardrails"]["required_citations_in_context"],
        "returned_citations": chunk_ids,
        "primary_paragraph_id": result.get("primary_paragraph_id"),
        "retrieval_method": result.get("retrieval_method"),
        "status": result.get("status"),
        "marked_text": case["input"]["marked_text"],
        "student_question": case["input"].get("student_question"),
        "assistant_text": result.get("assistant_text"),
        "summary": result.get("summary"),
        "chunks": result.get("chunks", []),
    }


def main() -> int:
    dataset = json.loads(DATASET_PATH.read_text(encoding="utf-8"))
    cases = dataset["cases"]
    started_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    case_results = [evaluate_case(case) for case in cases]
    passed = sum(1 for result in case_results if result["passed"])
    run = {
        "run_id": f"{dataset['dataset_id']}_{started_at.replace(':', '').replace('+', 'Z')}",
        "started_at": started_at,
        "dataset_id": dataset["dataset_id"],
        "dataset_version": dataset.get("version"),
        "eval_cases": str(DATASET_PATH.relative_to(ROOT)),
        "case_count": len(case_results),
        "passed": passed,
        "failed": len(case_results) - passed,
        "retrieval_method": "rank_bm25",
        "summary_provider": PROVIDER_NAME,
        "results": case_results,
    }
    RUNS_DIR.mkdir(parents=True, exist_ok=True)
    out_path = RUNS_DIR / f"{run['run_id']}.json"
    out_path.write_text(json.dumps(run, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"saved={out_path}")
    print(f"passed={run['passed']}/{run['case_count']}")
    return 0 if passed == len(case_results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
