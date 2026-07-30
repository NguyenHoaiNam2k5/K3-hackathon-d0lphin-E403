from __future__ import annotations

import re
from dataclasses import dataclass
from functools import lru_cache
from typing import Final

from rank_bm25 import BM25Okapi

from retrieval.transcript_loader import SlideContext, TranscriptParagraph, load_transcript_paragraphs

WORD_RE: Final = re.compile(r"[\wÀ-ỹ]+", re.UNICODE)
STOPWORDS: Final = {
    "ai", "anh", "ban", "bạn", "cach", "các", "cho", "con", "của", "duoc", "được",
    "hieu", "hiểu", "hoat", "hoạt", "dong", "động", "la", "là", "mot", "một",
    "nhu", "như", "phan", "phần", "qua", "sao", "the", "thế", "thi", "thì",
    "trong", "nao", "nào", "va", "và", "voi", "với",
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


@dataclass(frozen=True, slots=True)
class TranscriptSearchIndex:
    paragraphs: tuple[TranscriptParagraph, ...]
    model: BM25Okapi


@dataclass(frozen=True, slots=True)
class ScoredTranscriptParagraph:
    paragraph: TranscriptParagraph
    score: float


def context_text(context: SlideContext) -> str:
    return " ".join((context.slide_title, *context.nearby_text, context.slide_text))


def tokens(value: str) -> list[str]:
    return [word.lower() for word in WORD_RE.findall(value.replace("-", " ")) if len(word) > 1]


def words(value: str) -> set[str]:
    return set(tokens(value))


def expanded_query_terms(marked_text: str, context: SlideContext | None = None) -> set[str]:
    terms = words(marked_text) - STOPWORDS
    if context is not None:
        terms.update(words(context_text(context)) - STOPWORDS)
    expanded = set(terms)
    for term in terms:
        expanded.update(SEARCH_SYNONYMS.get(term, (term,)))
    return expanded - STOPWORDS


def bm25_query(marked_text: str, context: SlideContext) -> list[str]:
    marked_terms = sorted(expanded_query_terms(marked_text))
    context_terms = sorted(expanded_query_terms("", context) - set(marked_terms))
    return [*marked_terms, *marked_terms, *marked_terms, *context_terms]


@lru_cache(maxsize=1)
def search_index() -> TranscriptSearchIndex:
    paragraphs = load_transcript_paragraphs()
    corpus = [[token for token in tokens(paragraph.text) if token not in STOPWORDS] for paragraph in paragraphs]
    return TranscriptSearchIndex(paragraphs=paragraphs, model=BM25Okapi(corpus))


def scored_paragraphs(marked_text: str, context: SlideContext) -> list[ScoredTranscriptParagraph]:
    index = search_index()
    scores = index.model.get_scores(bm25_query(marked_text, context))
    paired = (
        ScoredTranscriptParagraph(paragraph=paragraph, score=float(score))
        for paragraph, score in zip(index.paragraphs, scores, strict=True)
    )
    return sorted(paired, key=lambda item: (item.score, -item.paragraph.line), reverse=True)


def rank_paragraphs(marked_text: str, context: SlideContext) -> list[TranscriptParagraph]:
    return [item.paragraph for item in scored_paragraphs(marked_text, context)]


def score_paragraph(paragraph: TranscriptParagraph, marked_text: str, context: SlideContext) -> float:
    index = search_index()
    scores = index.model.get_scores(bm25_query(marked_text, context))
    paragraph_index = index.paragraphs.index(paragraph)
    return float(scores[paragraph_index])
