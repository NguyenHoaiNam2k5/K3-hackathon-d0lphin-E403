from __future__ import annotations

import re
from dataclasses import dataclass
from functools import lru_cache
from typing import Any, Final

from data_pack import TRANSCRIPT_DIR

PARAGRAPH_RE: Final = re.compile(r"^\*\*\[(T\d{2}-\d{3})\]\*\*\s+(.*)$")
WORD_RE: Final = re.compile(r"[\wÀ-ỹ]+", re.UNICODE)
STOPWORDS: Final = {
    "ai",
    "anh",
    "ban",
    "bạn",
    "cach",
    "các",
    "cho",
    "con",
    "của",
    "duoc",
    "được",
    "hieu",
    "hiểu",
    "hoat",
    "hoạt",
    "dong",
    "động",
    "la",
    "là",
    "mot",
    "một",
    "nhu",
    "như",
    "phan",
    "phần",
    "qua",
    "sao",
    "the",
    "thế",
    "thi",
    "thì",
    "trong",
    "nao",
    "nào",
    "va",
    "và",
    "voi",
    "với",
}
SEARCH_SYNONYMS: Final = {
    "attention": ("attention", "self", "chú", "ý", "chu"),
    "economy": ("economy", "kinh", "tế", "te"),
    "embedding": ("embedding", "nhúng", "nhung", "vectơ", "vector"),
    "hallucination": ("hallucination", "ảo", "giác", "ao", "giac"),
    "prediction": ("prediction", "predict", "dự", "đoán", "du", "doan", "kế", "tiếp", "ke", "tiep"),
    "next": ("next", "kế", "tiếp", "ke", "tiep"),
    "temperature": ("temperature", "sáng", "tạo", "random", "xác", "suất"),
    "token": ("token",),
    "vector": ("vector", "vectơ", "nhúng", "embedding"),
}
MAX_CONTEXT_CHUNKS: Final = 7


@dataclass(frozen=True, slots=True)
class TranscriptParagraph:
    paragraph_id: str
    source: str
    line: int
    text: str


@dataclass(frozen=True, slots=True)
class SlideContext:
    slide_id: str
    slide_title: str
    nearby_text: tuple[str, ...]
    slide_text: str


def _words(value: str) -> set[str]:
    return {word.lower() for word in WORD_RE.findall(value.replace("-", " ")) if len(word) > 1}


def _context_text(context: SlideContext) -> str:
    return " ".join((context.slide_title, *context.nearby_text, context.slide_text))


def _expanded_query_terms(marked_text: str, context: SlideContext | None = None) -> set[str]:
    terms = _words(marked_text) - STOPWORDS
    if context is not None:
        terms.update(_words(_context_text(context)) - STOPWORDS)
    expanded = set(terms)
    for term in terms:
        expanded.update(SEARCH_SYNONYMS.get(term, (term,)))
    return expanded - STOPWORDS


@lru_cache(maxsize=1)
def _load_transcript_paragraphs() -> tuple[TranscriptParagraph, ...]:
    paragraphs: list[TranscriptParagraph] = []
    for path in sorted(TRANSCRIPT_DIR.glob("transcript-*-clean.md")):
        for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
            match = PARAGRAPH_RE.match(line)
            if match is None:
                continue
            paragraphs.append(
                TranscriptParagraph(
                    paragraph_id=match.group(1),
                    source=path.name,
                    line=line_number,
                    text=match.group(2),
                )
            )
    return tuple(paragraphs)


def _phrase_score(text: str, query_text: str) -> int:
    text_lower = text.lower()
    query_words = list(_words(query_text) - STOPWORDS)
    score = 0
    for word in query_words:
        if word in text_lower:
            score += 1
    for index in range(len(query_words) - 1):
        phrase = f"{query_words[index]} {query_words[index + 1]}"
        if phrase in text_lower:
            score += 3
    return score


def _score_paragraph(paragraph: TranscriptParagraph, marked_text: str, context: SlideContext) -> int:
    marked_terms = _expanded_query_terms(marked_text)
    context_terms = _expanded_query_terms("", context)
    query_terms = marked_terms | context_terms
    paragraph_terms = _words(paragraph.text)
    score = (len(marked_terms & paragraph_terms) * 4) + len(context_terms & paragraph_terms)
    score += _phrase_score(paragraph.text, marked_text) * 2
    score += _phrase_score(paragraph.text, _context_text(context))
    if query_terms and len(query_terms & paragraph_terms) >= 3:
        score += 3
    return score


