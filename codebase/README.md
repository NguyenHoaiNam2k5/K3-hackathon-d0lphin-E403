# VLearn Lesson Review — UI demo

Prototype trang xem lại slide bài giảng, tích hợp chatbot RAG từ transcript và tạo câu hỏi ôn tập theo slide hoặc toàn bộ bài học.

## Chạy demo

Mở `lessons.html` bằng trình duyệt để bắt đầu từ trang chọn bài học, hoặc chạy một static server tại thư mục `codebase/`:

```bash
python -m http.server 8080
```

Sau đó truy cập `http://localhost:8080/lessons.html`.

## Luồng có thể demo

- Tìm kiếm hoặc lọc bài học theo trạng thái, sau đó chọn **Tiếp tục học**.
- Chọn slide từ danh sách hoặc điều hướng bằng phím mũi tên.
- Hỏi chatbot theo gợi ý của từng slide; bấm mã trích dẫn để xem đoạn transcript RAG tìm thấy.
- Chuyển ngữ cảnh chatbot giữa slide hiện tại và toàn bộ bài học.
- Bấm **Ôn tập**, chọn phạm vi slide hiện tại hoặc toàn bộ 6 slides, rồi làm quiz và xem kết quả.

Đây là UI prototype chạy bằng dữ liệu mô phỏng ở phía client; chưa kết nối LLM, vector database hoặc pipeline RAG thật.
