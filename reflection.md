# Reflection: Quá trình làm việc cùng AI từ 30/07 đến 31/07/2026

## 1. Tổng quan

Trong hai ngày vừa qua, tôi đã nhờ AI đồng hành để phát triển ý tưởng **VLearn Socratic Tutor** thành một prototype có thể chạy và demo. Mục tiêu chính của sản phẩm là giúp học viên tự kiểm tra mức độ hiểu bài khi xem lại slide, bằng các câu hỏi ôn tập được tạo từ transcript bài giảng và có trích dẫn để kiểm chứng.

AI không chỉ được dùng để sinh code. Tôi đã nhờ AI hỗ trợ xuyên suốt từ phân tích bài toán, viết đặc tả, thiết kế kiến trúc, triển khai backend và frontend, xây dựng bộ đánh giá, viết kiểm thử, đến chuẩn bị tài liệu demo.

## 2. Những việc tôi đã nhờ AI thực hiện

### Phân tích đề bài và xác định hướng sản phẩm

Tôi đã nhờ AI đọc các yêu cầu của hackathon, phân tích dữ liệu được cung cấp và đề xuất một lát cắt sản phẩm đủ nhỏ để hoàn thành trong thời gian ngắn. Từ các phương án như hỏi đáp theo slide, tạo chapter và tạo câu hỏi ôn tập, nhóm chọn hướng tạo quiz có căn cứ từ transcript.

AI hỗ trợ tôi:

- xác định người dùng chính là học viên đang ôn lại bài ở nhà;
- diễn đạt JTBD, problem statement và các job story;
- so sánh tác động và tính khả thi của các phương án;
- xác định ranh giới của prototype và các phần không làm;
- làm rõ quyết định AI trung tâm: chỉ tạo câu hỏi khi transcript có đủ căn cứ, nếu không thì bỏ qua thay vì bịa nội dung.

### Viết và hoàn thiện AI Spec

Tôi đã nhờ AI xây dựng và cập nhật `spec.md` theo rubric của hackathon. Nội dung bao gồm bài toán người dùng, bằng chứng, thiết kế input/output, yêu cầu grounding, failure modes, metric đánh giá và kịch bản demo.

Qua nhiều lần chỉnh sửa, spec được cụ thể hóa từ một ý tưởng chung thành một mô tả có thể triển khai và kiểm thử. Một quyết định quan trọng là mỗi câu hỏi phải có đáp án, giải thích và mã trích dẫn dạng `[Txx-NNN]` từ transcript.

### Xây dựng prototype Socratic Tutor

Tôi đã nhờ AI tạo prototype ban đầu cho VLearn Socratic Tutor, gồm:

- đọc và chuẩn hóa các transcript bài giảng;
- truy xuất những đoạn nội dung liên quan;
- tạo câu trả lời hoặc câu hỏi ôn tập bám theo nguồn;
- hỗ trợ nhiều nhà cung cấp mô hình như OpenAI, Gemini, Anthropic, DeepSeek và OpenRouter;
- xây dựng agent, system prompt và khai báo tool;
- tạo API để frontend có thể gọi các chức năng chat, giải thích đoạn văn được chọn và tạo quiz.

### Phát triển giao diện học tập

Tôi đã nhờ AI phát triển giao diện từ prototype HTML/CSS/JavaScript thành ứng dụng React/Vite. Giao diện được chia thành các component cho danh sách bài học, trình xem slide, điều hướng slide, chatbot, ghi chú, nguồn trích dẫn và quiz.

Các chức năng chính được bổ sung gồm:

- xem danh sách bài học và tiến độ học;
- xem slide PDF;
- chọn đoạn văn để yêu cầu AI giải thích;
- trò chuyện với trợ lý học tập;
- mở nguồn dùng để tạo câu trả lời;
- tạo và làm quiz ngay trong luồng học;
- lưu một phần trạng thái học tập ở phía trình duyệt.

### Chuẩn bị tài liệu báo cáo và demo

Cuối cùng, tôi đã nhờ AI cập nhật `README.md`, `REPORT.md` và `demo-slides.md`. Các tài liệu này mô tả cách chạy hệ thống, kiến trúc chính, luồng demo, bằng chứng đánh giá và các lưu ý khi trình bày.

