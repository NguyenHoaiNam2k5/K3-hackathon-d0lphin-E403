from __future__ import annotations

from typing import Any

from retrieval.bm25_index import ScoredTranscriptParagraph
from retrieval.transcript_loader import SlideContext


def chunk_payload(matches: list[ScoredTranscriptParagraph]) -> list[dict[str, str | int]]:
    return [
        {
            "paragraph_id": match.paragraph.paragraph_id,
            "source": match.paragraph.source,
            "line": match.paragraph.line,
            "text": match.paragraph.text,
        }
        for match in matches
    ]


def build_socratic_answer(marked_text: str, chunks: list[dict[str, str | int]]) -> str:
    citations = ", ".join(f"[{chunk['paragraph_id']}]" for chunk in chunks[:3])
    return (
        f"Mình tìm thấy phần transcript phù hợp cho phần bạn mark: “{marked_text}”. "
        "Mình sẽ dùng các đoạn lời giảng liên quan nhất để giải thích đúng theo transcript. "
        "Bạn thử đọc lại các đoạn trích này và tự nói một câu: thầy đang nhấn mạnh khái niệm nào nhất? "
        f"Nguồn: {citations}."
    )


def build_summary(marked_text: str, chunks: list[dict[str, str | int]]) -> dict[str, str | list[str]]:
    citations = [str(chunk["paragraph_id"]) for chunk in chunks[:3]]
    return {
        "title": marked_text,
        "short": (
            f"Mình tìm thấy {len(chunks)} đoạn transcript liên quan tới phần bạn mark. "
            f"Hãy bắt đầu từ {', '.join(f'[{citation}]' for citation in citations)}."
        ),
        "socratic_question": "Theo các đoạn transcript này, đâu là ý chính mà giảng viên muốn bạn nhớ?",
        "citations": citations,
    }


def empty_response(marked_text: str, context: SlideContext) -> dict[str, Any]:
    return {
        "status": "empty_marked_text",
        "slide_id": context.slide_id,
        "slide_title": context.slide_title,
        "marked_text": marked_text,
        "chunks": [],
        "assistant_text": "Bạn hãy chọn hoặc bôi đen một phần nội dung trên slide trước nhé.",
    }


def no_match_response(marked_text: str, context: SlideContext) -> dict[str, Any]:
    return {
        "status": "no_match",
        "slide_id": context.slide_id,
        "slide_title": context.slide_title,
        "nearby_text": list(context.nearby_text),
        "marked_text": marked_text,
        "chunks": [],
        "assistant_text": "Mình chưa tìm thấy đoạn transcript đủ gần với phần bạn mark.",
    }


def matched_response(
    marked_text: str,
    context: SlideContext,
    matched: list[ScoredTranscriptParagraph],
) -> dict[str, Any]:
    chunks = chunk_payload(matched)
    return {
        "status": "matched",
        "slide_id": context.slide_id,
        "slide_title": context.slide_title,
        "nearby_text": list(context.nearby_text),
        "marked_text": marked_text,
        "primary_paragraph_id": chunks[0]["paragraph_id"],
        "confidence": min(0.98, 0.55 + (matched[0].score / 50)),
        "retrieval_method": "rank_bm25",
        "summary": build_summary(marked_text, chunks),
        "chunks": chunks,
        "assistant_text": build_socratic_answer(marked_text, chunks),
    }
