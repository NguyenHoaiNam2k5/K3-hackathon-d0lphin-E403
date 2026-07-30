import { slides } from '../data/slidesData';

/**
 * Service to handle RAG-like answer finding from transcripts.
 */
export const ragService = {
  findAnswer(question, currentSlideIndex = 0) {
    const qLower = question.toLowerCase();
    let text;
    let refs;

    if (qLower.includes('automation') || qLower.includes('augmentation') || qLower.includes('giám sát')) {
      text = '<p><strong>Automation</strong> là AI làm thay, còn <strong>Augmentation</strong> là AI hỗ trợ trong khi con người vẫn quyết định.</p><p>Giảng viên khuyến nghị bắt đầu với Augmentation, theo dõi chất lượng rồi mới tăng dần mức tự động hoá—đặc biệt khi hậu quả của lỗi cao.</p>';
      refs = ['T02-032', 'T02-033'];
    } else if (qLower.includes('north star') || qLower.includes('lượt truy cập') || qLower.includes('đo lường')) {
      text = '<p>North Star Metric là chỉ số phản ánh <strong>giá trị cuối cùng</strong> sản phẩm tạo ra. Với sản phẩm học tập, đó nên là kết quả học tập tốt hơn.</p><p>Lượt truy cập hay thời gian sử dụng chỉ là chỉ số trung gian và chưa tự chứng minh người học tiến bộ.</p>';
      refs = ['T02-024', 'T02-025'];
    } else if (qLower.includes('rule') || qLower.includes('workflow') || qLower.includes('agent')) {
      text = '<p>Nếu bài toán có quy tắc rõ, hãy ưu tiên <strong>rule-based</strong>. Khi cần nhiều bước có LLM và gate kiểm tra, dùng workflow. Agent chỉ nên đến sau khi cách đơn giản chạm trần.</p>';
      refs = ['T02-036', 'T02-037'];
    } else if (qLower.includes('mơ hồ') || qLower.includes('bắt đầu') || qLower.includes('ba câu') || qLower.includes('ví dụ')) {
      text = '<p>Đừng bắt đầu từ câu “dùng AI nào”, mà hãy làm rõ <strong>ai đang gặp vấn đề, họ tắc ở bước nào và hậu quả là gì</strong>.</p><p>Ví dụ: thay vì “làm chatbot AI”, hãy xác định “học viên đang xem lại slide cần tìm nhanh lời giải thích có nguồn để tiếp tục học”.</p>';
      refs = ['T01-001', 'T01-004', 'T01-005'];
    } else {
      const slide = slides[currentSlideIndex] || slides[0];
      text = `<p>Mình tìm thấy nội dung gần nhất trong transcript của <strong>Slide ${currentSlideIndex + 1}</strong>: ${slide.desc}</p><p>Bạn có thể hỏi cụ thể hơn để mình truy xuất đúng đoạn nguồn.</p>`;
      refs = slide.refs;
    }

    return { text, refs };
  }
};
