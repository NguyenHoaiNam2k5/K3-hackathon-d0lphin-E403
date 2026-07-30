from __future__ import annotations

from pathlib import Path
from typing import Any
import yaml

from data_pack import chatlog_stats
from tools.transcript_retrieval import SlideContext, get_marked_transcript_context


def get_transcript_chunk(
    hotspot_id: str | None = None,
    slide_id: str = 'slide_04',
    marked_text: str | None = None,
    slide_title: str = "",
    nearby_text: list[str] | None = None,
    slide_text: str = "",
) -> dict[str, Any]:
    if marked_text is not None:
        return get_marked_transcript_context(
            marked_text,
            SlideContext(
                slide_id=slide_id,
                slide_title=slide_title.strip(),
                nearby_text=tuple(text.strip() for text in (nearby_text or []) if text.strip()),
                slide_text=slide_text.strip(),
            ),
        )

    mapping = {
        'hs1': {
            'title': 'Vector Database Search',
            'chunk': '04_Buoi2.md#L145',
            'transcript': 'Ở bước Vector Search, chúng ta chỉ tìm kiếm dựa trên độ tương đồng Cosine giữa Query và Document Embeddings.',
            'socratic_question': 'Theo bạn, nếu câu hỏi của học viên chứa một TỪ KHÓA CHÍNH XÁC (Exact Keyword) chưa từng xuất hiện trong tập Vector Embedding, liệu Vector Search đơn thuần ở bước này có tìm ra được không?'
        },
        'hs2': {
            'title': 'Reranker Engine',
            'chunk': '04_Buoi2.md#L150-L155',
            'transcript': 'Tuy nhiên Vector Search đơn thuần rất hay bỏ sót Exact Keywords. Cross-Encoder Reranker sẽ xếp hạng lại Top-K kết quả dựa trên cả ngữ cảnh sâu.',
            'socratic_question': 'Tại sao thầy giáo lại nhấn mạnh rằng Reranker (Cross-Encoder) đánh giá chính xác hơn Vector Search, nhưng chúng ta KHÔNG dùng Reranker ngay từ đầu cho toàn bộ 1 triệu văn bản?'
        },
        'hs3': {
            'title': 'LLM Generator Grounding',
            'chunk': '04_Buoi2.md#L160',
            'transcript': 'Cross-Encoder Reranker sẽ xếp hạng lại Top-K kết quả trước khi truyền cho LLM Generator với Temperature = 0.1.',
            'socratic_question': 'Tại phút 18:10 thầy giáo khuyên đặt Temperature = 0.1 khi truyền ngữ cảnh Reranker cho LLM. Điều này giúp giải quyết rủi ro gì lớn nhất?'
        }
    }
    if hotspot_id is None:
        return {
            'status': 'missing_selection',
            'slide_id': slide_id,
            'transcript': 'Bạn hãy chọn một hotspot hoặc gửi marked_text để mình tìm transcript.',
            'socratic_question': 'Bạn muốn mình giải thích phần nào trên slide?',
        }
    return mapping.get(hotspot_id, {
        'title': 'General Slide Context',
        'chunk': '04_Buoi2.md#L100',
        'transcript': 'Bài giảng tổng quan về RAG Pipeline.',
        'socratic_question': 'Bạn có thắc mắc gì về đoạn này không?'
    })

def get_misconception_heatmap(slide_id: str = 'slide_04') -> dict[str, Any]:
    stats = chatlog_stats()
    return {
        'slide_id': slide_id,
        'source': 'chatlog/chat_history_anonymized_for_hackathon.csv',
        'total_students': stats.user_count,
        'total_conversations': stats.conversation_count,
        'total_rows': stats.row_count,
        'rated_up': stats.rated_up_count,
        'rated_down': stats.rated_down_count,
        'citation_message_count': stats.citation_message_count,
        'move_counts': stats.move_counts,
        'heatmap': [
            {'topic': 'Tutor answers without citations', 'count': stats.tutor_message_count - stats.citation_message_count},
            {'topic': 'Down-rated tutor answers', 'count': stats.rated_down_count},
            {'topic': 'Direct-answer moves', 'count': stats.move_counts.get('give_direct_answer', 0)}
        ]
    }

TOOL_FUNCTIONS = {
    'get_transcript_chunk': get_transcript_chunk,
    'get_misconception_heatmap': get_misconception_heatmap,
}

def load_tool_declarations(path: Path) -> list[dict[str, Any]]:
    return yaml.safe_load(Path(path).read_text(encoding='utf-8'))['tools']

def to_openai_tools(declarations: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [{
        'type': 'function',
        'function': {
            'name': item['name'],
            'description': item.get('description', ''),
            'parameters': item.get('parameters', {'type': 'object', 'properties': {}}),
        },
    } for item in declarations]
