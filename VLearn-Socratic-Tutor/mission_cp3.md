# 🎯 CHECKPOINT 3 (CP3) MISSION & TASK BREAKDOWN

## 📌 Tổng Quan Checkpoint 3 (CP3)
- Mục tiêu: Xây dựng bản Prototype v1 (Working Prototype) chạy mượt mà thông luồng từ đầu đến cuối (End-to-End Clickable Happy Path), chứa ít nhất 1 cuộc gọi AI API thật hoặc mô hình RAG pipeline hoàn chỉnh.
- Trọng số điểm: 5 điểm nộp đúng hạn CP3 + Đặt nền móng ăn trọn 8 điểm R5 (Prototype) tại buổi Demo.
- Vị trí nộp bài trong Repo: Thư mục src/ (Mã nguồn dự án).

---

## 📋 NGUYÊN TẮC NGHIỆM THU CP3 (ACCEPTANCE CRITERIA)

| Tiêu chí Nghiệm thu | Trạng thái | Chi tiết Kiểm tra |
|---|:---:|---|
| 1. Trình diễn được Luồng chính (End-to-End) | ĐÃ ĐẠT | Học viên click vào Slide 04 -> AI hiện Pin phát sáng -> Highlight đúng đoạn Transcript -> Ra câu hỏi Socratic -> Bấm nút Escape Hatch giải thích thẳng. |
| 2. Tối thiểu 1 Lời gọi AI Thật (Working Call) | ĐÃ ĐẠT | Tích hợp Gọi API Gemini/Claude thật hoặc Mock Mode chạy 100% không lo lỗi rơ khi Live Demo. |
| 3. Trích dẫn Căn cứ Chính xác (Exact Citation) | ĐÃ ĐẠT | Dẫn chiếu chuẩn mã đoạn 04_Buoi2.md#L145-L160 từ bài giảng gốc của Giảng viên. |
| 4. Tích hợp Lối thoát Khẩn cấp (HAX G9) | ĐÃ ĐẠT | Nút màu vàng 'Giải thích thẳng cho tôi' tự động bật khi chạm mốc 3 lượt tương tác. |
| 5. Dashboard Giảng viên (Instructor Heatmap) | ĐÃ ĐẠT | Nút chuyển tab xem bản đồ 48% học viên bị tắc kiến thức tại Slide 04. |

---

## 🛠️ DANH SÁCH NHIỆM VỤ THỰC THI (ACTIONABLE CHECKLIST)

### 🔴 Task 1: Backend Pipeline (src/app.py & src/chat.py)
- [x] Cấu hình Flask Web Server chạy tại port 8501 (http://127.0.0.1:8501).
- [x] Tạo endpoint /api/chat xử lý multi-turn tool loop cho agent.
- [x] Tích hợp bộ nạp môi trường API Key (env_loader.py).

### 🟢 Task 2: Tool Execution Engine (src/tools/__init__.py)
- [x] Khai báo tool get_transcript_chunk(hotspot_id, slide_id) trả về đoạn lời giảng nguyên văn trong data/vlearn-pack/04_Buoi2.md.
- [x] Khai báo tool get_misconception_heatmap(slide_id) cung cấp thống kê tỷ lệ học viên bị tắc kiến thức.

### 🔵 Task 3: Grounded System Prompt (src/artifacts/system_prompt.md)
- [x] Cấu hình System Prompt ép AI đóng vai Socratic Tutor, giới hạn 3 câu, trả về chuẩn JSON và không bịa đặt ngoài tài liệu bài giảng.

### 🟣 Task 4: Frontend UI App (src/templates/index.html)
- [x] Thiết kế Slide Canvas tương tác với 3 Hotspots (Vector DB, Reranker, LLM Generator).
- [x] Tạo hiệu ứng Pulse Pin Anchor phát sáng & Floating Glassmorphism Popover Card.
- [x] Đồng bộ cuộn và highlight dòng Transcript tương ứng (L145-L160).
- [x] Làm bộ đếm lượt tương tác (Turn Badge) & Nút màu vàng Escape Hatch (HAX G9).
- [x] Tạo màn hình Instructor Misconception Heatmap Tab.

---

## 🚀 HƯỚNG DẪN CHẠY VERIFY CP3 NGAY TRÊN TERMINAL

1. Khởi chạy Flask Web Server:
   cd src
   python app.py
2. Mở trình duyệt kiểm thử:
   Mở địa chỉ http://127.0.0.1:8501 hoặc file src/templates/index.html để bấm thử full flow!
