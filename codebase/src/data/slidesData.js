const slideOutline = [
  ['Prompt Engineering & Tool Calling', 'Làm sao nói để AI hiểu đúng ý?', 'AICB-P1 · Ngày 4 · Prompt engineering và tool calling.', ['Bài học này tập trung vào những phần nào?', 'Prompt và tool calling liên quan nhau ra sao?']],
  ['Hãy suy nghĩ', 'Cùng một việc, kết quả khác nhau', 'Hai người hỏi AI cùng một việc nhưng nhận kết quả rất khác nhau.', ['Vì sao cùng một câu hỏi lại ra kết quả khác nhau?', 'Mình nên quan sát gì khi AI trả lời tệ?']],
  ['Nội dung bài học', '8 phần chính của ngày 4', 'Prompt fundamentals, advanced prompting, system prompt, context engineering, tool calling và lab.', ['Ngày 4 có những phần học nào?', 'Phần nào liên quan trực tiếp tới lab cuối buổi?']],
  ['Mục Tiêu Ngày 4', 'Role · Task · Context · Format', 'Viết prompt rõ ràng, chọn kỹ thuật prompting đúng lúc, viết system prompt và hiểu vòng lặp tool calling.', ['4 thành phần của prompt tốt là gì?', 'Tool calling là interface giữa model và thế giới ngoài như thế nào?']],
  ['Deliverable Cuối Ngày', 'Agent script · tools · tests', 'Cần nộp agent chạy được, system prompt, tool schemas, test questions và ghi chú lỗi.', ['Cuối ngày cần nộp những gì?', 'Vì sao phải có test questions cho agent?']],
  ['Prompt Engineering Fundamentals', 'Prompt tạo hành vi ổn định', 'Prompt tốt không phải prompt hay, mà là prompt tạo ra hành vi mong muốn ổn định.', ['Prompt tốt được đánh giá theo tiêu chí nào?', 'Vì sao “hay” chưa đủ để gọi là prompt tốt?']],
  ['Prompt = Interface', 'Ý định người dùng và khả năng model', 'Prompt kém mơ hồ; prompt tốt rõ task, context, constraint và format.', ['Specificity beats cleverness nghĩa là gì?', 'Prompt kém thiếu những thông tin nào?']],
  ['4 Thành Phần Của Prompt Tốt', 'Role · Task · Context · Format', 'Bắt đầu với Task + Format, chỉ thêm Role hoặc Context khi thật sự cải thiện chất lượng.', ['Khi nào cần thêm Role vào prompt?', 'Vì sao nên bắt đầu bằng Task và Format?']],
  ['Instruction vs Conversation vs System Prompt', 'Chọn loại prompt theo mục đích', 'Instruction cho tác vụ một lượt, conversation giữ ngữ cảnh, system prompt đặt policy và boundary.', ['Instruction prompt khác system prompt thế nào?', 'Khi nào cần conversation prompt?']],
  ['Token Budget Awareness', 'Prompt dài chưa chắc tốt hơn', 'Token thừa làm tăng chi phí, latency và nhiễu; ưu tiên instruction rõ, example đúng chỗ, output contract rõ.', ['Vì sao prompt dài có thể làm tệ hơn?', 'Nên ưu tiên gì khi tối ưu token budget?']],
  ['Advanced Prompting Techniques', 'Dùng kỹ thuật khi có ích thật', 'Các kỹ thuật nâng cao chỉ nên dùng khi cải thiện chất lượng thật sự.', ['Khi nào nên dùng kỹ thuật prompting nâng cao?', 'Vì sao không nên dùng như thần chú?']],
  ['Zero-shot, One-shot, Few-shot, CoT', 'Thử đơn giản trước', 'Thứ tự thực dụng: zero-shot rồi few-shot, decomposition hoặc CoT khi cần reasoning.', ['Zero-shot và few-shot khác nhau thế nào?', 'Khi nào CoT thật sự hữu ích?']],
  ['Khi Nào Dùng Few-shot?', 'Giữ format và tiêu chuẩn ổn định', 'Few-shot giúp model bám pattern khi format, tone hoặc tiêu chuẩn đánh giá chưa ổn định.', ['Few-shot giải quyết lỗi gì?', 'Ví dụ mẫu nên được chọn như thế nào?']],
  ['Few-shot Prompting — Python Example', 'Ví dụ phân loại sentiment', 'Dùng vài ví dụ input/output để model giữ đúng nhãn và format mong muốn.', ['Ví dụ few-shot này dạy model điều gì?', 'Nếu thiếu example thì output có thể lệch ra sao?']],
  ['Chain-of-Thought và Tree-of-Thought', 'Reasoning nhiều bước', 'CoT phù hợp cho bài toán cần suy luận, còn Tree-of-Thought dùng khi cần explore nhiều hướng.', ['Khi nào CoT là overkill?', 'Tree-of-Thought khác CoT ở điểm nào?']],
  ['System Prompt Engineering', 'Agent nhất quán và dễ test', 'System prompt tốt giúp agent predictable hơn, rõ boundary hơn và dễ kiểm thử hơn.', ['System prompt tốt giúp agent ở điểm nào?', 'Vì sao system prompt cần dễ test?']],
  ['Anatomy của System Prompt Production-grade', 'Persona · Rules · Capabilities · Constraints · Output', 'System prompt production-grade cần vai trò, rules, capabilities, constraints và output format rõ.', ['System prompt production-grade gồm những phần nào?', 'Constraints khác rules như thế nào?']],
  ['System Prompt — Python Example', 'Support triage agent', 'Ví dụ system prompt quy định tiếng Việt, độ ngắn gọn, boundary refund và output JSON.', ['Prompt ví dụ này đặt boundary gì?', 'Vì sao output JSON giúp kiểm soát agent?']],
  ['System Prompt Anti-Patterns', 'Quá dài · mâu thuẫn · mơ hồ', 'Các lỗi phổ biến: prompt quá dài, rule mâu thuẫn, yêu cầu mơ hồ và không test edge cases.', ['Anti-pattern nào dễ làm agent sai nhất?', 'Làm sao phát hiện system prompt mâu thuẫn?']],
  ['Context Engineering', 'Chọn đúng context cần thiết', 'Quan trọng không phải nhét nhiều context, mà là chọn đúng context cho task.', ['Context engineering khác prompt engineering thế nào?', 'Vì sao không nên dump toàn bộ context?']],
  ['Context Window Management', 'System · history · input · tools · output', 'Cần phân bổ token chủ động giữa policy, history, current input, tool schemas và output buffer.', ['Context window gồm những rổ nào?', 'Điều gì xảy ra nếu history ăn hết token?']],
  ['Memory Injection và Context Compression', 'Đưa đúng facts vào task hiện tại', 'Memory chỉ nên đưa facts cần thiết; compression giúp giảm nhiễu và giữ context hữu ích.', ['Memory injection nên chọn thông tin nào?', 'Context compression giúp gì cho tutor nhiều lượt?']],
  ['Token Budget Allocation', 'Nghĩ theo các rổ token', 'System prompt, history, tool schemas và output buffer đều cạnh tranh token budget.', ['Tool schema dài gây rủi ro gì?', 'Output buffer quá nhỏ sẽ gây lỗi gì?']],
  ['Tool Calling', 'Từ nói sang tương tác', 'Tool calling giúp agent chuyển từ trả lời văn bản sang tương tác với thế giới thực.', ['Tool calling giải quyết giới hạn nào của LLM?', 'Vì sao model không tự chạy API ngoài?']],
  ['Tool Calling Flow', 'Model quyết định, app thực thi', 'LLM tạo tool_call JSON; app chạy tool; kết quả quay lại model để trả lời cuối.', ['Vòng lặp tool calling gồm những bước nào?', 'Ứng dụng chịu trách nhiệm gì trong tool calling?']],
  ['Tool Schema Anatomy', 'Name · Description · Parameters · Required', 'Tool schema cần tên rõ, mô tả đúng lúc dùng, tham số JSON Schema và required fields.', ['Description ảnh hưởng việc chọn tool thế nào?', 'Required fields giúp model ra sao?']],
  ['Tool Schema — Python Example', 'Weather tool JSON schema', 'Ví dụ khai báo get_weather với name, description và parameters cho city.', ['Schema ví dụ này mô tả input thế nào?', 'Vì sao tên tool nên là động từ rõ nghĩa?']],
  ['Design Principles Cho Tools', 'Tool là software interface', 'Tool tốt là interface rõ ràng, không phải prompt trang trí.', ['Tool tốt giống software interface ở điểm nào?', 'Vì sao tool không chỉ là phần trang trí prompt?']],
  ['4 Nguyên Tắc Thiết Kế Tool', 'Single responsibility · idempotency · explicit errors', 'Tool nên làm một việc rõ, có side effect kiểm soát và trả lỗi dễ hiểu.', ['Single responsibility giúp model chọn tool thế nào?', 'Idempotency quan trọng khi retry ra sao?']],
  ['Tool Granularity', 'Quá nhỏ hay quá to đều có giá', 'Tool quá nhỏ tạo nhiều calls; tool quá to làm boundary mơ hồ.', ['Khi nào tool quá nhỏ gây overhead?', 'Tool quá to làm model nhầm boundary thế nào?']],
  ['Parallel Tool Calling & Patterns', 'Nhanh hơn cần flow rõ', 'Song song chỉ tốt khi flow control và merge logic rõ ràng.', ['Khi nào parallel tool calls là hợp lý?', 'Vì sao nhanh hơn chưa chắc tốt hơn?']],
  ['Sequential vs Parallel Tool Calls', 'Phụ thuộc dữ liệu quyết định thứ tự', 'Sequential khi tool B cần output tool A; parallel khi các tool độc lập.', ['Ví dụ nào cần gọi tool tuần tự?', 'Làm sao biết có thể gọi song song?']],
  ['3 Tool Use Patterns Thường Gặp', 'Conditional · chaining · parallel merge', 'Tool calling là bài toán control flow: khi nào gọi, gọi gì, thứ tự nào và xử lý fail ra sao.', ['Ba pattern tool use thường gặp là gì?', 'Tool fail thì agent cần kiểm soát gì?']],
  ['Minimal Tool Loop — Python Example', 'Vòng lặp gọi function', 'Ví dụ agent loop nhận function_call, chạy tool, append output rồi gọi model lần nữa.', ['Minimal tool loop xử lý function_call ra sao?', 'Vì sao phải gửi tool result lại cho model?']],
  ['Thực Hành', 'Lab 4 agent với tools và tests', 'Lab xây agent đầu tiên với system prompt, 2 tools và 5 test cases.', ['Lab 4 cần build những thành phần nào?', 'Test cases kiểm tra hành vi agent ra sao?']],
  ['Hands-on 4: Cách Chạy Lab', '5 bước thực hành', 'Viết system prompt, tạo custom tools, nối agent loop, chạy test và ghi lỗi.', ['5 bước chạy lab là gì?', 'Lỗi cần ghi lại thuộc những nhóm nào?']],
  ['Lab Skeleton — Python Example', 'Khung agent loop', 'Skeleton đọc system prompt, nạp tools, nhận user input, gọi model và xử lý tool calls.', ['Skeleton agent loop gồm những biến chính nào?', 'handle_tool_calls có vai trò gì?']],
  ['Lab #4', 'Build ReAct agent', 'Mục tiêu là build ReAct agent với 2 custom tools, system prompt chuẩn và test end-to-end.', ['ReAct agent trong lab cần chứng minh điều gì?', 'Deliverable của Lab #4 gồm những gì?']],
  ['Tổng kết — Key Takeaways', 'Prompt · system prompt · tool schema · parallel calls', 'Những ý chính: prompt là interface, system prompt đặt boundary, tool schema quyết định tool use, parallel cần phụ thuộc rõ.', ['4 key takeaways của ngày học là gì?', 'Ý nào quan trọng nhất khi build agent thật?']],
  ['Tiếp theo & Bài tập', 'Hoàn thiện lab và chuẩn bị ngày sau', 'Hoàn thiện Lab 4 với test pass/fail và chuẩn bị sang AI Product Thinking & Requirements.', ['Bài tập sau buổi học là gì?', 'Ngày tiếp theo sẽ chuyển sang chủ đề nào?']],
  ['Tài Liệu Tham Khảo', 'Prompting và tool use docs', 'Nguồn tham khảo gồm Anthropic prompting, OpenAI function calling, CoT paper và LangGraph docs.', ['Tài liệu nào nên đọc về function calling?', 'Nguồn nào liên quan đến Chain-of-Thought?']],
  ['Hỏi & Đáp', 'Prompt hay tool contract?', 'Câu hỏi gợi mở: lỗi đến từ model chưa hiểu ý hay từ tool contract chưa rõ?', ['Làm sao phân biệt lỗi prompt và lỗi tool contract?', 'Khi debug agent nên hỏi câu gì trước?']],
  ['Cảm ơn', 'Thông tin liên hệ và tài liệu', 'Slide kết thúc với email, GitHub tài liệu và lab template.', ['Link tài liệu và lab template nằm ở đâu?', 'Sau bài này nên ôn lại phần nào?']]
];

