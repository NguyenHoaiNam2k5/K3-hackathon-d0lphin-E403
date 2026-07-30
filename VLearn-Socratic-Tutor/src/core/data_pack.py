from __future__ import annotations

import csv
import json
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Final


REPO_ROOT: Final = Path(__file__).resolve().parents[2]
DATA_PACK_ROOT: Final = REPO_ROOT.parent / "data" / "vlearn-pack"
TRANSCRIPT_DIR: Final = DATA_PACK_ROOT / "transcript"
SLIDES_DIR: Final = DATA_PACK_ROOT / "slides"
CHATLOG_PATH: Final = DATA_PACK_ROOT / "chatlog" / "chat_history_anonymized_for_hackathon.csv"


@dataclass(frozen=True, slots=True)
class TranscriptFile:
    name: str
    paragraph_count: int
    char_count: int


@dataclass(frozen=True, slots=True)
class SlideFile:
    name: str
    bytes_size: int


@dataclass(frozen=True, slots=True)
class ChatlogStats:
    row_count: int
    conversation_count: int
    user_count: int
    student_message_count: int
    tutor_message_count: int
    rated_up_count: int
    rated_down_count: int
    citation_message_count: int
    move_counts: dict[str, int]


def transcript_files() -> tuple[TranscriptFile, ...]:
    files: list[TranscriptFile] = []
    for path in sorted(TRANSCRIPT_DIR.glob("transcript-*-clean.md")):
        text = path.read_text(encoding="utf-8")
        files.append(
            TranscriptFile(
                name=path.name,
                paragraph_count=text.count("**[T"),
                char_count=len(text),
            )
        )
    return tuple(files)


def slide_files() -> tuple[SlideFile, ...]:
    return tuple(
        SlideFile(name=path.name, bytes_size=path.stat().st_size)
        for path in sorted(SLIDES_DIR.glob("*"))
        if path.is_file()
    )


def _json_list(value: str) -> list[Any]:
    if not value:
        return []
    loaded = json.loads(value)
    return loaded if isinstance(loaded, list) else []


def chatlog_stats() -> ChatlogStats:
    conversations: set[str] = set()
    users: set[str] = set()
    move_counts: dict[str, int] = {}
    row_count = 0
    student_message_count = 0
    tutor_message_count = 0
    rated_up_count = 0
    rated_down_count = 0
    citation_message_count = 0

    with CHATLOG_PATH.open(encoding="utf-8-sig", newline="") as file:
        for row in csv.DictReader(file):
            row_count += 1
            conversations.add(row.get("conversation_id", ""))
            users.add(row.get("user_id", ""))
            role = row.get("role", "")
            if role == "student":
                student_message_count += 1
            if role == "tutor":
                tutor_message_count += 1

            rating = row.get("rating", "")
            if rating == "up":
                rated_up_count += 1
            if rating == "down":
                rated_down_count += 1

            move = row.get("move_used", "")
            if move:
                move_counts[move] = move_counts.get(move, 0) + 1

            if _json_list(row.get("citations", "[]")):
                citation_message_count += 1

    return ChatlogStats(
        row_count=row_count,
        conversation_count=len(conversations - {""}),
        user_count=len(users - {""}),
        student_message_count=student_message_count,
        tutor_message_count=tutor_message_count,
        rated_up_count=rated_up_count,
        rated_down_count=rated_down_count,
        citation_message_count=citation_message_count,
        move_counts=dict(sorted(move_counts.items())),
    )


def data_pack_summary() -> dict[str, Any]:
    transcripts = transcript_files()
    slides = slide_files()
    chatlog = chatlog_stats()
    return {
        "root": str(DATA_PACK_ROOT),
        "transcripts": {
            "directory": str(TRANSCRIPT_DIR),
            "file_count": len(transcripts),
            "paragraph_count": sum(item.paragraph_count for item in transcripts),
            "files": [asdict(item) for item in transcripts],
        },
        "slides": {
            "directory": str(SLIDES_DIR),
            "file_count": len(slides),
            "files": [asdict(item) for item in slides],
        },
        "chatlog": asdict(chatlog),
        "privacy": "Use only minimal chunks; do not commit or expose full transcript/chatlog corpus.",
    }
