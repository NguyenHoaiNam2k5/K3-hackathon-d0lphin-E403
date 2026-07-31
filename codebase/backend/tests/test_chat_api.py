from __future__ import annotations

from pathlib import Path
import sys

SRC_DIR = Path(__file__).resolve().parents[1] / "src"
sys.path.insert(0, str(SRC_DIR))

import app as flask_app


class FakeProvider:
    default_model = "fake-chat-model"


def test_api_chat_formats_structured_json_for_learners(monkeypatch) -> None:
    monkeypatch.setattr(flask_app, "make_provider", lambda _name: FakeProvider())
    monkeypatch.setattr(
        flask_app,
        "run_model_tool_loop",
        lambda **_kwargs: {
            "status": "answered",
            "assistant_text": """
            {
              "socratic_question": "Trong một lần gọi API với system prompt, em muốn AI bị ràng buộc bởi phần nào?",
              "direct_answer": "Đó là system prompt - lớp gắn rules, boundary và output contract cho agent.",
              "explanation": "Nó đặt vai trò, giới hạn và cách trình bày cho agent trước khi agent xử lý câu hỏi cụ thể của user.",
              "example": "Một system prompt có thể yêu cầu agent trả lời bằng tiếng Việt, chỉ dùng transcript và luôn dẫn nguồn.",
              "citation": "T04-089"
            }
            """,
            "tool_events": [],
        },
    )

    client = flask_app.app.test_client()
    response = client.post(
        "/api/chat",
        json={
            "message": "System prompt là gì?",
            "slide_id": "slide-18",
            "slide_title": "System Prompt - Python Example",
            "slide_text": "System prompt có rules, constraints, output format",
            "nearby_text": ["rules", "constraints", "output contract"],
            "provider": "deepseek",
        },
    )

    body = response.get_json()
    assistant_text = body["assistant_text"]
    assert response.status_code == 200
    assert "**Ý chính:**" in assistant_text
    assert "**Giải thích:**" in assistant_text
    assert "**Ví dụ / cách hiểu:**" in assistant_text
    assert "**Tự kiểm tra:**" in assistant_text
    assert "**Nguồn:** [T04-089]" in assistant_text
    assert "boundary" in assistant_text
    assert "Một system prompt có thể yêu cầu" in assistant_text
    assert '"direct_answer"' not in assistant_text
    assert not assistant_text.strip().startswith("{")


def test_api_chat_does_not_invent_explanation_for_legacy_json(monkeypatch) -> None:
    monkeypatch.setattr(flask_app, "make_provider", lambda _name: FakeProvider())
    monkeypatch.setattr(
        flask_app,
        "run_model_tool_loop",
        lambda **_kwargs: {
            "status": "answered",
            "assistant_text": '{"direct_answer":"System prompt định hướng agent.","citation":"T04-089"}',
            "tool_events": [],
        },
    )

    response = flask_app.app.test_client().post(
        "/api/chat",
        json={"message": "System prompt là gì?", "provider": "deepseek"},
    )

    assistant_text = response.get_json()["assistant_text"]
    assert response.status_code == 200
    assert "**Ý chính:**" in assistant_text
    assert "**Nguồn:** [T04-089]" in assistant_text
    assert "**Giải thích:**" not in assistant_text
    assert "AI nên giữ vai trò gì" not in assistant_text