export const slides = slideOutline.map(([title, short, desc, prompts], index) => ({
  title,
  short,
  time: '01:00',
  refs: [`T04-${String(index + 1).padStart(3, '0')}`],
  kicker: 'PROMPT ENGINEERING · TOOL CALLING',
  heading: title,
  desc,
  type: index % 5 === 0 ? 'hero' : index % 3 === 0 ? 'cards' : 'flow',
  prompts
}));

export const sources = {
  'T01-001': {
    title: 'Day 2 · Xác định bài toán kinh doanh',
    score: '96%',
    text: 'Một kỹ năng quan trọng là khả năng xác định ra một bài toán từ một yêu cầu rất mơ hồ, sau đó bóc tách nó ra để team phát triển.'
  },
  'T01-004': {
    title: 'Day 2 · Xác định bài toán kinh doanh',
    score: '98%',
    text: 'Công nghệ sinh ra để giải quyết một vấn đề. Đầu tiên phải biết vấn đề là gì, sau đấy công nghệ mới là công cụ để giải nó.'
  },
  'T01-005': {
    title: 'Day 2 · Xác định bài toán kinh doanh',
    score: '92%',
    text: 'Từ mục tiêu, yêu cầu mơ hồ, biến nó thành thứ cụ thể có thể triển khai được trong thời gian ngắn và ra được kết quả.'
  },
  'T02-032': {
    title: 'Day 2 · Chọn mức độ tự động hoá',
    score: '97%',
    text: 'Automation nghĩa là để máy tự động làm. Augmentation là vẫn cần con người, AI chỉ giúp tăng cường công việc. Đây là một phổ với mức tự động tăng dần.'
  },
  'T02-033': {
    title: 'Day 2 · Chọn mức độ tự động hoá',
    score: '95%',
    text: 'Thường người ta sẽ bắt đầu với augmentation trước, luôn có con người giám sát, sau đấy mới tăng dần mức độ automate.'
  },
  'T02-034': {
    title: 'Day 2 · Impact và hậu quả',
    score: '91%',
    text: 'Nếu công việc sai có thể gây hậu quả nghiêm trọng, nó cần nằm gần phía augmentation và hỗ trợ con người hơn là automate.'
  },
  'T02-024': {
    title: 'Day 2 · Đo lường sản phẩm',
    score: '96%',
    text: 'Một sản phẩm học tập hướng đến tăng hiệu quả học tập. Team cần thiết kế metric như điểm quiz cao hơn hoặc khả năng làm bài tốt hơn.'
  },
  'T02-025': {
    title: 'Day 2 · North Star Metric',
    score: '94%',
    text: 'North Star Metric là chỉ số quan trọng, value cuối cùng mà sản phẩm hướng tới. Các chỉ số bên dưới là bậc thang giả thuyết dẫn đến nó.'
  },
  'T02-036': {
    title: 'Day 2 · Ba cấp độ kỹ thuật',
    score: '93%',
    text: 'Những gì có thể viết thành quy tắc rõ ràng thì đưa vào code, không cần AI. Luôn đi từ những cái đơn giản trở lên trước.'
  },
  'T02-037': {
    title: 'Day 2 · Workflow và Agent',
    score: '92%',
    text: 'Workflow có thể chia thành các bước lớn, có LLM hỗ trợ và những gate kiểm tra giữa các bước. Ba mô hình cơ bản đã xử lý được nhiều nhu cầu.'
  }
};

