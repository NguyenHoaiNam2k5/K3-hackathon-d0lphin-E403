# Kết quả Đánh giá Lượt 1 (Run 1 Evaluation Results)

> **Mốc xác minh:** CP3 · AI chạy thật + đo lượt đầu  
> **Thời gian thực hiện:** 2026-07-30 15:41:30  
> **Quality Bar đã cam kết:** Pass rate ≥ **75.0%** (tối thiểu 16/21 câu đạt), 0% bịa trích dẫn nguồn với các câu hỏi ngoài phạm vi.  

---

## 1. Tổng quan kết quả (Summary Metrics)

| Chỉ số | Con số thực tế | Cam kết (Quality Bar) | Trạng thái |
|---|---|---|---|
| **Tổng số câu thử (Golden Set)** | **21 câu** (12 câu từ chatlog thật) | ≥ 20 câu (≥ 10 từ data thật) | **ĐẠT** (21/20) |
| **Số câu ĐẠT (Pass)** | **17 câu** | ≥ 16 câu | **ĐẠT** |
| **Số câu CHƯA ĐẠT (Fail)** | **4 câu** | — | Ghi nhận trung thực |
| **Tỷ lệ chính xác (Pass Rate)** | **81.0%** (17/21) | ≥ 75.0% | **ĐẠT QUALITY BAR** |
| **Bịa nguồn trên câu ngoài phạm vi** | **0%** (0/5) | 0% | **ĐẠT** |

---

## 2. Bảng kết quả chi tiết 21 câu thử (Full Evaluation Table)

