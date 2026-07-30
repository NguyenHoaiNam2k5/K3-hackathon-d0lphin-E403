from __future__ import annotations

from pathlib import Path
import sys

SRC_DIR = Path(__file__).resolve().parents[1] / "src"
sys.path.insert(0, str(SRC_DIR))

from data_pack import data_pack_summary
from tools import SlideContext, get_marked_transcript_context, get_transcript_chunk


def test_marked_text_finds_llm_operation_context() -> None:
    # Given: learner marks a broad learning objective on the Day 1 slide.
    marked_text = "Hiểu cách LLM hoạt động (Transformer, token, next-token prediction)"
    context = SlideContext(
        slide_id="day1-slide-02",
        slide_title="Mục tiêu bài học",
        nearby_text=("AI năm 2025-2026", "Trái tim của AI hiện đại", "Token economy"),
        slide_text=marked_text,
    )

    # When: the server resolves that marked text against the cleaned transcript pack.
    result = get_marked_transcript_context(marked_text, context)

    # Then: the response is grounded in the stable transcript paragraph IDs.
    chunk_ids = [chunk["paragraph_id"] for chunk in result["chunks"]]
    assert result["status"] == "matched"
    assert result["retrieval_method"] == "general_transcript_search"
    assert result["slide_title"] == "Mục tiêu bài học"
    assert "Token economy" in result["nearby_text"]
    assert result["primary_paragraph_id"] == "T06-126"
    assert "T06-126" in chunk_ids
    assert "T06-136" in chunk_ids
    assert result["summary"]["citations"] == ["T06-126", "T06-127", "T06-128"]
    assert "Transformer" in result["assistant_text"]


def test_transcript_tool_accepts_marked_text() -> None:
    # Given: the existing tool is called with marked text instead of a demo hotspot.
    marked_text = "Hiểu cách LLM hoạt động (Transformer, token, next-token prediction)"

    # When: the tool resolves transcript context.
    result = get_transcript_chunk(
        marked_text=marked_text,
        slide_id="day1-slide-02",
        slide_title="Mục tiêu bài học",
        nearby_text=["AI năm 2025-2026", "Trái tim của AI hiện đại"],
        slide_text=marked_text,
    )

    # Then: old tool consumers receive the same grounded context payload.
    assert result["status"] == "matched"
    assert result["primary_paragraph_id"] == "T06-126"


def test_marked_text_general_search_finds_token_economy_context() -> None:
    # Given: learner marks a different concept that is not a hardcoded hotspot.
    marked_text = "Token economy và cách tính input token output token"
    context = SlideContext(
        slide_id="day1-slide-token-economy",
        slide_title="Token economy",
        nearby_text=("input token", "output token", "API cost"),
        slide_text="Token economy: input token + output token = total cost",
    )

    # When: the server resolves the mark with the general transcript search.
    result = get_marked_transcript_context(marked_text, context)

    # Then: retrieval grounds the answer in the token-economy transcript region.
    chunk_ids = [chunk["paragraph_id"] for chunk in result["chunks"]]
    assert result["status"] == "matched"
    assert result["retrieval_method"] == "general_transcript_search"
    assert result["primary_paragraph_id"] == "T06-154"
    assert "T06-155" in chunk_ids


def test_data_pack_summary_discovers_real_pack() -> None:
    # Given: the hackathon data pack is present beside the app.
    # When: the server summarizes connected data sources.
    summary = data_pack_summary()

    # Then: it reports transcripts, slides, and anonymized chatlog without raw corpus dumps.
    assert summary["transcripts"]["paragraph_count"] == 700
    assert summary["slides"]["file_count"] == 1
    assert summary["chatlog"]["row_count"] == 2522
