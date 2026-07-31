from __future__ import annotations

from pathlib import Path
import sys

SRC_DIR = Path(__file__).resolve().parents[1] / "src"
sys.path.insert(0, str(SRC_DIR))

import app as flask_app
from providers.base import ModelResponse


class FakeProvider:
    default_model = "fake-quiz-model"

    def __init__(self, text: str) -> None:
        self.text = text

    def complete(
        self,
        messages: list[dict[str, str]],
        tools: list[dict[str, object]] | None = None,
        *,
        model: str | None = None,
        temperature: float = 0.0,
        tool_choice: object | None = None,
    ) -> ModelResponse:
        return ModelResponse(text=self.text)


def post_quiz(monkeypatch, provider_text: str, requested_count: int = 3):
    # Given: the Flask app is connected to a deterministic provider response.
    monkeypatch.setattr(flask_app, "make_provider", lambda _name: FakeProvider(provider_text))
    client = flask_app.app.test_client()

    # When: the UI requests a quiz for a grounded slide.
    return client.post(
        "/api/quiz",
        json={
            "scope": "slide",
            "requested_count": requested_count,
            "slide_id": "slide-02",
            "slide_title": "Automation & Augmentation",
            "slide_text": "Automation hay Augmentation?",
            "nearby_text": ["T02-032", "T02-033", "mức độ con người tham gia"],
            "provider": "deepseek",
        },
    )


def test_api_quiz_returns_ready_when_provider_questions_are_valid(monkeypatch) -> None:
    # Given: the provider returns two valid cited quiz items.
    provider_text = """
    {
      "status": "QUIZ_READY",
      "requested_count": 2,
      "reason": null,
      "questions": [
        {
          "question": "Automation khác augmentation ở điểm nào?",
          "options": ["Model", "Mức con người tham gia", "Màu UI", "Số file"],
          "correct_option_index": 1,
          "explanation": "Transcript nói đây là phổ về mức tự động và con người tham gia.",
          "citations": ["[T02-032]"]
        },
        {
          "question": "Nên bắt đầu triển khai AI theo hướng nào?",
          "options": ["Automation ngay", "Augmentation trước", "Bỏ giám sát", "Không đo"],
          "correct_option_index": 1,
          "explanation": "Transcript khuyến nghị bắt đầu với augmentation và con người giám sát.",
          "citations": ["T02-033"]
        }
      ]
    }
    """

    # When: the route handles the request.
    response = post_quiz(monkeypatch, provider_text, requested_count=2)

    # Then: the UI receives a renderable quiz payload.
    body = response.get_json()
    assert response.status_code == 200
    assert body["status"] == "QUIZ_READY"
    assert body["requested_count"] == 2
    assert len(body["questions"]) == 2
    assert body["questions"][0]["correct_option_index"] == 1
    assert body["questions"][0]["citations"] == ["T02-032"]
    assert body["provider"] == "deepseek"
    assert body["model"] == "fake-quiz-model"


def test_api_quiz_returns_partial_when_valid_questions_are_fewer_than_requested(monkeypatch) -> None:
    # Given: the provider returns one valid question for a three-question request.
    provider_text = """
    {
      "status": "QUIZ_READY",
      "requested_count": 3,
      "reason": null,
      "questions": [
        {
          "question": "Automation là gì?",
          "options": ["Máy tự làm", "Người tự làm", "Thiết kế UI", "Viết slide"],
          "correct_option_index": 0,
          "explanation": "Transcript nói automation nghĩa là để máy tự động làm.",
          "citations": ["T02-032"]
        }
      ]
    }
    """

    # When: the route filters and normalizes the result.
    response = post_quiz(monkeypatch, provider_text, requested_count=3)

    # Then: the response is explicit partial evidence, not fake completion.
    body = response.get_json()
    assert response.status_code == 200
    assert body["status"] == "PARTIAL"
    assert body["requested_count"] == 3
    assert len(body["questions"]) == 1
    assert "chỉ tạo được 1/3" in body["reason"]


def test_api_quiz_returns_insufficient_when_provider_refuses(monkeypatch) -> None:
    # Given: the provider says the retrieved context cannot support a quiz.
    provider_text = """
    {
      "status": "INSUFFICIENT_EVIDENCE",
      "requested_count": 3,
      "reason": "Transcript không đủ căn cứ.",
      "questions": []
    }
    """

    # When: the route handles the refusal.
    response = post_quiz(monkeypatch, provider_text)

    # Then: no fake questions are returned.
    body = response.get_json()
    assert response.status_code == 200
    assert body["status"] == "INSUFFICIENT_EVIDENCE"
    assert body["questions"] == []
    assert body["reason"] == "Transcript không đủ căn cứ."


def test_api_quiz_rejects_invalid_citations(monkeypatch) -> None:
    # Given: the provider returns a question with a citation outside retrieved chunks.
    provider_text = """
    {
      "status": "QUIZ_READY",
      "requested_count": 1,
      "reason": null,
      "questions": [
        {
          "question": "Câu này có nguồn sai?",
          "options": ["A", "B", "C", "D"],
          "correct_option_index": 0,
          "explanation": "Không được render vì citation không nằm trong context.",
          "citations": ["T99-999"]
        }
      ]
    }
    """

    # When: the route validates citations before returning to the UI.
    response = post_quiz(monkeypatch, provider_text, requested_count=1)

    # Then: invalid provider output is refused instead of rendered.
    body = response.get_json()
    assert response.status_code == 200
    assert body["status"] == "INSUFFICIENT_EVIDENCE"
    assert body["questions"] == []
    assert "Không có câu hỏi nào qua guardrail" in body["reason"]