export const quizBank = [
  {
    slide: 0,
    q: 'Khi bắt đầu xây dựng sản phẩm AI, điều gì cần được xác định trước?',
    o: ['Model AI sẽ sử dụng', 'Vấn đề cụ thể cần giải quyết', 'Chi phí API', 'Số lượng agent'],
    a: 1,
    e: 'Công nghệ là công cụ; vấn đề và người dùng phải được xác định trước.',
    ref: 'T01-004'
  },
  {
    slide: 0,
    q: 'Kỹ năng nào quan trọng khi nhận một yêu cầu rất mơ hồ?',
    o: ['Chọn model lớn nhất', 'Bóc tách thành bài toán cụ thể', 'Tự động hoá toàn bộ', 'Bỏ qua stakeholder'],
    a: 1,
    e: 'Cần biến yêu cầu mơ hồ thành một bài toán cụ thể có thể triển khai.',
    ref: 'T01-001'
  },
  {
    slide: 1,
    q: 'Một bài toán sản phẩm tốt cần làm rõ điều gì?',
    o: ['User, pain và impact', 'Model, token và API', 'Logo, màu sắc và tên', 'Chỉ thời gian triển khai'],
    a: 0,
    e: 'Cần hiểu ai gặp vấn đề, vướng ở đâu và hậu quả hay tác động là gì.',
    ref: 'T01-005'
  },
  {
    slide: 2,
    q: 'Khác biệt cốt lõi giữa Automation và Augmentation là gì?',
    o: ['Loại model sử dụng', 'Mức độ con người tham gia', 'Ngôn ngữ lập trình', 'Số lượng dữ liệu'],
    a: 1,
    e: 'Hai khái niệm khác nhau ở mức độ máy làm thay và con người còn tham gia quyết định.',
    ref: 'T02-032'
  },
  {
    slide: 2,
    q: 'Tình huống nào phù hợp hơn với Augmentation?',
    o: ['Đổi tên file theo quy tắc', 'AI gợi ý phản hồi để giảng viên duyệt', 'Tính tổng bảng số liệu', 'Gửi lịch cố định'],
    a: 1,
    e: 'Phản hồi học tập cần phán đoán và có hậu quả nếu sai, nên con người cần duyệt.',
    ref: 'T02-034'
  },
  {
    slide: 3,
    q: 'Lộ trình triển khai AI an toàn được khuyến nghị là gì?',
    o: ['Automation 100% ngay', 'Bắt đầu với Augmentation rồi tăng dần', 'Không cần đo lường', 'Để AI tự quyết định'],
    a: 1,
    e: 'Nên giữ con người giám sát ở giai đoạn đầu, quan sát và tăng tự động hoá dần.',
    ref: 'T02-033'
  },
  {
    slide: 4,
    q: 'North Star Metric phù hợp cho sản phẩm học tập là gì?',
    o: ['Số phút mở app', 'Số thông báo gửi đi', 'Mức cải thiện kết quả học tập', 'Số lần đăng nhập'],
    a: 2,
    e: 'Chỉ số đích cần phản ánh hiệu quả học tập thay vì chỉ hành vi sử dụng.',
    ref: 'T02-024'
  },
  {
    slide: 4,
    q: 'Vai trò của các chỉ số trung gian là gì?',
    o: ['Thay thế hoàn toàn chỉ số đích', 'Tạo bậc thang giả thuyết dẫn đến giá trị cuối', 'Chỉ dùng để báo cáo marketing', 'Không có vai trò'],
    a: 1,
    e: 'Chúng là các giả thuyết nối dần hành vi với North Star Metric.',
    ref: 'T02-025'
  },
  {
    slide: 5,
    q: 'Khi một bài toán có thể viết thành quy tắc rõ ràng, nên ưu tiên gì?',
    o: ['Multi-agent', 'Rule-based', 'Fine-tuning', 'Model lớn nhất'],
    a: 1,
    e: 'Giải pháp rule-based đơn giản, an toàn và dễ kiểm soát hơn khi quy tắc đã rõ.',
    ref: 'T02-036'
  },
  {
    slide: 5,
    q: 'Workflow AI có đặc điểm nào?',
    o: ['Không có bước xác định', 'Chia thành các bước và có gate kiểm tra', 'Luôn tự quyết định mọi task', 'Không dùng LLM'],
    a: 1,
    e: 'Workflow chia bài toán thành các bước lớn, có LLM và các gate kiểm tra.',
    ref: 'T02-037'
  }
];

