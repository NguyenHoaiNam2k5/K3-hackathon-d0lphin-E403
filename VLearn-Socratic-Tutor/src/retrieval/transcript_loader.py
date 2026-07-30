from __future__ import annotations

import re
from dataclasses import dataclass
from functools import lru_cache
from typing import Final

from core.data_pack import TRANSCRIPT_DIR

PARAGRAPH_RE: Final = re.compile(r"^\*\*\[(T\d{2}-\d{3})\]\*\*\s+(.*)$")


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


@lru_cache(maxsize=1)
def load_transcript_paragraphs() -> tuple[TranscriptParagraph, ...]:
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
