from __future__ import annotations

from typing import Any

from providers import configured_provider_name, make_provider


def transcript_context_text(context: dict[str, Any]) -> str:
    chunks = context.get("chunks", [])
    return "\n\n".join(
        f"[{chunk['paragraph_id']}] {chunk['text']}"
        for chunk in chunks
        if isinstance(chunk, dict) and chunk.get("paragraph_id") and chunk.get("text")
    )


def marked_text_messages(marked_text: str, student_question: str, source_text: str) -> list[dict[str, str]]:
    return [
        {
            "role": "system",
            "content": (
                "Bạn là VLearn Socratic Tutor. Giải thích phần học viên bôi trên slide "
                "bằng tiếng Việt dễ hiểu, chỉ dựa trên transcript được cung cấp. "
                "Không thêm kiến thức ngoài. Nếu transcript không đủ căn cứ, hãy nói rõ. "
                "Luôn ưu tiên trả lời đúng câu hỏi của học viên, không chỉ giải thích đoạn mark. "
                "Nếu câu hỏi của học viên hỏi sang nội dung không được đoạn transcript hỗ trợ, "
                "hãy nói rõ đoạn được chọn không đề cập nội dung đó, không trả lời bằng kiến thức ngoài, "
                "và không tự suy diễn. "
                "Luôn trích dẫn mã đoạn như [T06-126]."
            ),
        },
        {
            "role": "user",
            "content": (
                f"Học viên mark trên slide: {marked_text}\n\n"
                f'Câu hỏi của học viên: {student_question or "Hãy giải thích phần được mark."}\n\n'
                f"Transcript context:\n{source_text}\n\n"
                "Trả về ngắn gọn theo cấu trúc:\n"
                "1. Ý chính: một câu tóm tắt.\n"
                "2. Giải thích: 2-4 câu giúp học viên hiểu phần được mark dựa trên transcript.\n"
                "3. Tự kiểm tra: một câu hỏi Socratic gợi mở.\n"
                'Nếu câu hỏi không được transcript hỗ trợ, phần Ý chính phải nói rõ "đoạn bạn chọn không đề cập..." '
                "và phần Giải thích chỉ nêu transcript đang nói gì, không trả lời câu hỏi ngoài phạm vi.\n"
                "Mỗi phần phải có citation khi dùng ý từ transcript."
            ),
        },
    ]


def apply_llm_summary(
    context: dict[str, Any],
    marked_text: str,
    student_question: str = "",
    provider_name: str | None = None,
) -> dict[str, Any]:
    selected_provider = configured_provider_name(provider_name)
    provider = make_provider(selected_provider)
    model = getattr(provider, "default_model", None)
    source_text = transcript_context_text(context)
    if not source_text:
        return context

    response = provider.complete(
        marked_text_messages(marked_text, student_question, source_text),
        tools=None,
        model=model,
        temperature=0.1,
    )
    summary_text = (response.text or "").strip()
    if not summary_text:
        return context

    summary = dict(context.get("summary", {}))
    summary["short"] = summary_text
    summary["explanation"] = summary_text
    context["summary"] = summary
    context["assistant_text"] = summary_text
    context["summary_provider"] = selected_provider
    context["summary_model"] = model
    context["summary_status"] = "generated"
    return context


def apply_deepseek_summary(
    context: dict[str, Any],
    marked_text: str,
    student_question: str = "",
) -> dict[str, Any]:
    return apply_llm_summary(context, marked_text, student_question, "deepseek")
