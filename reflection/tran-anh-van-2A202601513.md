# Reflection — Trần Anh Văn — 2A202601513

Phần phụ trách: React UI, kết nối frontend-backend, prompt, retrieval, guardrail và code prototype.

## 1. Quyết định quan trọng tôi đã tham gia

Tôi tham gia xây cả React/Vite UI và backend Flask. Ở phía UI, tôi kết nối các flow xem slide, hỏi chatbot, mở citation, giải thích đoạn text được chọn và tạo quiz với các API backend. Ở phía backend, tôi quyết định tách backend AI thành API-only để React/Vite là UI duy nhất của prototype. Backend xử lý các flow `/api/chat`, `/api/marked-text`, `/api/quiz` và `/api/version`; API key chỉ nằm ở server thông qua biến môi trường.

Với quiz, tôi chọn cách conditional automation: chỉ trả câu hỏi khi retrieval tìm được transcript đủ căn cứ, citation hợp lệ, đúng bốn phương án và chỉ số đáp án nằm trong phạm vi cho phép. Nếu không đủ căn cứ, hệ thống trả `PARTIAL` hoặc `INSUFFICIENT_EVIDENCE` thay vì cố tạo đủ số lượng.

## 2. Bằng chứng hoặc feedback làm thay đổi quyết định

Ban đầu prototype có nguy cơ để model tạo nội dung nghe hợp lý nhưng không được transcript hỗ trợ. Vì vậy tôi đưa kiểm tra citation vào server-side: từ chối citation rỗng, citation không có trong các chunk đã retrieval, số lượng phương án khác bốn và đáp án không hợp lệ.

Feedback của nhóm cũng cho thấy Flask không nên tiếp tục giữ UI cũ khi React/Vite đã là surface demo chính. Tôi đã bỏ route render Flask, tắt static serving và giữ backend chỉ phục vụ API; đồng thời hoàn thiện phía React để UI gọi đúng các endpoint `/api/*`. Đây là quyết định giúp boundary giữa UI và AI rõ hơn, đồng thời giảm nguy cơ lộ API key ở client.

## 3. Điều tôi sẽ làm khác nếu có thêm thời gian

Tôi sẽ xây một golden set riêng cho quiz generator thay vì chủ yếu dùng benchmark marked-text hiện tại. Bộ test đó cần đo rõ câu hỏi có một đáp án đúng, mức độ phù hợp của phương án nhiễu, citation có thực sự hỗ trợ đáp án và hành vi abstain khi transcript thiếu hoặc mâu thuẫn.

Tôi cũng sẽ bổ sung metadata `origin = chatlog_mining` cho các case phù hợp để có thể đối chiếu pass rate với pattern 2.522 dòng chatlog, và xử lý các cảnh báo build liên quan đến asset SVG/PDF trước khi triển khai production.

## 4. Phần code/artifact tôi có thể giải thích

- `codebase/backend/src/app.py`: Flask entrypoint và các API route.
- `codebase/src/App.jsx`: cấu trúc chính của React UI và điều hướng giữa các view.
- `codebase/src/services/aiAgentService.js`: client gọi AI backend từ UI.
- `codebase/src/components/ChatPanel.jsx`, `QuizModal.jsx`, `SourceDrawer.jsx`: chat, quiz, citation và nguồn transcript trên giao diện.
- `codebase/src/views/WorkspaceView.jsx`: flow workspace xem slide và tương tác với AI.
- `codebase/backend/src/retrieval/`: nạp transcript, BM25 retrieval và chọn context.
- `codebase/backend/src/services/quiz_service.py`: tạo và validate quiz từ context transcript.
- `codebase/backend/src/artifacts/system_prompt.md`: system prompt và quy tắc grounded response.
- `codebase/backend/tests/test_quiz_api.py`: test các trạng thái ready, partial, insufficient và các trường hợp output không hợp lệ.

Kết quả kiểm tra tôi đã quan sát: backend regression tests đạt `9 passed`, eval marked-text đạt `24/24`, và frontend build thành công. Tôi hiểu các con số này chưa chứng minh quiz generator đã đạt quality bar riêng; đó vẫn là rủi ro cần tiếp tục đo.
