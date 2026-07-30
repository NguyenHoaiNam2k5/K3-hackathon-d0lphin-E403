# AI SPEC — Slide-to-Transcript Grounded AI Tutor · Nhóm [XX] · Zone [X]

**Hướng:** [x] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở  
**Loại tính năng:** [x] Tối ưu tính năng có sẵn  [x] Tính năng mới (Spatial Slide Hover & Transcript Mapping)  

---

## §1. User & Job

* **Job Executor & Workflow:** Học viên khoá AI Thực Chiến đang ôn lại bài qua Slide/Transcript sau buổi học hoặc chuẩn bị làm bài tập thực chiến.
* **Core JTBD (Không chứa từ khóa AI):**  
  *"Khi xem Slide bài giảng và gặp một sơ đồ/khái niệm phức tạp, tôi muốn ngay lập tức nắm được lời giải thích chính xác của giảng viên tại điểm đó mà không phải tua lại cả video dài 2 tiếng hay đọc lướt hàng nghìn dòng transcript."*
* **Problem Statement (KHÔNG chứa từ khóa AI):**  
  Học viên tốn trung bình 15–20 phút tua video/tìm kiếm transcript mỗi khi không hiểu một slide bài giảng, dẫn đến việc bỏ qua điểm nghẽn kiến thức hoặc hiểu sai bản chất khái niệm.
* **Bằng chứng (Evidence):**
  * **Số liệu Mining (Chuẩn B):** Phân tích 200 mẫu hội thoại VLearn chatlog cho thấy:
    * **38.5% (77/200)** câu hỏi học viên là thắc mắc trực tiếp về các sơ đồ/hình ảnh hiển thị trên Slide.
    * **24.0% (48/200)** trường hợp AI Tutor cũ đưa ra câu trả lời chung chung hoặc trích dẫn sai số trang/nội dung.
  * **Trích dẫn nguyên văn ($\ge 5$ quotes):**
    1. *"Thầy ơi đoạn sơ đồ RAG Pipeline ở slide 4 bước 2 với 3 khác gì nhau ạ?"* — Học viên U102
    2. *"Tutor trả lời dài quá mà không đúng đoạn thầy giảng trong video."* — Học viên U084
    3. *"Cho mình hỏi phút bao nhiêu thầy nói về cái hình này vậy?"* — Học viên U155
    4. *"Đọc transcript tìm mỏi mắt không thấy đoạn giải thích cho slide này."* — Học viên U049
    5. *"Tutor cite slide 12 nhưng mở ra lại là nội dung của slide 5."* — Học viên U211

---

## §2. Impact & Quyết Định Chọn

### Bảng So Sánh Impact Các Ứng Viên Bài Toán

| Ứng viên Bài toán | Số người gặp | Tần suất | Tốn kém mỗi lần | Khả thi 1.5 ngày | Quyết định |
|---|:---:|:---:|:---:|:---:|:---:|
| **1. Slide-to-Transcript Grounded AI Tutor (ĐÃ CHỌN)** | ~800 HV | Cao (Mỗi buổi học) | 15-20 phút tua video | **Rất cao** | **CHỌN** |
| 2. Quiz Generator tự động cuối buổi | ~500 HV | Trung bình | 10 phút | Cao | Loại (Ít WOW ở Live Demo) |
| 3. AI Summarizer tóm tắt bài giảng | ~300 HV | Thấp | 5 phút | Rất cao | Loại (Nhiều tool đã làm) |

* **Lý do chọn bằng số:** Ứng viên 1 giải quyết được pain point của 80% học viên (800/1.000), tiết kiệm 15–20 phút/lần tra cứu, đồng thời tạo trải nghiệm thị giác ấn tượng nhất tại sân khấu Live Demo.

---

## §3. Giải Pháp Tương Tự Đã Nghiên Cứu

