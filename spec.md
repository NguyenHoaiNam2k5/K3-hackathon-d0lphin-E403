# AI SPEC — Tạo câu hỏi ôn tập có căn cứ từ transcript · Nhóm [TODO] · Zone [TODO]

**Hướng:** ☒ A — VLearn ☐ B — Trợ lý Học viên ☐ C — Làn mở  
**Loại:** ☒ Tối ưu tính năng có sẵn ☐ Tính năng mới  
**Trạng thái tài liệu:** Bản thiết kế trước validation. Các mục cần khảo sát, thử sản phẩm trực tiếp hoặc đo trên prototype được đánh dấu `TODO-THỰC TẾ`; không dùng số liệu giả để thay bằng chứng.

## Tóm tắt quyết định

VLearn đã có chatbot hỗ trợ học viên. Nhóm tối ưu chatbot bằng cách bổ sung transcript bài giảng làm nguồn tri thức: khi học viên muốn ôn lại slide hiện tại hoặc toàn bài, hệ thống truy xuất các đoạn transcript liên quan rồi tạo bộ câu hỏi ôn tập gồm câu hỏi, phương án, đáp án, giải thích và mã đoạn `[Txx-NNN]`. Nhờ vậy, câu hỏi kiểm tra cả phần diễn giải miệng của giảng viên thay vì chỉ lặp lại chữ ít ỏi trên slide.

Đây là **conditional automation**: hệ thống tự tạo câu hỏi khi transcript có đủ căn cứ để xác định một đáp án đúng và các phương án nhiễu không gây hiểu sai; case thiếu căn cứ, mơ hồ hoặc mâu thuẫn sẽ bị bỏ qua hoặc yêu cầu học viên đổi phạm vi, không cố sinh đủ số lượng bằng mọi giá.

---

## §1. User & Job

### 1.1 Job executor và workflow hiện tại

**Job executor chính:** học viên của khoá AI Thực Chiến đang xem lại slide ở nhà sau buổi học và muốn tự kiểm tra mình đã hiểu, nhớ đúng các ý giảng viên trình bày hay chưa.

**Không chọn làm user chính:** học viên đang học trực tiếp trên lớp; giảng viên/TA; người chưa tham gia khoá.

Workflow hiện tại cần kiểm chứng:

1. Học viên đọc lại slide và tự đánh giá mức độ hiểu dựa trên cảm giác.
2. Nếu muốn tự kiểm tra, học viên phải tự nghĩ câu hỏi, nhờ chatbot tổng quát tạo quiz từ slide hoặc tìm bài tập ở nguồn khác.
3. Slide thường cô đọng nên câu hỏi chỉ dựa trên slide có thể bỏ qua ví dụ, điều kiện và sắc thái giảng viên đã nói trên lớp.
4. Học viên dễ rơi vào “quen mặt chữ” nhưng chưa chắc nhớ hoặc vận dụng được nội dung khi không có gợi ý.

### 1.2 Core JTBD

**Job statement:** Tự kiểm tra mức độ hiểu và ghi nhớ nội dung của một slide trong lúc ôn bài ở nhà để biết phần nào cần xem lại trước khi tiếp tục.

**Job stories:**

- Khi vừa xem xong một slide, tôi muốn được hỏi vài câu dựa trên cả slide và lời giảng để biết mình hiểu thật hay chỉ thấy quen.
- Khi chọn sai, tôi muốn biết vì sao và xem đúng đoạn giảng viên đã nói để sửa hiểu nhầm ngay.
- Khi transcript không đủ rõ để tạo câu hỏi đáng tin, tôi muốn hệ thống bỏ qua nội dung đó thay vì cho tôi học một đáp án sai.

### 1.3 Problem statement

Học viên đang xem lại slide ở nhà khó tự kiểm tra mình đã hiểu đúng nội dung giảng viên trình bày, vì slide cô đọng còn việc tự tạo câu hỏi từ cả lời giảng tốn công; hậu quả là họ dễ đánh giá quá cao mức độ hiểu, bỏ sót kiến thức chỉ xuất hiện trong lời nói và không biết chính xác phần nào cần xem lại.

### 1.4 Alternatives hiện tại và giả thuyết chỗ fail

| Cách đang dùng                             | Giá trị giữ họ ở lại                  | Giả thuyết chỗ fail cần kiểm chứng                                         |
| ------------------------------------------ | ------------------------------------- | -------------------------------------------------------------------------- |
| Tự nghĩ câu hỏi/tự nhẩm lại                | Không cần công cụ, thực hiện ngay     | Dễ chỉ hỏi phần mình đã nhớ; khó tự phát hiện lỗ hổng                      |
| Đưa slide/transcript vào chatbot tổng quát | Linh hoạt, tạo được nhiều định dạng   | Học viên phải tự chuẩn bị nguồn; khó kiểm tra câu/đáp án bám đúng buổi học |
| Bỏ qua bước tự kiểm tra                    | Nhanh, không gián đoạn flow xem slide | Dễ nhầm cảm giác quen thuộc với hiểu thật; lỗ hổng chỉ lộ ra khi làm bài   |

### 1.5 Evidence

**Bằng chứng bối cảnh đã có, chưa phải bằng chứng pain:** data pack chứa 6 transcript sạch, khoảng 700 đoạn có mã trích dẫn `[Txx-NNN]`. Đây là bằng chứng rằng nguồn để xây prototype tồn tại, không chứng minh học viên có pain hoặc pain đủ lớn.

**Đường A — khảo sát/phỏng vấn:**

- Cỡ mẫu: n = 21
- Tỷ lệ xác nhận gặp khó khăn khi đọc lại slide và tìm hiểu các khái niệm chưa hiểu: 80%
- Cách hỏi: "Bạn có gặp khó khăn khi đọc slide và tìm hiểu các nội dung trong slide không?", "Bạn có gặp khó khăn khi đọc slide và tìm hiểu các nội dung trong slide không?"