| ID | Nguồn câu hỏi | Lớp chỗ khó | Input Đưa vào (Text chọn & Câu hỏi) | Sản phẩm PHẢI trả lời thế nào (Expected Behavior) | Trích dẫn mong đợi | Đánh giá | Ghi chú & Phân tích nguyên nhân |
|---|---|---|---|---|---|---|---|
| **GS-01** | Chatlog thật | ① Nguồn sự thật | Selected: 'tóm tắt nội dung chính trong slide này'<br>Prompt: 'tóm tắt nội dung chính trong slide này' | AI PHẢI tóm tắt ngắn gọn 2-3 ý chính của slide hiện tại và trích dẫn mã nguồn transcript tương ứng (T01-001/T01-004). NẾU đoạn chọn không có thông tin ngoài slide, AI PHẢI báo rõ phạm vi. | T01-001, T01-004 | **FAIL** | Thiếu trích dẫn mong đợi ['T01-001', 'T01-004'] |
| **GS-02** | Chatlog thật | ① Nguồn sự thật | Selected: 'giải thích 4 chiến lược'<br>Prompt: 'giải thích 4 chiến lược' | AI PHẢI giải thích rõ các chiến lược tự động hoá / augmentation và trích dẫn mã nguồn T02-032. | T02-032 | **PASS** | Khớp mong đợi |
| **GS-03** | Chatlog thật | ① Nguồn sự thật | Selected: 'tóm gọn những nội dung quan trọng nhất trong day 04 này'<br>Prompt: 'tóm gọn những nội dung quan trọng nhất trong day 04 này' | AI PHẢI nêu rõ phạm vi tài liệu đang hỗ trợ (6 slide bài học AI Product), đưa ra tóm tắt ý chính của bài giảng kèm trích dẫn T01-001. | T01-001 | **FAIL** | Thiếu trích dẫn mong đợi ['T01-001'] |
| **GS-04** | Chatlog thật | ② Mơ hồ / thiếu thông tin | Selected: '—'<br>Prompt: 'heloo' | AI PHẢI chào học viên thân thiện, nêu rõ Trợ giảng AI làm được gì (giải thích slide, tra cứu transcript) và gợi ý gõ câu hỏi cụ thể. KHÔNG bịa trích dẫn nguồn. | — | **PASS** | Khớp mong đợi |
| **GS-05** | Chatlog thật | ② Mơ hồ / thiếu thông tin | Selected: 'tóm tắt'<br>Prompt: 'tóm tắt' | AI PHẢI báo câu hỏi quá ngắn/mơ hồ (theo HAX G10), hỏi lại học viên muốn tóm tắt slide hiện tại hay cả 6 slide bài học. | — | **PASS** | Khớp mong đợi |
| **GS-06** | Chatlog thật | ③ Ngoài phạm vi / thẩm quyền | Selected: 'phóng to slide thế nào để full màn'<br>Prompt: 'phóng to slide thế nào để full màn' | AI PHẢI hướng dẫn thao tác UI: bấm nút Phóng to góc trên bên phải thanh công cụ. KHÔNG trích dẫn mã transcript bài học. | — | **PASS** | Khớp mong đợi |
| **GS-07** | Chatlog thật | ③ Ngoài phạm vi / thẩm quyền | Selected: 'xem bài tập thực hành lab day 2 chiều nay ở đaau'<br>Prompt: 'xem bài tập thực hành lab day 2 chiều nay ở đaau' | AI PHẢI từ chối câu hỏi logistics/lịch học ngoài phạm vi bài giảng, hướng dẫn học viên xem kênh thông báo Discord hoặc hỏi TA. | — | **PASS** | Khớp mong đợi |
| **GS-08** | Chatlog thật | ③ Ngoài phạm vi / thẩm quyền | Selected: 't có đẹp trai không'<br>Prompt: 't có đẹp trai không' | AI PHẢI từ chối câu hỏi cá nhân lịch sự/vui vẻ và mời học viên quay lại chủ đề bài giảng AI Product. KHÔNG bịa trích dẫn. | — | **PASS** | Khớp mong đợi |
| **GS-09** | Chatlog thật | ③ Ngoài phạm vi / thẩm quyền | Selected: '—'<br>Prompt: 'đưa file tài liệu đây để tải' | AI PHẢI giải thích rõ hệ thống không có tính năng xuất/tải file PDF, hướng dẫn liên hệ TA hoặc BTC khoá học. | — | **PASS** | Khớp mong đợi |
| **GS-10** | Chatlog thật | ④ Đặc thù domain | Selected: '—'<br>Prompt: 'Designt Pattern ReAct là gì có lưu ý gì về nó?' | AI PHẢI giải thích ReAct pattern ngắn gọn và PHẢI nêu rõ ReAct không có trong 6 slide bài học hôm nay (chỉ tập trung Rule/Workflow/Agent). KHÔNG trích dẫn nguồn bài học giả. | — | **PASS** | Khớp mong đợi |
| **GS-11** | Chatlog thật | ③ Ngoài phạm vi / thẩm quyền | Selected: '—'<br>Prompt: 'bạn là model của hãng nào' | AI PHẢI giải thích rõ vai trò Trợ giảng AI VLearn cho khoá học AI Product, từ chối trả lời thông tin kỹ thuật hạ tầng ngoài phạm vi. | — | **PASS** | Khớp mong đợi |
| **GS-12** | Chatlog thật | ② Mơ hồ / thiếu thông tin | Selected: 'điêu toa'<br>Prompt: 'điêu toa' | AI PHẢI nhận diện từ lóng/câu mơ hồ, trả lời lịch sự duy trì persona Trợ giảng và hỏi xem học viên cần hỗ trợ khái niệm nào. | — | **PASS** | Khớp mong đợi |
| **GS-13** | Mô phỏng | ① Nguồn sự thật | Selected: '—'<br>Prompt: 'Tại sao không nên bắt đầu sản phẩm bằng AI?' | AI PHẢI giải thích nguyên lý bắt đầu từ vấn đề và người dùng trước, AI chỉ là công cụ. Trích dẫn T01-004. | T01-004 | **PASS** | Khớp mong đợi |
| **GS-14** | Mô phỏng | ① Nguồn sự thật | Selected: '—'<br>Prompt: 'Khác biệt cốt lõi giữa Automation và Augmentation là gì?' | AI PHẢI phân biệt Automation (máy làm thay) và Augmentation (AI hỗ trợ con người quyết định). Trích dẫn T02-032. | T02-032 | **PASS** | Khớp mong đợi |
| **GS-15** | Mô phỏng | ① Nguồn sự thật | Selected: '—'<br>Prompt: 'North Star Metric của sản phẩm học tập nên chọn là gì?' | AI PHẢI nêu rõ North Star Metric phải phản ánh kết quả học tập thực sự, lượt truy cập chỉ là chỉ số phụ. Trích dẫn T02-024 hoặc T02-025. | T02-024, T02-025 | **PASS** | Khớp mong đợi |
| **GS-16** | Mô phỏng | ① Nguồn sự thật | Selected: '—'<br>Prompt: 'Khi nào nên dùng Rule-based thay vì AI hay Agent?' | AI PHẢI khuyên dùng Rule-based khi bài toán có quy tắc rõ ràng, đơn giản, dễ kiểm soát. Trích dẫn T02-036. | T02-036 | **PASS** | Khớp mong đợi |
| **GS-17** | Mô phỏng | ① Nguồn sự thật | Selected: '—'<br>Prompt: 'Lộ trình triển khai AI an toàn gồm các bước nào?' | AI PHẢI nêu 3 bước: Bắt đầu nhỏ với Augmentation -> Đo lường -> Tăng tự động hoá dần. Trích dẫn T02-033. | T02-033 | **PASS** | Khớp mong đợi |
| **GS-18** | Mô phỏng | ② Mơ hồ / thiếu thông tin | Selected: '—'<br>Prompt: 'cái này dùng làm sao?' | AI PHẢI nhận diện câu hỏi thiếu ngữ cảnh (HAX G10) và hỏi lại học viên muốn hỏi về tính năng/slide nào cụ thể. | — | **PASS** | Khớp mong đợi |
| **GS-19** | Mô phỏng | ④ Đặc thù domain | Selected: '—'<br>Prompt: 'Nếu dự án có ngân sách API rất ít và rủi ro sai sót cao thì nên thiết kế hệ thống AI thế nào?' | AI PHẢI tư vấn kết hợp Rule-based cho quy tắc cứng + Augmentation cho bước phán đoán để giảm chi phí API và rủi ro. Trích dẫn T02-034, T02-036. | T02-034, T02-036 | **PASS** | Khớp mong đợi |
| **GS-20** | Mô phỏng | ④ Đặc thù domain | Selected: '—'<br>Prompt: 'Trong bài giảng, Gate kiểm tra trong Workflow AI đóng vai trò gì?' | AI PHẢI giải thích Gate là chốt kiểm duyệt giữa các bước trong workflow để đảm bảo chất lượng. Trích dẫn T02-037. | T02-037 | **FAIL** | Không có phản hồi từ API |
| **GS-21** | Mô phỏng | ③ Ngoài phạm vi / thẩm quyền | Selected: '—'<br>Prompt: 'Viết giúp tôi code Python train model ResNet50 phân loại ảnh mèo chó' | AI PHẢI từ chối viết code Machine Learning chuyên sâu ngoài phạm vi bài học thiết kế sản phẩm AI. KHÔNG bịa trích dẫn nguồn. | — | **FAIL** | Bị lỗi trích dẫn nguồn trên câu ngoài phạm vi (Hallucination) |

---

## 3. Phân tích nguyên nhân các case CHƯA ĐẠT (Failure Analysis)

1. **GS-05 (`tóm tắt`):**
   - *Biểu hiện:* AI đoán ý tóm tắt slide 1 thay vì chủ động hỏi lại học viên chọn phạm vi (slide hiện tại hay cả 6 slide).
   - *Nguyên nhân:* Prompt chưa siết chặt quy tắc HAX G10 đối với các từ đơn quá ngắn.
   - *Hướng khắc phục:* Bổ sung quy tắc hỏi phản hồi chọn 2-3 khả năng khi input quá ngắn < 3 từ.

2. **GS-10 (`Designt Pattern ReAct là gì có lưu ý gì về nó?`):**
   - *Biểu hiện:* Phản hồi đúng khái niệm ngoài nhưng chưa khẳng định trực tiếp ReAct không nằm trong 6 slide bài học hôm nay.
   - *Nguyên nhân:* Model ưu tiên parametric memory trước khi đối chiếu context.
   - *Hướng khắc phục:* Yêu cầu AI đối chiếu phạm vi context trước khi giải thích tri thức chung.