1. **NotebookLM (Google):**  
   * *Flow:* Upload tài liệu $\rightarrow$ AI trả lời kèm Citation số trang bên cạnh.
   * *Đáng học:* Gắn Pin trích dẫn nguồn cực kỳ chính xác.
   * *Đáng né:* UI dạng chat tĩnh, chưa tương tác trực tiếp lên vùng Slide/Hình ảnh.
   * *Điểm khác biệt của mình:* **Spatial Hover Placeholder** — Trỏ chuột trực tiếp vào vị trí trên Slide để lấy câu trả lời trích từ Transcript bài giảng tại đúng phút đó.
2. **Khanmigo (Khan Academy):**  
   * *Flow:* AI Tutor xuất hiện cạnh video học tập, trả lời gợi mở Socratic.
   * *Đáng học:* Phong cách dẫn dắt gợi mở thay vì trả lời thay.
   * *Đáng né:* Phản hồi đôi khi quá dài khiến học viên mất kiên nhẫn.
   * *Điểm khác biệt của mình:* Kết hợp Socratic + Cột mốc thời gian (Timestamp Anchor) + Nút chuyển mode khẩn cấp (Escape Hatch).

---

## §4. Thiết Kế (Design Specification)

### Lát Cắt MỘT CÂU (Slice of One)
> **"Một học viên đang xem Slide bài giảng trỏ chuột vào một sơ đồ phức tạp $\rightarrow$ AI tự động trích xuất đúng đoạn Transcript tương ứng của giảng viên tại phút đó để đưa ra lời giải thích chính xác 100% kèm câu hỏi gợi mở sâu."**

* **Non-goals ($\ge 3$ thứ KHÔNG build):**
  1. KHÔNG build hệ thống video streaming full tính năng (chỉ dùng iframe/mock slide canvas).
  2. KHÔNG tự động chấm điểm bài tập tự luận của học viên.
  3. KHÔNG sinh slide mới bằng AI.
* **Mức Prototype:** `[x] Working` — Phần Frontend Slide Canvas & Socratic Chat (Working UI), API Call Gemini/Claude thật cho RAG Transcript, dữ liệu Slide/Transcript chuẩn từ `data/vlearn-pack/`.
* **Mức Automation & Lý do Cost-of-Error:**
  * Chọn mức **Conditional Automation** (AI tự động trích xuất & trả lời khi tìm thấy Transcript trùng khớp; nếu Confidence Score $< 75\%$, tự động chuyển sang mode đặt câu hỏi làm rõ hoặc ping TA).
  * *Lý do:* Giải thích sai kiến thức cho học viên gây hậu quả đắt (hiểu sai tư duy lập trình), nhưng nếu có trích dẫn Transcript gốc thì chi phí kiểm chứng lại rất rẻ.
* **Nguyên Tắc HAX/PAIR Được Áp Dụng (Chỉ rõ vị trí):**
  * **G1 (Rõ phạm vi):** Banner chào mừng ghi rõ: *"Mình hỗ trợ giải thích Slide dựa trên Transcript chính thức của 6 buổi học AI Thực Chiến"*.
  * **G9 (Sửa/Đổi dễ dàng):** Nút *"Giải thích thẳng cho tôi"* hiển thị ở lượt chat thứ 3 tại khung Socratic Card.
  * **G10 (Thu hẹp khi nghi ngờ):** Nếu vị trí trỏ chuột không khớp transcript nào, AI hiển thị: *"Đoạn này giảng viên lướt qua nhanh, bạn có muốn gửi câu hỏi cho TA không?"*.
  * **G11 (Giải thích căn cứ):** Thẻ phản hồi luôn hiển thị nhãn trích dẫn: `[Buoi2_Transcript.md #L145-L160 | Phút 14:20]`.

---

## §5. Taxonomy 4 Lớp Rủi Ro (Risk & Failure Scenarios)

1. **Lớp Data:** Transcript bài giảng bị nhiễu câu từ nói vô thưởng vô phạt (*"à", "ừm", "các bạn thấy chưa"*).
   * *Xử lý:* Bộ tiền xử lý (Cleaner) lọc nhiễu văn nói trước khi nạp vào Prompt Context.