**Đường B — mining:**

Mining từ dataset 2.522 dòng chatlog thật (chat_history_anonymized_for_hackathon.csv) chỉ ra 46.2% câu trả lời rỗng citations

---

## §2. Impact & quyết định chọn

### 2.1 Bảng impact ba ứng viên

| Ứng viên                                                         | Ai gặp                       | Bao nhiêu người gặp |         Tần suất | Tốn gì mỗi lần                                                    | Khả thi trong hackathon                                         | Quyết định              |
| ---------------------------------------------------------------- | ---------------------------- | ------------------: | ---------------: | ----------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------- |
| A. Tạo câu hỏi ôn tập và trả lời câu hỏi có căn cứ từ transcript | Học viên xem lại slide       |     **17/21 (80%)** |   **2 lần/tuần** | **10 phút/lần** để tự nghĩ/tìm câu hỏi; thêm rủi ro tưởng đã hiểu | Cao: chatbot và UI quiz đã có; transcript có mã đoạn            | **Chọn**                |
| B. Hỏi đáp có trích dẫn theo slide                               | Học viên gặp một ý chưa hiểu |     **13/21 (62%)** | **1,5 lần/tuần** | **8 phút/lần** để dò đúng đoạn hoặc hỏi ở kênh khác               | Cao: gần flow chatbot hiện có                                   | Loại khỏi lát cắt chính |
| C. Tạo chapter để chỉ đến slide cần thiết                        | Học viên muốn xem lại slide  |     **12/21 (57%)** |   **1 lần/tuần** | **6 phút/lần** để tìm lại đúng slide/đoạn cần xem                 | Trung bình: data pack không cung cấp timestamp gốc đáng tin cậy | Loại                    |

**Công thức impact:**  
`impact thời gian/tuần = số học viên gặp × số lần/tuần × số phút/lần`.
| Ứng viên                                             | Phép tính theo giả định | Quy mô pain ước tính mỗi tuần |
| ---------------------------------------------------- | ----------------------: | ----------------------------: |
| A. Câu hỏi ôn tập và trả lời có căn cứ từ transcript |             17 × 2 × 10 |             **340 phút/tuần** |
| B. Hỏi đáp có trích dẫn                              |            13 × 1,5 × 8 |             **156 phút/tuần** |
| C. Chapter cho slide                                 |              12 × 1 × 6 |              **72 phút/tuần** |

Theo giả định ban đầu, ứng viên A có quy mô pain lớn gấp khoảng **2 lần** ứng viên B và **5 lần** ứng viên C, đồng thời tận dụng được cả chatbot và transcript đã có.

### 2.2 Ứng viên đã loại

- **Hỏi đáp có trích dẫn:** vẫn hữu ích và có thể dùng transcript chung, nhưng chatbot đã có chức năng trả lời câu hỏi. Nhóm chọn cải tiến tạo câu hỏi ôn tập vì đây là thay đổi rõ hơn về kết quả người học.
- **Chapter cho slide:** có khả năng giảm thời gian tìm kiếm nhưng thiếu chapter chuẩn trong nguồn được cấp; nếu suy luận chapter, hệ thống có thể đưa học viên tới sai vị trí.

### 2.3 Ứng viên chọn và lý do

Chọn **tạo câu hỏi ôn tập và trả lời câu hỏi có căn cứ từ transcript** vì:

1. Nguồn đầu vào khả dụng: 6 transcript sạch, khoảng 700 đoạn có mã trích dẫn.
2. Một quyết định AI trung tâm rõ ràng và kiểm thử được: **từ các đoạn transcript trong phạm vi đã chọn, tạo câu hỏi nào có đúng một đáp án đúng, phương án nhiễu hợp lý, lời giải và citation nhất quán**.
3. Đây là tối ưu trực tiếp chatbot có sẵn: thêm nguồn transcript và một output học tập chủ động, không xây chatbot mới.
4. Cost-of-error được kiểm soát bằng citation, kiểm tra cấu trúc và bỏ qua đoạn thiếu căn cứ.
5. Flow có thể demo trong dưới 5 phút: chọn slide → tạo quiz → trả lời → xem giải thích và nguồn.

> Quyết định này dựa trên feasibility và impact ước tính **340 phút pain/tuần**. Trước khi dùng số liệu trên slide demo như bằng chứng, nhóm phải thay hoặc xác nhận chúng bằng khảo sát/mining ở §1.5.

---

## §3. Giải pháp tương tự đã nghiên cứu

### 3.1 Desk research