AI giúp chuyển phần kỹ thuật thành một câu chuyện demo ngắn gọn: chọn bài học hoặc slide, đặt câu hỏi hay tạo quiz, trả lời, xem giải thích và kiểm tra nguồn transcript.

## 3. Kết quả đạt được

Sau quá trình làm việc, ý tưởng ban đầu đã trở thành một prototype gồm hai phần chính:

- backend Flask cung cấp chat, retrieval, giải thích đoạn được chọn và tạo quiz;
- frontend React/Vite cung cấp không gian học tập với slide, chat, quiz, ghi chú và nguồn trích dẫn.

Ngoài sản phẩm chạy được, dự án còn có AI Spec, system prompt, tool declaration, golden set, eval runner, test API, báo cáo và nội dung demo. Giá trị lớn nhất là sản phẩm đã có cơ chế grounding vào transcript thay vì chỉ dựa vào kiến thức sẵn có của mô hình.

## 4. Điều tôi học được khi làm việc cùng AI

### Cần giao bài toán rõ hơn là chỉ yêu cầu “làm một chatbot”

Khi tôi xác định rõ người dùng, thời điểm sử dụng, input, output và cost of error, chất lượng đề xuất của AI tốt hơn đáng kể. Một lát cắt hẹp nhưng đo được phù hợp với hackathon hơn một trợ lý học tập làm quá nhiều việc.

### AI tạo code nhanh nhưng con người phải giữ vai trò ra quyết định

AI có thể xây dựng nhiều module trong thời gian ngắn, nhưng tôi vẫn cần kiểm tra sự thống nhất giữa spec, code, UI và dữ liệu. Nếu không kiểm soát phạm vi, dự án dễ có nhiều chức năng nhưng thiếu một luồng chính thật sự hoàn chỉnh.

### Grounding và eval quan trọng hơn câu trả lời “nghe hay”

Đối với sản phẩm giáo dục, một câu trả lời trôi chảy nhưng sai nguồn có thể khiến người học hiểu sai. Citation, golden set, guardrail và log eval giúp biến chất lượng từ cảm nhận chủ quan thành thứ có thể kiểm tra.

### Tài liệu phải phản ánh đúng trạng thái thực tế

README, spec và report cần được cập nhật cùng với code. Những metric chưa đo được phải ghi là chưa có hoặc `N/A`; không nên biến giả định thành kết quả. Đây là nguyên tắc quan trọng khi trình bày một sản phẩm AI dựa trên bằng chứng.

## 5. Những điểm còn có thể cải thiện

- Hoàn thiện ánh xạ chính xác giữa từng slide và các đoạn transcript tương ứng.
- Mở rộng golden set bằng các tình huống thực tế và metadata rõ ràng hơn.
- Đánh giá chất lượng câu hỏi quiz với người học thật, không chỉ bằng kiểm thử kỹ thuật.
- Cải thiện xử lý khi model hoặc provider lỗi, hết quota hoặc phản hồi chậm.
- Tối ưu bundle frontend và xử lý các cảnh báo còn lại của PDF viewer.
- Kiểm tra accessibility, trải nghiệm trên màn hình nhỏ và trạng thái loading/error.
- Bổ sung đo lường tác động thực tế: thời gian ôn bài, tỷ lệ hoàn thành quiz và khả năng nhớ lại kiến thức.

## 6. Kết luận

Trong hai ngày, tôi đã sử dụng AI như một cộng sự kỹ thuật và tư duy sản phẩm: cùng phân tích vấn đề, viết đặc tả, triển khai, kiểm thử, đánh giá và chuẩn bị demo. AI giúp tăng tốc đáng kể, nhưng kết quả tốt nhất chỉ xuất hiện khi tôi đưa ra mục tiêu rõ ràng, giới hạn phạm vi, yêu cầu bằng chứng và liên tục kiểm tra sự thống nhất giữa nhu cầu người dùng với sản phẩm được xây dựng.

Điều tôi rút ra là làm sản phẩm AI không chỉ là kết nối một mô hình vào giao diện. Một sản phẩm đáng tin cần có nguồn dữ liệu rõ ràng, cơ chế từ chối khi thiếu căn cứ, tiêu chí đánh giá cụ thể và một trải nghiệm giúp người dùng hiểu được vì sao họ nên tin vào kết quả.
