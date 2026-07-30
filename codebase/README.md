# VLearn Lesson Review — UI demo

Prototype trang xem lại slide bài giảng, tích hợp chatbot RAG từ transcript và tạo câu hỏi ôn tập theo slide hoặc toàn bộ bài học.

## Chạy demo

Chạy Flask backend trong `../VLearn-Socratic-Tutor` trước:

```bash
DAY04_ENV_FILE=.env PYTHONIOENCODING=utf-8 python src/app.py
```

Sau đó chạy UI bằng npm trong thư mục `codebase/`:

```bash
npm install
npm run dev
```

Truy cập `http://localhost:3000`. Vite proxy sẽ chuyển `/api/*` sang backend ở `http://localhost:8501`.

## Luồng có thể demo

- Tìm kiếm hoặc lọc bài học theo trạng thái, sau đó chọn **Tiếp tục học**.
- Chọn slide từ danh sách hoặc điều hướng bằng phím mũi tên.
- Hỏi chatbot theo gợi ý của từng slide; bấm mã trích dẫn để xem đoạn transcript RAG tìm thấy.
- Chuyển ngữ cảnh chatbot giữa slide hiện tại và toàn bộ bài học.
- Bấm **Ôn tập**, chọn phạm vi slide hiện tại hoặc toàn bộ 6 slides, rồi làm quiz và xem kết quả.

Đây là UI React/Vite kết nối Flask AI agent qua `/api/chat`, `/api/marked-text`, `/api/quiz`, và `/api/version`.
