from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from json import JSONDecodeError
from typing import Any, Literal

from providers.base import Provider
from retrieval.transcript_loader import SlideContext
from tools import get_marked_transcript_context

QuizStatus = Literal["QUIZ_READY", "PARTIAL", "INSUFFICIENT_EVIDENCE"]


@dataclass(frozen=True, slots=True)
class QuizQuestion:
    question: str
    options: tuple[str, str, str, str]
    correct_option_index: int
    explanation: str
    citations: tuple[str, ...]

    def to_payload(self) -> dict[str, Any]:
        return {
            "question": self.question,
            "options": list(self.options),
            "correct_option_index": self.correct_option_index,
            "explanation": self.explanation,
            "citations": list(self.citations),
        }


@dataclass(frozen=True, slots=True)
class QuizResult:
    status: QuizStatus
    requested_count: int
    reason: str | None
    questions: tuple[QuizQuestion, ...]
    chunks: tuple[dict[str, str | int], ...]
    provider: str
    model: str | None

    def to_payload(self) -> dict[str, Any]:
        return {
            "status": self.status,
            "requested_count": self.requested_count,
            "reason": self.reason,
            "questions": [question.to_payload() for question in self.questions],
            "chunks": list(self.chunks),
            "provider": self.provider,
            "model": self.model,
        }


@dataclass(frozen=True, slots=True)
class QuizGenerationRequest:
    scope: Literal["slide", "all"]
    requested_count: int
    slide_id: str
    slide_title: str
    slide_text: str
    nearby_text: tuple[str, ...]

    @property
    def retrieval_query(self) -> str:
        parts = (self.slide_title, self.slide_text, *self.nearby_text)
        return " ".join(part.strip() for part in parts if part.strip())

    @property
    def slide_context(self) -> SlideContext:
        return SlideContext(
            slide_id=self.slide_id,
            slide_title=self.slide_title,
            nearby_text=self.nearby_text,
            slide_text=self.slide_text,
        )


def generate_quiz_from_transcript(
    request_data: QuizGenerationRequest,
    provider: Provider,
    provider_name: str,
) -> QuizResult:
    context = get_marked_transcript_context(request_data.retrieval_query, request_data.slide_context)
    chunks = tuple(context.get("chunks", []))
    if not chunks:
        return insufficient_result(
            request_data,
            provider_name,
            getattr(provider, "default_model", None),
            (),
            "Không tìm thấy transcript đủ gần để tạo câu hỏi ôn tập.",
        )

    model = getattr(provider, "default_model", None)
    response = provider.complete(
        quiz_messages(request_data, chunks),
        tools=None,
        model=model,
        temperature=0.1,
    )
    return normalize_provider_quiz(
        raw_text=response.text or "",
        request_data=request_data,
        chunks=chunks,
        provider_name=provider_name,
        model=model,
    )


def quiz_messages(
    request_data: QuizGenerationRequest,
    chunks: tuple[dict[str, str | int], ...],
) -> list[dict[str, str]]:
    source_text = "\n\n".join(
        f"[{chunk['paragraph_id']}] {chunk['text']}"
        for chunk in chunks
        if chunk.get("paragraph_id") and chunk.get("text")
    )
    return [
        {
            "role": "system",
            "content": (
                "Bạn tạo quiz tự ôn cho VLearn. Chỉ dùng transcript được cung cấp. "
                "Nếu không đủ căn cứ để có đúng một đáp án, trả INSUFFICIENT_EVIDENCE. "
                "Mỗi câu phải có 4 phương án, đúng một đáp án, giải thích ngắn và citation."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Phạm vi: {request_data.scope}\n"
                f"Số câu yêu cầu: {request_data.requested_count}\n"
                f"Slide: {request_data.slide_title}\n"
                f"Nội dung slide: {request_data.slide_text}\n\n"
                f"Transcript context:\n{source_text}\n\n"
                "Trả về JSON thuần theo schema: "
                '{"status":"QUIZ_READY|PARTIAL|INSUFFICIENT_EVIDENCE",'
                '"requested_count":number,"reason":string|null,"questions":[{"question":string,'
                '"options":[string,string,string,string],"correct_option_index":number,'
                '"explanation":string,"citations":[string]}]}.'
            ),
        },
    ]