2. **Lớp Prompt:** AI bỏ qua yêu cầu cô đọng, trả lời dài quá 4 câu.
   * *Xử lý:* System prompt siết chặt định dạng JSON output bắt buộc có trường `concise_summary` ($\le 3$ câu).
3. **Lớp Model:** LLM bị suy diễn vượt ngoài nội dung bài giảng (Hallucination).
   * *Xử lý:* Temperature = 0.1; Thêm câu lệnh cứng: *"Chỉ sử dụng thông tin trong [Context]. Nếu Context không đề cập, hãy trả về 'NO_INFO'"*.
4. **Lớp Product/UX:** Học viên rê chuột liên tục tạo quá nhiều Placeholder Pin rác trên Slide.
   * *Xử lý:* Debounce hover 400ms và chỉ hiển thị Active Pin khi người dùng dừng chuột hoặc click cố định.

---

## §6. 4 Đường Đi Của Trải Nghiệm (User Flow Journeys)

```
                       ┌─────────────────────────┐
                       │ Học viên trỏ vào Slide  │
                       └────────────┬────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌──────────────────────┐                          ┌──────────────────────┐
│ [1] HAPPY PATH       │                          │ [2] LOW CONFIDENCE   │
│ Match Transcript >80%│                          │ Match Transcript <75%│
│ ──► Hiện Pin + Thẻ   │                          │ ──► Hiện Pin vàng +  │
│     giải thích + Quote│                         │     Câu hỏi xác nhận │
└──────────────────────┘                          └──────────────────────┘
           │                                                 │
           ▼                                                 ▼
┌──────────────────────┐                          ┌──────────────────────┐
│ [3] FAILURE PATH     │                          │ [4] CORRECTION PATH  │
│ Không thấy Transcript│                          │ User nhấn "Xem thẳng"│
│ ──► Báo NO_INFO +    │                          │ ──► Bỏ qua Socratic, │
│     Gợi ý ping TA    │                          │     hiện đáp án gốc  │
└──────────────────────┘                          └──────────────────────┘
```

---

## §7. Kiểm Thử & Đánh Giá (Eval Benchmark)

* **Chiều chất lượng + định nghĩa kiểm chứng được:**
  1. **Retrieval:** Hệ thống phải dùng `rank_bm25` để tìm transcript từ đoạn học viên mark + context slide; không dùng map cứng theo từng câu mark.
  2. **Grounding:** Câu trả lời chỉ dùng retrieved transcript chunks; không thêm số liệu, claim hoặc kiến thức ngoài transcript.
  3. **Citation:** Answer phải có citation dạng `[Txx-NNN]`; mọi citation trong answer phải nằm trong retrieved chunks.
  4. **Out-of-scope refusal:** Nếu câu hỏi không được transcript hỗ trợ, answer phải nói rõ đoạn được chọn/transcript không đề cập, không tự suy diễn.
  5. **Answer format:** Output phải có đủ `Ý chính`, `Giải thích`, `Tự kiểm tra`.
  6. **Provider:** Benchmark dùng DeepSeek qua `LLM_PROVIDER=deepseek`, model mặc định `deepseek-chat`.

* **Golden set (≥20 cases, file trong `eval/`):**
  * File: `eval/golden_set.json`
  * Dataset id: `vlearn_marked_text_grounding_v1`
  * Version: `1.1.0`
  * Tổng số case: **24**
  * Cơ cấu:
    * **21** grounded-answer cases.
    * **3** out-of-scope refusal cases.
    * **20** marked texts unique.
    * **24** student questions unique.
  * Mỗi case gồm input (`marked_text`, `student_question`, `slide_context`), expected behavior, required citations, required concepts, forbidden claims và guardrails.

* **Guardrails được kiểm thử tự động:**

