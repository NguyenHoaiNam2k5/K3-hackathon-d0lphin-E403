export const slides = [
  {
    title: 'Từ vấn đề đến sản phẩm AI',
    short: 'Vấn đề trước, công nghệ sau',
    time: '03:20',
    refs: ['T01-001', 'T01-004'],
    kicker: 'AI PRODUCT · FOUNDATION',
    heading: 'Đừng bắt đầu bằng AI.\nHãy bắt đầu bằng vấn đề.',
    desc: 'Công nghệ chỉ tạo ra giá trị khi nó giải quyết một vấn đề cụ thể cho một người dùng cụ thể.',
    type: 'hero',
    prompts: ['Tại sao không nên bắt đầu bằng AI?', 'Làm sao biến yêu cầu mơ hồ thành bài toán?']
  },
  {
    title: 'Ba câu hỏi trước khi build',
    short: 'User · Pain · Impact',
    time: '04:10',
    refs: ['T01-004', 'T01-005'],
    kicker: 'PROBLEM DISCOVERY',
    heading: 'Ba câu hỏi trước khi chọn giải pháp',
    desc: 'Một lát cắt tốt cần rõ người dùng, điểm đau và kết quả mong muốn.',
    type: 'cards',
    prompts: ['Ba câu hỏi này dùng như thế nào?', 'Cho mình một ví dụ thực tế']
  },
  {
    title: 'Automation & Augmentation',
    short: 'Chọn mức độ tự động hoá',
    time: '05:05',
    refs: ['T02-032', 'T02-033'],
    kicker: 'AI SOLUTION DESIGN',
    heading: 'Automation hay Augmentation?',
    desc: 'Không phải hai thái cực—đây là một phổ về mức độ con người tham gia.',
    type: 'compare',
    prompts: ['Automation khác Augmentation thế nào?', 'Khi nào cần con người giám sát?']
  },
  {
    title: 'Lộ trình triển khai an toàn',
    short: 'Tăng dần mức tự động',
    time: '03:45',
    refs: ['T02-033', 'T02-034'],
    kicker: 'SAFE AI ADOPTION',
    heading: 'Bắt đầu nhỏ. Đo lường. Tăng dần.',
    desc: 'Đi từ augmentation đến automation khi dữ liệu cho thấy hệ thống đã đủ tin cậy.',
    type: 'flow',
    prompts: ['Vì sao cần bắt đầu với Augmentation?', 'Hậu quả khi AI sai ảnh hưởng ra sao?']
  },
  {
    title: 'Đo lường giá trị học tập',
    short: 'North Star Metric',
    time: '04:25',
    refs: ['T02-024', 'T02-025'],
    kicker: 'PRODUCT METRICS',
    heading: 'Đo kết quả, không chỉ đo lượt dùng',
    desc: 'North Star Metric của sản phẩm học tập phải phản ánh hiệu quả học tập thực sự.',
    type: 'cards',
    prompts: ['North Star Metric là gì?', 'Tại sao lượt truy cập chưa đủ?']
  },
  {
    title: 'Từ Rule đến Agent',
    short: 'Chọn độ phức tạp phù hợp',
    time: '03:15',
    refs: ['T02-036', 'T02-037'],
    kicker: 'TECHNICAL APPROACH',
    heading: 'Chọn giải pháp đơn giản nhất có thể',
    desc: 'Rule-based → Workflow → Agent. Chỉ tăng độ phức tạp khi cách đơn giản đã chạm trần.',
    type: 'flow',
    prompts: ['Khi nào chỉ cần rule-based?', 'Workflow khác Agent như thế nào?']
  }
];

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
