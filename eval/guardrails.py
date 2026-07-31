from __future__ import annotations

import re
import unicodedata
from dataclasses import dataclass
from typing import Any, Final

CITATION_RE: Final = re.compile(r"\[T\d{2}-\d{3}\]")
TEXT_TOKEN_RE: Final = re.compile(r"[\wÀ-ỹ]+", re.UNICODE)
GUARDRAIL_STOPWORDS: Final = {
    "anh", "ban", "bạn", "cac", "các", "cho", "cua", "của", "duoc", "được",
    "la", "là", "mot", "một", "nhu", "như", "the", "thế", "thi", "thì",
    "trong", "va", "và", "voi", "với",
}


@dataclass(frozen=True, slots=True)
class GuardrailEvidence:
    retrieval_result: dict[str, Any]
    guardrails: dict[str, Any]
    chunk_ids: list[str]
    answer_text: str
    answer_citations: list[str]
    required_context_citations: list[str]
    missing_context: list[str]
    missing_sections: list[str]
    missing_concepts: list[str]
    forbidden_claims: list[str]
    outside_citations: list[str]


@dataclass(frozen=True, slots=True)
class GuardrailCheck:
    name: str
    passed: bool
    expected: Any
    observed: Any

    def as_dict(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "passed": self.passed,
            "expected": self.expected,
            "observed": self.observed,
        }


def normalized(text: str) -> str:
    decomposed = unicodedata.normalize("NFD", str(text).casefold())
    return "".join(char for char in decomposed if unicodedata.category(char) != "Mn").replace("đ", "d")


def meaningful_tokens(text: str) -> list[str]:
    tokens = TEXT_TOKEN_RE.findall(normalized(text).replace("/", " "))
    return [token for token in tokens if len(token) > 1 and token not in GUARDRAIL_STOPWORDS]


def concept_is_present(answer_text: str, concept: str) -> bool:
    answer_tokens = set(meaningful_tokens(answer_text))
    concept_tokens = meaningful_tokens(concept)
    if not concept_tokens:
        return True
    matches = sum(1 for token in concept_tokens if token in answer_tokens)
    needed = 1 if "/" in concept else max(1, round(len(concept_tokens) * 0.6))
    return matches >= needed


def forbidden_claim_is_present(answer_text: str, claim: str) -> bool:
    return normalized(claim) in normalized(answer_text)


def grade_guardrails(case: dict[str, Any], retrieval_result: dict[str, Any], chunk_ids: list[str]) -> dict[str, Any]:
    evidence = build_evidence(case, retrieval_result, chunk_ids)
    checks = [check.as_dict() for check in base_checks(evidence)]
    if evidence.guardrails["must_refuse_out_of_scope"]:
        checks.append(refusal_check(evidence).as_dict())
    return {"passed": all(check["passed"] for check in checks), "checks": checks}


def build_evidence(case: dict[str, Any], retrieval_result: dict[str, Any], chunk_ids: list[str]) -> GuardrailEvidence:
    guardrails = case["guardrails"]
    answer_text = retrieval_result.get("assistant_text") or ""
    answer_citations = CITATION_RE.findall(answer_text)
    required_context_citations = guardrails["required_citations_in_context"]
    return GuardrailEvidence(
        retrieval_result=retrieval_result,
        guardrails=guardrails,
        chunk_ids=chunk_ids,
        answer_text=answer_text,
        answer_citations=answer_citations,
        required_context_citations=required_context_citations,
        missing_context=[citation for citation in required_context_citations if citation not in chunk_ids],
        missing_sections=[
            section for section in guardrails["must_include_answer_sections"]
            if normalized(section) not in normalized(answer_text)
        ],
        missing_concepts=[
            concept for concept in guardrails["required_concepts_in_answer"]
            if not concept_is_present(answer_text, concept)
        ],
        forbidden_claims=[
            claim for claim in guardrails["forbidden_claims_in_answer"]
            if forbidden_claim_is_present(answer_text, claim)
        ],
        outside_citations=[citation for citation in answer_citations if citation.strip("[]") not in chunk_ids],
    )


def base_checks(evidence: GuardrailEvidence) -> list[GuardrailCheck]:
    return [
        GuardrailCheck("retrieval_method", evidence.retrieval_result.get("retrieval_method") == "rank_bm25", "rank_bm25", evidence.retrieval_result.get("retrieval_method")),
        GuardrailCheck(
            "deepseek_generation",
            evidence.retrieval_result.get("summary_provider") == "deepseek" and evidence.retrieval_result.get("summary_status") == "generated",
            {"summary_provider": "deepseek", "summary_status": "generated"},
            {"summary_provider": evidence.retrieval_result.get("summary_provider"), "summary_status": evidence.retrieval_result.get("summary_status")},
        ),
        GuardrailCheck("required_citations_in_context", not evidence.missing_context, evidence.required_context_citations, {"returned": evidence.chunk_ids, "missing": evidence.missing_context}),
        GuardrailCheck("answer_has_citation", bool(evidence.answer_citations), "at least one [Txx-xxx] citation", evidence.answer_citations),
        GuardrailCheck(
            "answer_citations_subset_of_context",
            not evidence.outside_citations,
            "all answer citations must be retrieved chunks",
            {"answer_citations": evidence.answer_citations, "outside_citations": evidence.outside_citations},
        ),
        GuardrailCheck("required_answer_sections", not evidence.missing_sections, evidence.guardrails["must_include_answer_sections"], {"missing": evidence.missing_sections}),
        GuardrailCheck("required_concepts_in_answer", not evidence.missing_concepts, evidence.guardrails["required_concepts_in_answer"], {"missing": evidence.missing_concepts}),
        GuardrailCheck("forbidden_claims_absent", not evidence.forbidden_claims, evidence.guardrails["forbidden_claims_in_answer"], {"found": evidence.forbidden_claims}),
    ]


def refusal_check(evidence: GuardrailEvidence) -> GuardrailCheck:
    refusal_markers = evidence.guardrails.get("refusal_markers", [])
    refusal_present = any(normalized(marker) in normalized(evidence.answer_text) for marker in refusal_markers)
    return GuardrailCheck("out_of_scope_refusal", refusal_present, refusal_markers, evidence.answer_text)