| Guardrail | Cách kiểm chứng |
|---|---|
| Retrieval method | `retrieval_method == rank_bm25` |
| DeepSeek generation | `summary_provider == deepseek`, `summary_status == generated` |
| Required context citations | Citation bắt buộc phải có trong retrieved chunks |
| Answer has citation | Answer phải có ít nhất một citation `[Txx-NNN]` |
| Citation subset | Citation trong answer không được nằm ngoài retrieved chunks |
| Required sections | Answer có `Ý chính`, `Giải thích`, `Tự kiểm tra` |
| Required concepts | Answer chứa concept cốt lõi của case |
| Forbidden claims | Answer không chứa claim bị cấm |
| Out-of-scope refusal | Case ngoài phạm vi phải có marker như “không đề cập”, “không đủ căn cứ”, “không có trong transcript” |

* **Quality bar (chốt từ 23:59, giữ nguyên sau đó):**
  * **Đạt khi ≥95%** qua toàn bộ golden set.
  * Và không có lỗi guardrail nghiêm trọng:
    1. Không hallucinate ngoài transcript.
    2. Không dùng citation ngoài context đã retrieve.
    3. Không trả lời câu hỏi ngoài phạm vi nếu transcript không hỗ trợ.
  * Với 24 cases, ngưỡng 95% cho phép fail tối đa 1 case nhỏ nhưng không được fail lỗi grounding/citation/refusal nghiêm trọng.

### Kết quả các lượt chạy benchmark trước CP6

| Lượt chạy | Run output | Passed | Tỷ lệ | Failed | Provider |
|---|---|---:|---:|---:|---|
| Run 1 | `eval/runs/vlearn_marked_text_grounding_v1_2026-07-30T093012Z0000.json` | 24/24 | 100.0% | 0 | deepseek |
| Run 2 | `eval/runs/vlearn_marked_text_grounding_v1_2026-07-30T095916Z0000.json` | 23/24 | 95.8% | 1 | deepseek |
| Run 3 | `eval/runs/vlearn_marked_text_grounding_v1_2026-07-30T100300Z0000.json` | 24/24 | 100.0% | 0 | deepseek |
| Run 4 | `eval/runs/vlearn_marked_text_grounding_v1_2026-07-30T100837Z0000.json` | 23/24 | 95.8% | 1 | deepseek |

* **Kết luận benchmark:** Các lượt chạy đạt từ **95.8% đến 100%**, vượt quality bar 95%. Bộ test hiện kiểm được grounding, citation, refusal và format. Hạn chế còn lại: dataset đang tập trung nhiều vào cụm nội dung LLM, nên sau CP6 nên mở rộng thêm cases từ nhiều slide/chủ đề khác trong `data/vlearn-pack/`.

---

## §8. Phân Công Công Việc (Team Assignment)

* **Thành viên 1 (PM & Spec):** Phân tích chatlog, hoàn thiện `spec.md`, viết kịch bản Slide Demo.
* **Thành viên 2 (Frontend Dev):** Dựng Slide Canvas, bắt sự kiện Hover/Click toạ độ, làm hiệu ứng Glassmorphism Floating Card.
* **Thành viên 3 (Backend & RAG):** Xây dựng module Indexing Transcript, Slide-to-Timestamp Matcher, Gemini API Prompt Engine.
* **Thành viên 4 (Eval & Validation):** Xây dựng 20 Golden Set, chạy benchmark Eval, thu thập feedback log từ 20 học viên trong lớp.

---

## 📋 Decision Log (Nhật Ký Quyết Định)

1. **Đổi từ Bôi Đen Text $\rightarrow$ Spatial Slide Hover:** Giúp trải nghiệm trực quan 100%, thao tác tự nhiên và tạo hiệu ứng WOW cực mạnh trên sân khấu Demo.
2. **Khai thác 100% Transcript bài giảng gốc:** Đảm bảo không bị hallucinate, đáp ứng tiêu chí nghiệm thu khắt khe về tính đúng đắn của dữ liệu.
3. **Thêm cơ chế Escape Hatch (Socratic $\rightarrow$ Direct Answer):** Bảo vệ trải nghiệm học viên, không bắt học viên chơi đố vui khi đang cần gấp đáp án.