export function findAnswer(q, currentSlideIndex = 0) {
  const l = q.toLowerCase();
  let text, refs;

  if (l.includes('automation') || l.includes('augmentation') || l.includes('giám sát')) {
    text = '<p><strong>Automation</strong> là AI làm thay, còn <strong>Augmentation</strong> là AI hỗ trợ trong khi con người vẫn quyết định.</p><p>Giảng viên khuyến nghị bắt đầu với Augmentation, theo dõi chất lượng rồi mới tăng dần mức tự động hoá—đặc biệt khi hậu quả của lỗi cao.</p>';
    refs = ['T02-032', 'T02-033'];
  } else if (l.includes('north star') || l.includes('lượt truy cập') || l.includes('đo lường')) {
    text = '<p>North Star Metric là chỉ số phản ánh <strong>giá trị cuối cùng</strong> sản phẩm tạo ra. Với sản phẩm học tập, đó nên là kết quả học tập tốt hơn.</p><p>Lượt truy cập hay thời gian sử dụng chỉ là chỉ số trung gian và chưa tự chứng minh người học tiến bộ.</p>';
    refs = ['T02-024', 'T02-025'];
  } else if (l.includes('rule') || l.includes('workflow') || l.includes('agent')) {
    text = '<p>Nếu bài toán có quy tắc rõ, hãy ưu tiên <strong>rule-based</strong>. Khi cần nhiều bước có LLM và gate kiểm tra, dùng workflow. Agent chỉ nên đến sau khi cách đơn giản chạm trần.</p>';
    refs = ['T02-036', 'T02-037'];
  } else if (l.includes('mơ hồ') || l.includes('bắt đầu') || l.includes('ba câu') || l.includes('ví dụ')) {
    text = '<p>Đừng bắt đầu từ câu “dùng AI nào”, mà hãy làm rõ <strong>ai đang gặp vấn đề, họ tắc ở bước nào và hậu quả là gì</strong>.</p><p>Ví dụ: thay vì “làm chatbot AI”, hãy xác định “học viên đang xem lại slide cần tìm nhanh lời giải thích có nguồn để tiếp tục học”.</p>';
    refs = ['T01-001', 'T01-004', 'T01-005'];
  } else {
    const s = slides[currentSlideIndex] || slides[0];
    text = `<p>Mình tìm thấy nội dung gần nhất trong transcript của <strong>Slide ${currentSlideIndex + 1}</strong>: ${s.desc}</p><p>Bạn có thể hỏi cụ thể hơn để mình truy xuất đúng đoạn nguồn.</p>`;
    refs = s.refs;
  }
  return { text, refs };
}