| Sản phẩm                                                                           | Flow quan sát từ tài liệu chính thức                                                         | Đáng học                                                                  | Đáng né / giới hạn                                                            | Điểm khác của lát cắt này                                                                   |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [NotebookLM](https://support.google.com/notebooklm/answer/16179559?hl=en)          | User nạp/chọn nguồn, hỏi hoặc tạo study guide từ nguồn; citation mở được về vị trí liên quan | Grounding và citation giúp kiểm tra nội dung sinh ra                      | User phải tự chuẩn bị/chọn nguồn; không tự gắn với slide đang xem trên VLearn | Transcript đúng buổi đã liên kết sẵn; mỗi câu quiz cite mã đoạn dùng để tạo câu và đáp án   |
| [ChatGPT Study Mode](https://help.openai.com/en/articles/11780217-study-mode)      | User có thể tải slide/notes, yêu cầu quiz, trả lời và nhận giải thích từng bước              | Kiểm tra hiểu và giải thích sau câu trả lời, không chỉ đưa đáp án         | User vẫn phải nạp/chỉ rõ tài liệu; nội dung có thể sai và cần kiểm tra        | Tạo quiz ngay trong chatbot VLearn từ transcript đã quản lý và giới hạn theo slide/toàn bài |
| [Khanmigo](https://www.khanacademy.org/college-careers-more/khanmigo-for-students) | AI tutor hỗ trợ học sinh trong hệ sinh thái nội dung và bài tập Khan Academy                 | Hoạt động ôn tập nằm trong trải nghiệm học thay vì tách sang công cụ khác | Phạm vi tutor rộng làm tăng failure mode                                      | Prototype chỉ tạo câu hỏi ôn tập từ lời giảng của khoá, có giải thích và nguồn kiểm chứng   |

### 3.2 Việc còn phải làm trực tiếp

`TODO-THỰC TẾ:` Mỗi thành viên dùng thử ít nhất một sản phẩm và ghi lại màn hình/flow thực tế theo bốn câu: flow, điều đáng học, điều đáng né, điểm khác. Desk research trên chưa thay thế việc dùng thử theo guide.

---

## §4. Thiết kế

### 4.1 Lát cắt một câu

**Khi một học viên đang xem lại một slide ở nhà muốn tự kiểm tra mức độ hiểu, chatbot quyết định nội dung nào trong transcript đủ căn cứ để tạo một bộ câu hỏi ôn tập có đáp án, giải thích và trích dẫn, giúp học viên biết phần nào cần xem lại.**

- **Một user:** học viên đang xem lại slide ở nhà.
- **Một việc:** tự kiểm tra mức độ hiểu và ghi nhớ nội dung vừa xem.
- **Một quyết định AI:** chọn nội dung đủ căn cứ trong transcript và tạo câu hỏi, đáp án, phương án nhiễu, giải thích nhất quán; hoặc bỏ qua khi chưa đủ căn cứ.
- **Một kết quả:** học viên hoàn thành một bộ câu hỏi có nguồn và biết phần nào cần xem lại.

### 4.2 Input, output và ràng buộc

**Input:** phạm vi do học viên chọn — “slide hiện tại” hoặc “toàn bộ bài”; số lượng câu hỏi; ánh xạ slide → transcript; các đoạn transcript truy xuất được.

**Output chuẩn:**

1. Một câu hỏi trắc nghiệm rõ ràng, tự đủ ngữ cảnh và chỉ có một đáp án đúng.
2. Bốn phương án không trùng nghĩa; phương án nhiễu hợp lý nhưng không chứa kiến thức sai nguy hiểm.
3. Đáp án đúng và giải thích ngắn sau khi học viên chọn.
4. Một hoặc nhiều citation `[Txx-NNN]` hỗ trợ trực tiếp câu hỏi, đáp án và lời giải; nút mở transcript nguồn.
5. Nếu không tạo đủ số câu đáng tin: trả số câu ít hơn và nói rõ lý do, không bịa thêm.

**Ràng buộc grounding:** không dùng kiến thức bên ngoài để tạo câu hỏi, đáp án hoặc phương án nhiễu; không hỏi chi tiết không thể xác minh từ transcript; không hiển thị “đã đối chiếu” nếu citation chưa được kiểm tra.

### 4.3 Non-goals

1. Không xây lại chatbot VLearn hoặc thay đổi toàn bộ flow hỏi đáp đang có.
2. Không tạo bài kiểm tra chính thức, quyết định điểm số hoặc dùng kết quả quiz để xếp loại học viên.
3. Không sinh câu hỏi từ web, kiến thức nền của model hoặc nguồn ngoài transcript bài học.
4. Không tạo câu tự luận cần TA/giảng viên chấm trong lát cắt prototype.
5. Không cá nhân hoá dài hạn theo hồ sơ, điểm số hoặc lịch sử học viên.
6. Không tự sinh timestamp video khi nguồn không có timestamp đáng tin cậy.

### 4.4 Mức prototype

**Mục tiêu hiện tại:** ☒ Mock ☐ Sketch ☐ Working.

| Thành phần                                    | Thật / mock            | Trạng thái hiện tại                                                  |
| --------------------------------------------- | ---------------------- | -------------------------------------------------------------------- |
| Điều hướng bài học, slide, chat, mở citation  | UI thật                | Chạy ở client trong `codebase/`                                      |
| Dữ liệu slide và một số trích đoạn transcript | Mock có mã nguồn thật  | Hard-code trong `codebase/app.js`; các mã đã tồn tại trong data pack |
| Retrieval/vector database                     | Mock                   | Chưa kết nối; chọn nguồn theo nhánh keyword                          |
| Sinh câu trả lời hỏi đáp bằng LLM             | Mock                   | Chưa có lời gọi AI thật; response hard-code                          |
| Confidence/abstention                         | Chưa build             | Spec hành vi tại §5–§6, cần thể hiện trước demo                      |
| Tạo và làm quiz                               | UI thật, nội dung mock | Flow chạy được; câu hỏi/đáp án đang hard-code trong `quizBank`       |
| Sinh quiz từ transcript bằng LLM              | Mock                   | Chưa có AI call; đây là quyết định AI trung tâm cần thay thế         |

> **Gap bắt buộc trước CP3/R5:** thêm ít nhất một lời gọi AI thật ở quyết định trung tâm và giữ log/trace trong repo; prototype hiện tại chưa thoả ràng buộc này.

### 4.5 Automation

**Chọn:** ☐ augment ☒ conditional ☐ automate.

Hệ thống tự tạo và hiển thị câu hỏi khi retrieval tìm được đoạn đủ liên quan, có thể xác định duy nhất một đáp án đúng và citation hỗ trợ toàn bộ lời giải. Đoạn thiếu căn cứ, mâu thuẫn hoặc chỉ chứa thông tin hành chính sẽ bị bỏ qua; nếu không đủ số lượng, hệ thống trả ít câu hơn và cho học viên đổi sang phạm vi toàn bài.

**Cost-of-error:** câu hỏi có đáp án sai hoặc phương án mơ hồ có thể chấm sai học viên và củng cố kiến thức sai. Lỗi này khó tự phát hiện vì giao diện thường trình bày đáp án như sự thật. Conditional phù hợp hơn automate hoàn toàn: case đạt guardrail được dùng ngay cho ôn tập tự nguyện; case không chắc bị loại. Không chọn augment vì yêu cầu giảng viên duyệt từng câu sẽ làm mất khả năng tạo quiz tức thời, nhưng kết quả cũng không được dùng làm điểm chính thức.

### 4.6 Nguyên tắc HAX/PAIR đã áp dụng

| Nguyên tắc                             | Áp cụ thể vào prototype                                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **G1 — Làm rõ hệ thống làm được gì**   | Modal “Ôn tập cùng AI” nói rõ câu hỏi được tạo từ transcript của slide/toàn bài và chỉ dùng để tự ôn, không phải bài chấm điểm |
| **G2 — Làm rõ nó làm tốt đến đâu**     | Hiện phạm vi, số câu có thể tạo và thông báo khi transcript không đủ để tạo đủ số câu đáng tin                                 |
| **G10 — Thu hẹp phạm vi khi nghi ngờ** | Không sinh câu từ đoạn mơ hồ/mâu thuẫn; bỏ case hoặc đề nghị chuyển từ slide hiện tại sang toàn bài                            |
| **G11 — Giải thích vì sao**            | Sau khi học viên chọn, hiển thị đáp án, lời giải và nút “Xem nguồn `[Txx-NNN]`”                                                |
| **G8 — Gạt bỏ dễ dàng**                | Học viên có thể đóng modal quiz hoặc bỏ qua câu mà không bị chặn việc xem slide                                                |
| **G9 — Sửa dễ dàng**                   | Nút tạo lại bộ câu hỏi cho phép đổi phạm vi/số lượng; feedback “câu mơ hồ/đáp án sai/khác” gắn với từng câu                    |
| **PAIR — Explainability + Trust**      | Citation cho phép kiểm tra vì sao đáp án đúng; không hiển thị similarity score như xác suất câu hỏi đúng                       |
| **PAIR — Errors + Graceful Failure**   | “Không đủ nội dung để tạo câu” khác với lỗi kỹ thuật; mỗi trạng thái có hành động tiếp theo riêng                              |
| **PAIR — Feedback + Control**          | User quyết định phạm vi và số câu, có thể bỏ qua quiz; feedback thu ngay tại từng lời giải                                     |

---

## §5. Kiểu lỗi — bốn lớp chỗ khó và kịch bản rủi ro

### 5.1 Bốn lớp cụ thể

| Lớp                          | Chỗ khó trong lát cắt                                                                                                      | Hậu quả nếu xử lý sai                                             |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| ① Nguồn sự thật              | Câu hỏi, đáp án hoặc giải thích thêm kiến thức ngoài transcript; citation có thật nhưng không hỗ trợ đáp án                | Học viên ghi nhớ đáp án sai dưới vẻ ngoài “có nguồn”              |
| ② Mơ hồ / thiếu thông tin    | Transcript dùng đại từ, câu nói dang dở, ASR `[không nghe rõ]`, hoặc có hơn một phương án đều đúng                         | Quiz chấm một lựa chọn là sai dù câu hỏi không có đáp án duy nhất |
| ③ Ngoài phạm vi / thẩm quyền | Model tạo câu hỏi về deadline, thông tin hành chính, đời tư giảng viên hoặc biến quiz ôn tập thành bài chấm điểm           | Hệ thống vượt mục đích học tập hoặc gây hậu quả thực tế           |
| ④ Đặc thù domain học tập     | Phương án nhiễu đảo sai khái niệm nhưng lời giải không sửa rõ; câu hỏi chỉ kiểm tra nhớ từ thay vì hiểu quan hệ quan trọng | Quiz củng cố misconception hoặc tạo cảm giác hiểu giả             |

### 5.2 Kịch bản rủi ro

|   # | Tình huống cụ thể                                                                                     | Lớp | Hành vi mong muốn                                                                                     | Nguyên tắc       |
| --: | ----------------------------------------------------------------------------------------------------- | :-: | ----------------------------------------------------------------------------------------------------- | ---------------- |
|   1 | Transcript không chứa đủ thông tin nhưng model dùng kiến thức nền để hoàn thiện câu hỏi               |  ①  | Loại câu; không dùng kiến thức ngoài context; nếu thiếu câu thì trả ít hơn và cho đổi phạm vi         | G2, G10          |
|   2 | Đáp án nghe hợp lý nhưng citation không chứa bằng chứng cho đáp án                                    |  ①  | Validator chặn câu trước khi render; thử sinh lại tối đa một lần, sau đó bỏ câu                       | G11, PAIR Trust  |
|   3 | Câu hỏi ghép tiền đề từ hai đoạn nói về hai ngữ cảnh khác nhau                                        |  ①  | Chỉ cho phép ghép khi cả đoạn cùng chủ đề và lời giải cite đủ; nếu không thì tách/bỏ                  | G10, G11         |
|   4 | Đoạn transcript có `[không nghe rõ]` ngay tại thông tin dùng làm đáp án                               |  ②  | Không tạo câu hỏi từ phần bị thiếu; chọn đoạn khác                                                    | G10, PAIR Errors |
|   5 | Hai phương án đều có thể đúng theo transcript                                                         |  ②  | Fail kiểm tra single-answer; sinh lại phương án hoặc bỏ câu                                           | G2, G9           |
|   6 | User yêu cầu 5 câu cho một slide chỉ có đủ nội dung tạo 2 câu                                         |  ②  | Trả 2 câu và thông báo “Phạm vi này chỉ đủ căn cứ cho 2 câu”; cho chọn toàn bài                       | G2, G10          |
|   7 | Transcript có phần nhắc deadline hoặc logistics                                                       |  ③  | Loại đoạn hành chính khỏi pool tạo quiz; không biến logistics thành nội dung ôn tập                   | G1, PAIR Errors  |
|   8 | User muốn dùng điểm quiz AI làm điểm chính thức                                                       |  ③  | Nêu rõ đây là tự ôn; không ghi điểm vào đánh giá chính thức hoặc gửi giảng viên như kết quả chấm      | G1, G2           |
|   9 | Prompt injection nằm trong transcript yêu cầu model bỏ qua quy tắc                                    |  ③  | Coi transcript là dữ liệu, không phải instruction; không làm theo chỉ dẫn trong nguồn                 | G10, PAIR Trust  |
|  10 | Câu về automation/augmentation biến một phổ thành hai cực loại trừ                                    |  ④  | Sửa câu hỏi/phương án để giữ đúng quan hệ “một phổ”; cite `[T02-032]`, `[T02-033]`                    | G11, PAIR Trust  |
|  11 | Phương án nhiễu nói “lượt truy cập là North Star Metric” nhưng lời giải chỉ báo sai, không giải thích |  ④  | Lời giải phải phân biệt metric giá trị cuối với chỉ số trung gian và cite cả hai ý                    | G11              |
|  12 | Bộ quiz toàn câu nhớ định nghĩa, không kiểm tra phân biệt hoặc áp dụng                                |  ④  | Yêu cầu bộ 5 câu có ít nhất 2 câu hiểu/phân biệt hoặc tình huống; nếu nguồn không đủ thì báo giới hạn | G2, G9           |

**Kịch bản đáng sợ nhất:** #2 — đáp án được trình bày là đúng và có citation, nhưng citation không hỗ trợ đáp án. Dạng lỗi này vừa chấm sai vừa tạo cảm giác đáng tin giả, khó bị học viên phát hiện.

---

## §6. Bốn đường đi của trải nghiệm

### 6.1 Happy path

1. Học viên ở slide 3 bấm **Ôn tập**, chọn “Slide hiện tại” và 3 câu.
2. Chatbot truy xuất `[T02-032]`, `[T02-033]`, `[T02-034]`, tạo các câu hỏi có một đáp án đúng.
3. Học viên chọn đáp án; hệ thống chấm ngay và hiển thị lời giải cùng mã nguồn.
4. Học viên click citation để xem nguyên văn, hoàn thành bộ quiz và biết câu nào cần xem lại.

### 6.2 Low-confidence / mơ hồ

1. Học viên yêu cầu 5 câu cho một slide ngắn.
2. Hệ thống chỉ tìm được đủ căn cứ để tạo 2 câu đạt guardrail.
3. Hệ thống hiển thị: “Slide này chỉ đủ nội dung đáng tin cho 2 câu; mình không tạo thêm để tránh lặp hoặc đoán.”
4. Học viên chọn làm 2 câu hoặc đổi sang “Toàn bộ bài học”.

### 6.3 Failure / không có căn cứ

1. Học viên yêu cầu tạo quiz cho slide nhưng ánh xạ không tìm được transcript hoặc mọi đoạn đều thiếu/mâu thuẫn.
2. Retrieval hoặc citation validator không tìm được căn cứ đủ tạo một câu có đáp án duy nhất.
3. Hệ thống không render câu hỏi rỗng hoặc câu hỏi dựa vào kiến thức model; thông báo: “Mình chưa có đủ transcript đáng tin để tạo câu ôn tập cho slide này.”
4. Hệ thống cho hai hành động: **Ôn toàn bộ bài** hoặc **Quay lại xem slide**.

### 6.4 Correction / user sửa

1. Học viên thấy một câu có hai phương án đều đúng và chọn feedback **Câu mơ hồ**.
2. Hệ thống loại câu khỏi điểm phiên hiện tại, hiển thị nguồn để học viên kiểm tra và cho làm câu thay thế.
3. Câu thay thế được sinh lại từ transcript với ràng buộc single-answer và citation mới.
4. Feedback lưu loại lỗi `ambiguous-options`; không tự động thay đổi đáp án toàn hệ thống chỉ từ một báo cáo.

### 6.5 Ngoài phạm vi

Nếu đoạn transcript chứa lời nhắc deadline, hệ thống gắn nhãn hành chính và loại khỏi pool tạo quiz. Kết quả ôn tập không được dùng làm điểm chính thức hoặc thay thế bài kiểm tra do giảng viên duyệt.

### 6.6 Case đặc thù domain

Với nội dung automation/augmentation, câu hỏi phải giữ đúng quan hệ “một phổ về mức độ con người tham gia”. Nếu học viên chọn phương án coi hai khái niệm là hai cực loại trừ, lời giải sửa misconception và gắn `[T02-032]`, `[T02-033]`.

---

## §7. Kiểm thử

### 7.1 Metric thực tế đang có và cách dùng trong kiểm thử

Các số hiện có trong spec được dùng làm **baseline/đầu vào chọn case**, không được diễn giải thành kết quả prototype khi chưa chạy eval hoặc validation:

| Metric trong file này                  | Giá trị thực tế đã ghi nhận                         | Dùng trong §7 như thế nào                                                                 |
| -------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Khảo sát pain đọc slide/tìm khái niệm  | n = 21; 80% xác nhận gặp khó khăn                   | Chọn user/task validation đúng nhóm đau chính; không dùng làm tỷ lệ pass của AI            |
| Ứng viên A trong bảng impact           | 17/21; 2 lần/tuần; 10 phút/lần; 340 phút pain/tuần  | Ưu tiên test flow tạo quiz ôn tập vì đây là pain lớn nhất                                  |
| Mining chatlog                         | 2.522 dòng chatlog; 46.2% câu trả lời rỗng citation | Bắt buộc có nhóm case kiểm tra citation rỗng/sai/không hỗ trợ đáp án                       |
| Nguồn transcript                       | 6 transcript sạch, khoảng 700 đoạn có mã `[Txx-NNN]` | Golden set phải dùng mã đoạn thật; mọi citation trong output phải tồn tại trong nguồn chọn |

Metric cần đo sau khi chạy prototype:

1. **AI quality:** số case pass/tổng, tỷ lệ citation hợp lệ, tỷ lệ abstain đúng ở case thiếu căn cứ/ngoài phạm vi.
2. **User validation:** trong ≥5 user test ở §8.2, số người tin kết quả vì kiểm tra được nguồn, số người hiểu lý do khi hệ thống tạo ít câu hơn yêu cầu, thời gian hoàn thành một quiz.
3. **Impact sanity check:** user có còn mất khoảng 10 phút/lần để tự tạo/tìm câu hỏi hay prototype giảm được phần nào thời gian đó.

### 7.2 Các chiều chất lượng và định nghĩa kiểm chứng được

Một case chỉ **pass tổng** khi đạt tất cả điều kiện cứng và đạt yêu cầu về đúng ý, đúng cỡ.

| Chiều                                  | Pass khi                                                                                            | Fail khi                                                                                           |
| -------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Grounded factuality — điều kiện cứng   | Câu hỏi, đáp án, phương án nhiễu và lời giải đều có thể kiểm chứng từ các đoạn đã cite              | Có ít nhất một chi tiết cần kiến thức ngoài transcript hoặc gán lời không có cho giảng viên        |
| Single correct answer — điều kiện cứng | Chỉ một phương án đúng; ba phương án còn lại sai rõ ràng theo nguồn và không trùng nghĩa            | Có 0 hoặc ≥2 đáp án đúng; đáp án phụ thuộc suy đoán/ngữ cảnh không được nêu                        |
| Citation validity — điều kiện cứng     | Mã đoạn tồn tại, đúng phạm vi và hỗ trợ trực tiếp đáp án cùng lời giải                              | Mã không tồn tại, sai scope hoặc chỉ gần chủ đề nhưng không chứng minh đáp án                      |
| Abstention & scope — điều kiện cứng    | Đoạn thiếu căn cứ/hành chính/mâu thuẫn không tạo câu; hệ thống trả ít câu hơn và nêu bước tiếp theo | Cố sinh đủ số lượng, tạo câu logistics hoặc dùng kiến thức model để lấp chỗ trống                  |
| Question clarity                       | Câu hỏi tự đủ ngữ cảnh, không dùng đại từ mơ hồ và người chấm độc lập hiểu cùng một yêu cầu         | Cần đoán “cái này/nó/ở trên”, câu phủ định kép hoặc diễn đạt gây hiểu khác nhau                    |
| Distractor quality                     | Phương án nhiễu cùng loại với đáp án, hợp lý đủ để kiểm tra hiểu nhưng không đưa kiến thức sai mới  | Nhiễu vô lý, khác loại, lộ đáp án qua độ dài hoặc chứa misconception không được sửa trong lời giải |
| Pedagogical value                      | Câu hỏi kiểm tra ý quan trọng; với bộ 5 câu có ≥2 câu hiểu/phân biệt/áp dụng thay vì chỉ nhớ từ     | Hỏi chi tiết vụn, thông tin hành chính hoặc toàn bộ chỉ chép định nghĩa                            |
| Feedback actionability                 | Sau khi chọn có giải thích vì sao đúng/sai và citation mở được                                      | Chỉ báo “đúng/sai” hoặc user không thể xem nguồn để sửa hiểu nhầm                                  |

**Kiểm tra độ rõ rubric:** `TODO-THỰC TẾ` — hai thành viên chấm độc lập cùng 5 output; nếu bất đồng >1/5 case, sửa định nghĩa trước khi chạy toàn bộ.

### 7.3 Golden set

**File dự kiến:** `eval/golden-set.json` hoặc `eval/golden-set.csv`.  
**Trạng thái:** `TODO-THỰC TẾ — chưa tạo/chưa chạy; không khai là đã có.`

Cơ cấu tối thiểu 24 case, bám các metric thực tế ở §1.5/§2 thay vì tự tạo một bộ case chung chung:

| Nhóm case                    | Số case | Yêu cầu                                                                                     |
| ---------------------------- | ------: | ------------------------------------------------------------------------------------------- |
| Case thường                  |       8 | Đoạn rõ, đủ tạo câu hỏi có một đáp án đúng và lời giải                                      |
| ① Nguồn sự thật              |       2 | Citation gần nghĩa nhưng không hỗ trợ đáp án; model có thể biết ngoài nguồn                 |
| ② Mơ hồ/thiếu thông tin      |       2 | `[không nghe rõ]`; nguồn chỉ đủ 2 câu nhưng user yêu cầu 5                                  |
| ③ Ngoài phạm vi/thẩm quyền   |       2 | Đoạn logistics; yêu cầu dùng quiz làm điểm chính thức                                       |
| ④ Đặc thù domain             |       2 | Misconception automation/augmentation; metric/agent                                         |
| Case hiếm                    |       4 | Nguồn mâu thuẫn; prompt injection trong transcript; hai đáp án đúng; đoạn ghép sai ngữ cảnh |
| Case bổ sung từ chatlog thật |       4 | Bảo đảm tổng số case lấy/phát triển từ nhu cầu chatlog đạt ≥10                              |
| **Tổng**                     |  **24** | ≥2 case/lớp, 8 case thường, 4 case hiếm, ≥10 case từ chatlog thật                           |

Ràng buộc theo nguồn số liệu:

1. Ít nhất 10/24 case phải có `origin = chatlog_mining` hoặc được phát triển trực tiếp từ pattern trong 2.522 dòng chatlog.
2. Trong nhóm chatlog, phải có case đại diện cho lỗi citation rỗng vì baseline mining hiện là 46.2% câu trả lời rỗng citations.
3. Ít nhất 8/24 case phải thuộc flow tạo quiz ôn tập của ứng viên A, vì đây là ứng viên có impact lớn nhất trong §2.1.
4. Không dùng n = 21 hoặc 80% khảo sát làm số case pass; đó là metric xác nhận pain, không phải metric chất lượng AI.

Mỗi record cần có: `case_id`, `origin`, `source_conversation_id` (nếu có), `slide_scope`, `requested_count`, `transcript_segment_ids`, `expected_behavior`, `must_cover`, `must_not_claim`, `risk_class`, `is_rare`, `grader_notes`.

### 7.4 Quality bar — chốt trong spec

> **Đạt AI quality khi ≥80% golden set pass tổng, tương đương ít nhất 20/24 case; đồng thời 100% câu được render có đúng một đáp án, đáp án được transcript hỗ trợ và citation tồn tại đúng phạm vi; 100% case thiếu căn cứ/ngoài phạm vi không được cố sinh câu; và không có mã đoạn nguồn bị bịa.**

> **Đạt user validation khi chạy ≥5 người theo §8.2 và ghi lại được: tỷ lệ người tin kết quả vì kiểm tra được nguồn, tỷ lệ người hiểu lý do hệ thống tạo ít câu hơn yêu cầu, thời gian hoàn thành quiz và quote chính. Không thay các metric này bằng số 80% khảo sát pain.**

Quality bar AI không được hạ sau khi xem kết quả. Nếu không đạt, báo đúng tỷ lệ và phân tích failure thay vì đổi tiêu chí. Các metric khảo sát/mining ở §1.5 được dùng để giải thích vì sao chọn vấn đề và chọn case, không dùng để tuyên bố prototype đã hiệu quả.

### 7.5 Kế hoạch chạy

1. Chốt golden set và expected behavior trước khi xem output.
2. Chạy trọn bộ; lưu mọi output, kể cả fail, trong `eval/run-01.*`.
3. Hai người chấm độc lập ít nhất toàn bộ case khó; giải quyết bất đồng bằng rubric, không bằng cảm giác.
4. Chọn một failure nghiêm trọng nhất để sửa prompt/retrieval.
5. Chạy lại toàn bộ và lưu `eval/run-02.*`; không chỉ chạy lại case đã sửa.

### 7.6 Kết quả các lượt chạy

| Lượt | Thời điểm      | Pass/tổng | Pass rate | Câu render | Citation rỗng/sai | Abstain đúng | Abstain sai | Pass rate case chatlog | So với bar | Failure chính | Artifact        |
| ---- | -------------- | --------: | --------: | ---------: | ----------------: | -----------: | ----------: | ---------------------: | ---------- | ------------- | --------------- |
| 01   | 2026-07-30 17:03 ICT |   24 / 24 |    100.0% |         24 |                 0 |            3 |           0 |                   `N/A` | Đạt        | Không có       | `VLearn-Socratic-Tutor/eval/runs/vlearn_marked_text_grounding_v1_2026-07-30T100300Z0000.json` |
| 02   | 2026-07-30 21:20 ICT |   24 / 24 |    100.0% |         24 |                 0 |            3 |           0 |                   `N/A` | Đạt        | Không có       | `VLearn-Socratic-Tutor/eval/runs/vlearn_marked_text_grounding_v1_2026-07-30T142010Z0000.json` |

Các số trên lấy từ benchmark hiện có `vlearn_marked_text_grounding_v1`, chưa phải benchmark riêng cho quiz generator. Lượt 02 được rerun với provider DeepSeek sau khi nạp `.env` qua `DAY04_ENV_FILE=.env`. `Pass rate case chatlog` để `N/A` vì `eval/golden_set.json` hiện chưa có metadata `origin = chatlog_mining`; cần bổ sung metadata này để đối chiếu trực tiếp với baseline 2.522 dòng chatlog và 46.2% câu trả lời rỗng citation.

---

## §8. Phân công & kế hoạch

### 8.1 Phân công có tên

| Hạng mục                       | Người chịu trách nhiệm | Deliverable                      |
| ------------------------------ | ---------------------- | -------------------------------- |
| Spec và quyết định sản phẩm    | `[TODO tên]`           | `spec.md`                        |
| Evidence khảo sát/mining       | `[TODO tên]`           | log chuẩn A/B + 5 quote          |
| Prompt, retrieval và guardrail | `[TODO tên]`           | prompt/version + trace AI thật   |
| Golden set và chấm eval        | `[TODO tên]`           | `eval/golden-set.*`, các run     |
| Code/UI prototype              | `[TODO tên]`           | `codebase/`                      |
| Validation, demo và slide      | `[TODO tên]`           | `validation/`, `demo-slides.pdf` |

> Một người có thể giữ nhiều hạng mục, nhưng mọi hạng mục phải có tên và người đó phải giải thích được phần mình làm.

### 8.2 Willing users và validation CP5

**≥3 willing users:** `TODO-THỰC TẾ — [Tên/vai 1], [Tên/vai 2], [Tên/vai 3]`.  
**Kế hoạch:** mời ≥5 người ngoài nhóm, trong đó có ≥2 willing users đã khai từ CP1; mỗi người làm một task thật trong 10 phút, người điều phối im lặng quan sát.

Ba câu hỏi cố định sau task:

1. “Điều gì khó hiểu hoặc khó chịu nhất?”
2. “Kết quả này bạn có tin không — vì sao?”
3. “Bạn có dùng thật không — vì sao hoặc vì sao chưa?”

**Người ghi log:** `[TODO tên]`.  
**Artifact:** `validation/feedback-log.md`, gồm tên/vai, willing user hay không, task, quan sát, quote nguyên văn, mức nghiêm trọng.

### 8.3 Multi-prototype

`TODO nếu kịp:` thử hai phương án trên đúng một trục **xử lý khi không đủ nội dung tạo số câu đã yêu cầu**:

- **Phương án A:** tự giảm số câu và giải thích lý do.
- **Phương án B:** hỏi user có muốn mở rộng từ slide hiện tại sang toàn bài trước khi tạo.

Tiêu chí chọn: tỷ lệ hoàn tất quiz không cần trợ giúp, tỷ lệ hiểu đúng lý do số câu bị giảm, thời gian tới câu đầu tiên và quote về mức kiểm soát. Không dùng khác màu/giao diện làm “phương án khác”.

### 8.4 Việc bắt buộc còn thiếu trước các checkpoint

- **CP3:** lời gọi AI thật ở quyết định trung tâm; golden set ≥20; run 01 có %.
- **CP4:** evidence chuẩn A/B; số liệu impact; tên phân công; giữ nguyên quality bar đã chốt.
- **CP5:** ≥5 feedback có tên/quote; ít nhất một thay đổi có căn cứ; dry run.
- **CP6:** demo một happy path và một failure path; báo % thật so với bar.

---

## §9. Changelog

| Thời điểm      | Đổi gì                                                                                                                                                   | Vì sao / trỏ về feedback hoặc case                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 2026-07-30     | Tạo spec ban đầu cho lát cắt hỏi đáp transcript theo slide                                                                                               | Theo `02-guide.md`, `03-template-ai-spec.md`, rubric và trạng thái prototype trong `codebase/`       |
| 2026-07-30     | Chuyển hướng thành tối ưu chatbot có sẵn: dùng transcript để tạo câu hỏi ôn tập có đáp án, giải thích và citation; cập nhật lại automation, risk và eval | Nhóm xác nhận chatbot là tính năng hiện có và cải tiến trung tâm là tạo câu hỏi ôn tập từ transcript |
| `TODO-THỰC TẾ` | `[Thay đổi sau run/validation]`                                                                                                                          | `[case_id hoặc feedback_id]`                                                                         |

---

## Phụ lục A — Canvas CP1 rút gọn

1. **Hướng:** A — tối ưu chatbot có sẵn trên VLearn.
2. **Job executor:** học viên đang xem lại một slide ở nhà và muốn tự kiểm tra mức độ hiểu.
3. **Pain:** slide cô đọng, còn việc tự tạo câu hỏi từ cả lời giảng tốn công; học viên dễ tưởng mình hiểu và không biết phần nào cần xem lại.
4. **Evidence ban đầu:** có 6 transcript sạch, khoảng 700 đoạn làm nguồn; bằng chứng pain khảo sát/mining `TODO-THỰC TẾ`.
5. **Lát cắt:** Khi một học viên đang xem lại một slide ở nhà muốn tự kiểm tra mức độ hiểu, chatbot quyết định nội dung nào trong transcript đủ căn cứ để tạo một bộ câu hỏi ôn tập có đáp án, giải thích và trích dẫn, giúp học viên biết phần nào cần xem lại.
6. **Automation:** conditional vì câu hỏi có đáp án sai/mơ hồ có thể củng cố kiến thức sai; case không chắc phải bị loại; ≥3 willing users `TODO-THỰC TẾ`.
7. **Phân công:** `TODO-THỰC TẾ — điền tên theo §8.1`.

## Phụ lục B — Prompt contract cho quyết định AI trung tâm

Prompt triển khai có thể thay đổi qua eval, nhưng phải giữ các invariant sau:

1. Chỉ dùng `retrieved_segments` làm nguồn sự thật để tạo câu hỏi, phương án, đáp án và lời giải.
2. Mỗi câu phải tự đủ ngữ cảnh, có đúng một đáp án đúng và bốn phương án không trùng nghĩa.
3. Nếu không có đoạn hỗ trợ đáng tin, trả về `INSUFFICIENT_EVIDENCE`; không dùng kiến thức nền của model để tạo đủ số lượng.
4. Mỗi câu phải kèm một hoặc nhiều `segment_id` hỗ trợ trực tiếp đáp án và lời giải.
5. Không tạo câu hỏi từ logistics, thông tin cá nhân, đoạn `[không nghe rõ]` tại đáp án hoặc chỉ dẫn nằm trong transcript.
6. Khi chỉ tạo được ít câu hơn `requested_count`, trả danh sách ngắn hơn cùng `reason`, không hạ tiêu chuẩn.
7. Output có cấu trúc để code kiểm tra trước khi render:

```json
{
  "status": "QUIZ_READY | PARTIAL | INSUFFICIENT_EVIDENCE",
  "requested_count": 3,
  "reason": "string | null",
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correct_option_index": 0,
      "explanation": "string",
      "citations": ["Txx-NNN"]
    }
  ],
  "next_actions": ["string"]
}
```

Code phải từ chối render một câu nếu citation rỗng, mã đoạn không tồn tại trong context, không có đúng bốn phương án, đáp án không duy nhất hoặc câu/đáp án/lời giải không qua bước kiểm tra grounding đã chọn.
