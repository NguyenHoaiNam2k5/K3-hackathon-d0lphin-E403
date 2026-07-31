# Reflection — Ngô Hoàng Gia Bảo — 2A202601375

Phần phụ trách: golden set và eval.

### 1. Quyết định quan trọng tôi đã tham gia
- Trực tiếp thiết kế cấu trúc bộ **Golden Set gồm 21 test cases** bao phủ đủ 4 lớp chỗ khó theo Taxonomy: 9 case Single-turn, 12 case Multi-turn, kết hợp giữa chatlog thật và các trường hợp biên (edge cases).
- Thống nhất đặt **Quality Bar** cứng trong `spec.md`: Độ chính xác Accuracy ≥ 75% và Citation Validity phải đạt tuyệt đối 100% (mọi câu hỏi/đáp án đều phải kèm mã trích dẫn `[Txx-NNN]` hợp lệ).

### 2. Bằng chứng hoặc feedback làm thay đổi quyết định
- Khi đo đạc lượt đầu (v1), kết quả chỉ đạt 17/21 PASS (80%), trong đó phát hiện 4 case sinh quiz bị rỗng Citation hoặc đoán bậy khi transcript bị thiếu ngữ cảnh.
- Bằng chứng đo đạc thực tế từ run log này buộc tôi và nhóm phải thắt chặt rule kiểm thử: Bổ sung bộ lọc kiểm tra Citation Validity 2 vòng và chấp nhận cho AI từ chối (Refusal) đối với các case transcript không đủ căn cứ.

### 3. Điều tôi sẽ làm khác nếu có thêm thời gian
- **Mở rộng bộ Eval**: Tăng quy mô Golden Set từ 21 cases lên 50+ cases bao phủ thêm các dạng bài tập lập trình & công thức toán học phức tạp.
- **Tự động hóa LLM-as-a-Judge**: Viết script chấm điểm tự động (Auto-eval runner) dùng LLM làm judge để kiểm tra sâu hơn về độ phân biệt của các phương án nhiễu (distractors).

### 4. Phần code/artifact tôi có thể giải thích
- **Artifact**: `eval/golden_set.json` (toàn bộ 21 test cases) và bảng kết quả đánh giá trong `spec.md` (§7 Kiểm thử & Quality Bar).
- **Codebase**: Module chạy eval `VLearn-Socratic-Tutor/src/eval_runner/` và bộ test trong `VLearn-Socratic-Tutor/tests/` (cách nạp dataset, kiểm tra định dạng trích dẫn `[Txx-NNN]` và tính toán tỷ lệ PASS/FAIL).
