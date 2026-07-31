from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

from tools import TOOL_FUNCTIONS

ALLOWED_CASE_FAILURE_TYPES = {
    "wrong_tool",
    "wrong_arg_value",
    "wrong_boundary",
    "unnecessary_tool",
    "out_of_scope",
    "missing_info",
}


def load_cases(path: Path, phase: str) -> list[dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    cases = [case for case in data["cases"] if case["phase"] == phase]
    validate_case_failure_types(cases, path)
    return cases


def validate_case_failure_types(cases: list[dict[str, Any]], path: Path) -> None:
    invalid: list[str] = []
    for case in cases:
        failure_type = case.get("failure_type")
        if failure_type not in ALLOWED_CASE_FAILURE_TYPES:
            invalid.append(f"{case.get('id', '<missing id>')}: {failure_type!r}")
    if invalid:
        allowed = ", ".join(sorted(ALLOWED_CASE_FAILURE_TYPES))
        joined = "; ".join(invalid)
        raise ValueError(f"Invalid failure_type in {path}: {joined}. Allowed: {allowed}")


def validate_expected_tools(cases: list[dict[str, Any]], declarations: list[dict[str, Any]], path: Path) -> None:
    declared = {item["name"] for item in declarations}
    implemented = set(TOOL_FUNCTIONS)
    invalid: list[str] = []
    for case in cases:
        for call in case.get("expect", {}).get("tool_calls", []):
            name = call.get("name")
            if name not in declared:
                invalid.append(f"{case.get('id', '<missing id>')}: {name!r} not declared in tools.yaml")
            elif name not in implemented:
                invalid.append(f"{case.get('id', '<missing id>')}: {name!r} has no implementation in tools.py")
    if invalid:
        raise ValueError(f"Invalid expected tool in {path}: {'; '.join(invalid)}")


def load_dataset_info(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return {
        "dataset_id": data.get("dataset_id", path.stem),
        "dataset_role": data.get("dataset_role", ""),
        "description": data.get("description", ""),
    }


def safe_slug(value: str) -> str:
    slug = re.sub(r"[^A-Za-z0-9_.-]+", "_", value.strip())
    return slug.strip("_") or "run"


def case_messages(case: dict[str, Any]) -> list[dict[str, str]]:
    if "turns" in case:
        turns = case["turns"]
        previous = turns[:-1]
        latest = turns[-1]["content"]
        previous_text = "\n".join(
            f"- Earlier {item['role']} turn {index + 1}: {item['content']}"
            for index, item in enumerate(previous)
        )
        content = (
            "Conversation context for a multi-turn eval.\n"
            "Use earlier turns only as context. Do not answer earlier turns and do not call tools for them.\n\n"
            f"{previous_text}\n\n"
            f"Latest user turn to answer now: {latest}"
        )
        return [{"role": "user", "content": content}]
    return [{"role": "user", "content": case.get("input") or case.get("query", "")}]