def _build_socratic_answer(marked_text: str, chunks: list[dict[str, str | int]]) -> str:
    citations = ", ".join(f"[{chunk['paragraph_id']}]" for chunk in chunks[:3])
    return (
        f"Mình tìm thấy phần transcript phù hợp cho phần bạn mark: “{marked_text}”. "
        "Mình sẽ dùng các đoạn lời giảng liên quan nhất để giải thích đúng theo transcript. "
        "Bạn thử đọc lại các đoạn trích này và tự nói một câu: thầy đang nhấn mạnh khái niệm nào nhất? "
        f"Nguồn: {citations}."
    )


def _build_summary(marked_text: str, chunks: list[dict[str, str | int]]) -> dict[str, str | list[str]]:
    citations = [str(chunk["paragraph_id"]) for chunk in chunks[:3]]
    return {
        "title": marked_text,
        "short": (
            f"Mình tìm thấy {len(chunks)} đoạn transcript liên quan tới phần bạn mark. "
            f"Hãy bắt đầu từ {', '.join(f'[{citation}]' for citation in citations)}."
        ),
        "socratic_question": (
            "Theo các đoạn transcript này, đâu là ý chính mà giảng viên muốn bạn nhớ?"
        ),
        "citations": citations,
    }


def _chunk_payload(paragraphs: list[TranscriptParagraph]) -> list[dict[str, str | int]]:
    return [
        {
            "paragraph_id": paragraph.paragraph_id,
            "source": paragraph.source,
            "line": paragraph.line,
            "text": paragraph.text,
        }
        for paragraph in paragraphs
    ]


def _rank_paragraphs(marked_text: str, context: SlideContext) -> list[TranscriptParagraph]:
    return sorted(
        _load_transcript_paragraphs(),
        key=lambda paragraph: (_score_paragraph(paragraph, marked_text, context), -paragraph.line),
        reverse=True,
    )


def _select_context_chunks(
    ranked: list[TranscriptParagraph],
    marked_text: str,
    context: SlideContext,
) -> list[TranscriptParagraph]:
    scored = [
        paragraph
        for paragraph in ranked
        if _score_paragraph(paragraph, marked_text, context) > 0
    ]
    if not scored:
        return []

    selected: list[TranscriptParagraph] = []
    selected_ids: set[str] = set()
    top = scored[0]
    source_paragraphs = [
        paragraph
        for paragraph in _load_transcript_paragraphs()
        if paragraph.source == top.source
    ]
    source_index = source_paragraphs.index(top)
    for paragraph in source_paragraphs[source_index:source_index + 3]:
        selected.append(paragraph)
        selected_ids.add(paragraph.paragraph_id)

    for paragraph in scored:
        if paragraph.paragraph_id in selected_ids:
            continue
        selected.append(paragraph)
        selected_ids.add(paragraph.paragraph_id)
        if len(selected) >= MAX_CONTEXT_CHUNKS:
            break
    return selected[:MAX_CONTEXT_CHUNKS]


def get_marked_transcript_context(marked_text: str, context: SlideContext | None = None) -> dict[str, Any]:
    selected_text = marked_text.strip()
    slide_context = context or SlideContext(slide_id="unknown", slide_title="", nearby_text=(), slide_text="")
    if not selected_text:
        return {
            "status": "empty_marked_text",
            "slide_id": slide_context.slide_id,
            "slide_title": slide_context.slide_title,
            "marked_text": marked_text,
            "chunks": [],
            "assistant_text": "Bạn hãy chọn hoặc bôi đen một phần nội dung trên slide trước nhé.",
        }

    ranked = _rank_paragraphs(selected_text, slide_context)
    matched = _select_context_chunks(ranked, selected_text, slide_context)
    chunks = _chunk_payload(matched)

    if not chunks:
        return {
            "status": "no_match",
            "slide_id": slide_context.slide_id,
            "slide_title": slide_context.slide_title,
            "nearby_text": list(slide_context.nearby_text),
            "marked_text": selected_text,
            "chunks": [],
            "assistant_text": "Mình chưa tìm thấy đoạn transcript đủ gần với phần bạn mark.",
        }

    return {
        "status": "matched",
        "slide_id": slide_context.slide_id,
        "slide_title": slide_context.slide_title,
        "nearby_text": list(slide_context.nearby_text),
        "marked_text": selected_text,
        "primary_paragraph_id": chunks[0]["paragraph_id"],
        "confidence": min(0.98, 0.55 + (_score_paragraph(matched[0], selected_text, slide_context) / 50)),
        "retrieval_method": "general_transcript_search",
        "summary": _build_summary(selected_text, chunks),
        "chunks": chunks,
        "assistant_text": _build_socratic_answer(selected_text, chunks),
    }