def normalize_provider_quiz(
    *,
    raw_text: str,
    request_data: QuizGenerationRequest,
    chunks: tuple[dict[str, str | int], ...],
    provider_name: str,
    model: str | None,
) -> QuizResult:
    payload = parse_json_payload(raw_text)
    if payload is None:
        return insufficient_result(
            request_data,
            provider_name,
            model,
            chunks,
            "Provider không trả JSON hợp lệ để render quiz.",
        )

    if payload.get("status") == "INSUFFICIENT_EVIDENCE":
        reason = text_or_none(payload.get("reason")) or "Transcript không đủ căn cứ."
        return insufficient_result(request_data, provider_name, model, chunks, reason)

    valid_questions = tuple(
        question
        for item in payload.get("questions", [])
        if (question := parse_question(item, chunks)) is not None
    )
    if not valid_questions:
        return insufficient_result(
            request_data,
            provider_name,
            model,
            chunks,
            "Không có câu hỏi nào qua guardrail citation và cấu trúc.",
        )

    if len(valid_questions) < request_data.requested_count:
        return QuizResult(
            status="PARTIAL",
            requested_count=request_data.requested_count,
            reason=f"Phạm vi này chỉ tạo được {len(valid_questions)}/{request_data.requested_count} câu qua guardrail.",
            questions=valid_questions,
            chunks=chunks,
            provider=provider_name,
            model=model,
        )

    return QuizResult(
        status="QUIZ_READY",
        requested_count=request_data.requested_count,
        reason=text_or_none(payload.get("reason")),
        questions=valid_questions[: request_data.requested_count],
        chunks=chunks,
        provider=provider_name,
        model=model,
    )


def parse_json_payload(raw_text: str) -> dict[str, Any] | None:
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    try:
        parsed = json.loads(cleaned)
    except JSONDecodeError:
        return None
    if not isinstance(parsed, dict):
        return None
    return parsed


def parse_question(item: Any, chunks: tuple[dict[str, str | int], ...]) -> QuizQuestion | None:
    if not isinstance(item, dict):
        return None
    options = item.get("options")
    citations = item.get("citations")
    answer_index = item.get("correct_option_index")
    if not isinstance(options, list) or len(options) != 4:
        return None
    if not isinstance(citations, list) or not citations:
        return None
    if not isinstance(answer_index, int) or answer_index < 0 or answer_index > 3:
        return None

    allowed_citations = {str(chunk["paragraph_id"]) for chunk in chunks if chunk.get("paragraph_id")}
    clean_citations = tuple(
        str(citation).strip().removeprefix("[").removesuffix("]")
        for citation in citations
        if str(citation).strip()
    )
    if not clean_citations or any(citation not in allowed_citations for citation in clean_citations):
        return None

    clean_options = tuple(str(option).strip() for option in options)
    if any(not option for option in clean_options):
        return None

    question = str(item.get("question", "")).strip()
    explanation = str(item.get("explanation", "")).strip()
    if not question or not explanation:
        return None

    return QuizQuestion(
        question=question,
        options=(clean_options[0], clean_options[1], clean_options[2], clean_options[3]),
        correct_option_index=answer_index,
        explanation=explanation,
        citations=clean_citations,
    )


def insufficient_result(
    request_data: QuizGenerationRequest,
    provider_name: str,
    model: str | None,
    chunks: tuple[dict[str, str | int], ...],
    reason: str,
) -> QuizResult:
    return QuizResult(
        status="INSUFFICIENT_EVIDENCE",
        requested_count=request_data.requested_count,
        reason=reason,
        questions=(),
        chunks=chunks,
        provider=provider_name,
        model=model,
    )


def text_or_none(value: Any) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None
