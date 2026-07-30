from __future__ import annotations

from typing import Any

from retrieval.bm25_index import scored_paragraphs
from retrieval.context_selector import select_context_chunks
from retrieval.response_builder import empty_response, matched_response, no_match_response
from retrieval.transcript_loader import SlideContext


def get_marked_transcript_context(marked_text: str, context: SlideContext | None = None) -> dict[str, Any]:
    selected_text = marked_text.strip()
    slide_context = context or SlideContext(slide_id="unknown", slide_title="", nearby_text=(), slide_text="")
    if not selected_text:
        return empty_response(marked_text, slide_context)

    ranked = scored_paragraphs(selected_text, slide_context)
    matched = select_context_chunks(ranked)
    if not matched:
        return no_match_response(selected_text, slide_context)
    return matched_response(selected_text, slide_context, matched)
