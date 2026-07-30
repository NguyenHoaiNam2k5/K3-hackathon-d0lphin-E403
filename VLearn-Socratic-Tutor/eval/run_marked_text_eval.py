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
import re
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = ROOT / "src"
sys.path.insert(0, str(SRC_DIR))

from app import apply_deepseek_summary  # noqa: E402
from tools import SlideContext, get_marked_transcript_context  # noqa: E402

DATASET_PATH = ROOT / "eval" / "golden_set.json"
RUNS_DIR = ROOT / "eval" / "runs"
CITATION_RE = re.compile(r"\[T\d{2}-\d{3}\]")
TEXT_TOKEN_RE = re.compile(r"[\wÀ-ỹ]+", re.UNICODE)
GUARDRAIL_STOPWORDS = {
    "anh",
    "ban",
    "bạn",
    "cac",
    "các",
    "cho",
    "cua",
    "của",
    "duoc",
    "được",
    "la",
    "là",
    "mot",
    "một",
    "nhu",
    "như",
    "the",
    "thế",
    "thi",
    "thì",
    "trong",
    "va",
    "và",
    "voi",
    "với",
}


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


def normalized(text):
    decomposed = unicodedata.normalize("NFD", str(text).casefold())
    return "".join(char for char in decomposed if unicodedata.category(char) != "Mn").replace("đ", "d")


def meaningful_tokens(text):
    tokens = TEXT_TOKEN_RE.findall(normalized(text).replace("/", " "))
    return [token for token in tokens if len(token) > 1 and token not in GUARDRAIL_STOPWORDS]


def concept_is_present(answer_text, concept):
    answer_tokens = set(meaningful_tokens(answer_text))
    concept_tokens = meaningful_tokens(concept)
    if not concept_tokens:
        return True
    matches = sum(1 for token in concept_tokens if token in answer_tokens)
    needed = 1 if "/" in concept else max(1, round(len(concept_tokens) * 0.6))
    return matches >= needed


def forbidden_claim_is_present(answer_text, claim):
    return normalized(claim) in normalized(answer_text)


def guardrail_result(name, passed, expected, observed):
    return {
        "name": name,
        "passed": passed,
        "expected": expected,
        "observed": observed,
    }


def grade_guardrails(case, retrieval_result, chunk_ids):
    guardrails = case["guardrails"]
    answer_text = retrieval_result.get("assistant_text") or ""
    answer_citations = CITATION_RE.findall(answer_text)
    required_context_citations = guardrails["required_citations_in_context"]
    missing_context = [citation for citation in required_context_citations if citation not in chunk_ids]
    missing_sections = [
        section for section in guardrails["must_include_answer_sections"]
        if normalized(section) not in normalized(answer_text)
    ]
    missing_concepts = [
        concept for concept in guardrails["required_concepts_in_answer"]
        if not concept_is_present(answer_text, concept)
    ]
    forbidden_claims = [
        claim for claim in guardrails["forbidden_claims_in_answer"]
        if forbidden_claim_is_present(answer_text, claim)
    ]
    outside_citations = [citation for citation in answer_citations if citation.strip("[]") not in chunk_ids]
    refusal_markers = guardrails.get("refusal_markers", [])
    refusal_present = any(normalized(marker) in normalized(answer_text) for marker in refusal_markers)
    checks = [
        guardrail_result(
            "retrieval_method",
            retrieval_result.get("retrieval_method") == "rank_bm25",
            "rank_bm25",
            retrieval_result.get("retrieval_method"),
        ),
        guardrail_result(
            "deepseek_generation",
            retrieval_result.get("summary_provider") == "deepseek"
            and retrieval_result.get("summary_status") == "generated",
            {"summary_provider": "deepseek", "summary_status": "generated"},
            {
                "summary_provider": retrieval_result.get("summary_provider"),
                "summary_status": retrieval_result.get("summary_status"),
            },
        ),
        guardrail_result(
            "required_citations_in_context",
            not missing_context,
            required_context_citations,
            {"returned": chunk_ids, "missing": missing_context},
        ),
        guardrail_result(
            "answer_has_citation",
            bool(answer_citations),
            "at least one [Txx-xxx] citation",
            answer_citations,
        ),
        guardrail_result(
            "answer_citations_subset_of_context",
            not outside_citations,
            "all answer citations must be retrieved chunks",
            {"answer_citations": answer_citations, "outside_citations": outside_citations},
        ),
        guardrail_result(
            "required_answer_sections",
            not missing_sections,
            guardrails["must_include_answer_sections"],
            {"missing": missing_sections},
        ),
        guardrail_result(
            "required_concepts_in_answer",
            not missing_concepts,
            guardrails["required_concepts_in_answer"],
            {"missing": missing_concepts},
        ),
        guardrail_result(
            "forbidden_claims_absent",
            not forbidden_claims,
            guardrails["forbidden_claims_in_answer"],
            {"found": forbidden_claims},
        ),
    ]
    if guardrails["must_refuse_out_of_scope"]:
        checks.append(
            guardrail_result(
                "out_of_scope_refusal",
                refusal_present,
                refusal_markers,
                answer_text,
            )
        )
    return {
        "passed": all(check["passed"] for check in checks),
        "checks": checks,
    }


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
    result = apply_deepseek_summary(
        result,
        case["input"]["marked_text"],
        case["input"].get("student_question") or "",
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
        "summary_provider": "deepseek",
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
