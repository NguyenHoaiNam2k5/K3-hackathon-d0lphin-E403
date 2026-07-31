from __future__ import annotations

from typing import Final

from retrieval.bm25_index import ScoredTranscriptParagraph
from retrieval.transcript_loader import load_transcript_paragraphs

MAX_CONTEXT_CHUNKS: Final = 9
MIN_NEIGHBOR_SCORE: Final = 1.0


def select_context_chunks(ranked: list[ScoredTranscriptParagraph]) -> list[ScoredTranscriptParagraph]:
    positive_matches = [item for item in ranked if item.score > 0]
    if not positive_matches:
        return []

    selected: list[ScoredTranscriptParagraph] = []
    selected_ids: set[str] = set()
    score_by_paragraph = {item.paragraph: item.score for item in ranked}
    top_paragraph = positive_matches[0].paragraph
    for item in positive_matches:
        if item.paragraph.paragraph_id in selected_ids:
            continue
        selected.append(item)
        selected_ids.add(item.paragraph.paragraph_id)
        if len(selected) >= MAX_CONTEXT_CHUNKS:
            break

    source_paragraphs = [
        paragraph
        for paragraph in load_transcript_paragraphs()
        if paragraph.source == top_paragraph.source
    ]
    source_index = source_paragraphs.index(top_paragraph)
    neighbor_indices = range(max(0, source_index - 2), min(len(source_paragraphs), source_index + 3))
    for index in neighbor_indices:
        paragraph = source_paragraphs[index]
        if paragraph.paragraph_id in selected_ids:
            continue
        score = score_by_paragraph.get(paragraph, 0.0)
        if score < MIN_NEIGHBOR_SCORE:
            continue
        selected.append(ScoredTranscriptParagraph(paragraph=paragraph, score=score))
        selected_ids.add(paragraph.paragraph_id)
        if len(selected) >= MAX_CONTEXT_CHUNKS:
            break
    return selected[:MAX_CONTEXT_CHUNKS]
