/**
 * VLEARN LESSON REVIEW ENGINE
 * Tích hợp PDF.js Rendering & RAG Chat System
 */

// --- CẤU HÌNH PDF.JS ---
const pdfjsLib = window['pdfjs-dist/build/pdf'];
// Đường dẫn worker (bắt buộc để PDF.js hoạt động mượt mà)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const slides = [
  { title:'Từ vấn đề đến sản phẩm AI', short:'Vấn đề trước, công nghệ sau', time:'03:20', refs:['T01-001','T01-004'], kicker:'AI PRODUCT · FOUNDATION', heading:'Đừng bắt đầu bằng AI.\nHãy bắt đầu bằng vấn đề.', desc:'Công nghệ chỉ tạo ra giá trị khi nó giải quyết một vấn đề cụ thể cho một người dùng cụ thể.', type:'hero', prompts:['Tại sao không nên bắt đầu bằng AI?','Làm sao biến yêu cầu mơ hồ thành bài toán?'] },
  { title:'Ba câu hỏi trước khi build', short:'User · Pain · Impact', time:'04:10', refs:['T01-004','T01-005'], kicker:'PROBLEM DISCOVERY', heading:'Ba câu hỏi trước khi chọn giải pháp', desc:'Một lát cắt tốt cần rõ người dùng, điểm đau và kết quả mong muốn.', type:'cards', prompts:['Ba câu hỏi này dùng như thế nào?','Cho mình một ví dụ thực tế'] },
  { title:'Automation & Augmentation', short:'Chọn mức độ tự động hoá', time:'05:05', refs:['T02-032','T02-033'], kicker:'AI SOLUTION DESIGN', heading:'Automation hay Augmentation?', desc:'Không phải hai thái cực—đây là một phổ về mức độ con người tham gia.', type:'compare', prompts:['Automation khác Augmentation thế nào?','Khi nào cần con người giám sát?'] },
  { title:'Lộ trình triển khai an toàn', short:'Tăng dần mức tự động', time:'03:45', refs:['T02-033','T02-034'], kicker:'SAFE AI ADOPTION', heading:'Bắt đầu nhỏ. Đo lường. Tăng dần.', desc:'Đi từ augmentation đến automation khi dữ liệu cho thấy hệ thống đã đủ tin cậy.', type:'flow', prompts:['Vì sao cần bắt đầu với Augmentation?','Hậu quả khi AI sai ảnh hưởng ra sao?'] },
  { title:'Đo lường giá trị học tập', short:'North Star Metric', time:'04:25', refs:['T02-024','T02-025'], kicker:'PRODUCT METRICS', heading:'Đo kết quả, không chỉ đo lượt dùng', desc:'North Star Metric của sản phẩm học tập phải phản ánh hiệu quả học tập thực sự.', type:'cards', prompts:['North Star Metric là gì?','Tại sao lượt truy cập chưa đủ?'] },
  { title:'Từ Rule đến Agent', short:'Chọn độ phức tạp phù hợp', time:'03:15', refs:['T02-036','T02-037'], kicker:'TECHNICAL APPROACH', heading:'Chọn giải pháp đơn giản nhất có thể', desc:'Rule-based → Workflow → Agent. Chỉ tăng độ phức tạp khi cách đơn giản đã chạm trần.', type:'flow', prompts:['Khi nào chỉ cần rule-based?','Workflow khác Agent như thế nào?'] }
];

const sources = {
  'T01-001':{title:'Day 2 · Xác định bài toán kinh doanh',score:'96%',text:'Một kỹ năng quan trọng là khả năng xác định ra một bài toán từ một yêu cầu rất mơ hồ, sau đó bóc tách nó ra để team phát triển.'},
  'T01-004':{title:'Day 2 · Xác định bài toán kinh doanh',score:'98%',text:'Công nghệ sinh ra để giải quyết một vấn đề. Đầu tiên phải biết vấn đề là gì, sau đấy công nghệ mới là công cụ để giải nó.'},
  'T01-005':{title:'Day 2 · Xác định bài toán kinh doanh',score:'92%',text:'Từ mục tiêu, yêu cầu mơ hồ, biến nó thành thứ cụ thể có thể triển khai được trong thời gian ngắn và ra được kết quả.'},
  'T02-032':{title:'Day 2 · Chọn mức độ tự động hoá',score:'97%',text:'Automation nghĩa là để máy tự động làm. Augmentation là vẫn cần con người, AI chỉ giúp tăng cường công việc. Đây là một phổ với mức tự động tăng dần.'},
  'T02-033':{title:'Day 2 · Chọn mức độ tự động hoá',score:'95%',text:'Thường người ta sẽ bắt đầu với augmentation trước, luôn có con người giám sát, sau đấy mới tăng dần mức độ automate.'},
  'T02-034':{title:'Day 2 · Impact và hậu quả',score:'91%',text:'Nếu công việc sai có thể gây hậu quả nghiêm trọng, nó cần nằm gần phía augmentation và hỗ trợ con người hơn là automate.'},
  'T02-024':{title:'Day 2 · Đo lường sản phẩm',score:'96%',text:'Một sản phẩm học tập hướng đến tăng hiệu quả học tập. Team cần thiết kế metric như điểm quiz cao hơn hoặc khả năng làm bài tốt hơn.'},
  'T02-025':{title:'Day 2 · North Star Metric',score:'94%',text:'North Star Metric là chỉ số quan trọng, value cuối cùng mà sản phẩm hướng tới. Các chỉ số bên dưới là bậc thang giả thuyết dẫn đến nó.'},
  'T02-036':{title:'Day 2 · Ba cấp độ kỹ thuật',score:'93%',text:'Những gì có thể viết thành quy tắc rõ ràng thì đưa vào code, không cần AI. Luôn đi từ những cái đơn giản trở lên trước.'},
  'T02-037':{title:'Day 2 · Workflow và Agent',score:'92%',text:'Workflow có thể chia thành các bước lớn, có LLM hỗ trợ và những gate kiểm tra giữa các bước. Ba mô hình cơ bản đã xử lý được nhiều nhu cầu.'}
};

const quizBank = [
  {slide:0,q:'Khi bắt đầu xây dựng sản phẩm AI, điều gì cần được xác định trước?',o:['Model AI sẽ sử dụng','Vấn đề cụ thể cần giải quyết','Chi phí API','Số lượng agent'],a:1,e:'Công nghệ là công cụ; vấn đề và người dùng phải được xác định trước.',ref:'T01-004'},
  {slide:0,q:'Kỹ năng nào quan trọng khi nhận một yêu cầu rất mơ hồ?',o:['Chọn model lớn nhất','Bóc tách thành bài toán cụ thể','Tự động hoá toàn bộ','Bỏ qua stakeholder'],a:1,e:'Cần biến yêu cầu mơ hồ thành một bài toán cụ thể có thể triển khai.',ref:'T01-001'},
  {slide:1,q:'Một bài toán sản phẩm tốt cần làm rõ điều gì?',o:['User, pain và impact','Model, token và API','Logo, màu sắc và tên','Chỉ thời gian triển khai'],a:0,e:'Cần hiểu ai gặp vấn đề, vướng ở đâu và hậu quả hay tác động là gì.',ref:'T01-005'},
  {slide:2,q:'Khác biệt cốt lõi giữa Automation và Augmentation là gì?',o:['Loại model sử dụng','Mức độ con người tham gia','Ngôn ngữ lập trình','Số lượng dữ liệu'],a:1,e:'Hai khái niệm khác nhau ở mức độ máy làm thay và con người còn tham gia quyết định.',ref:'T02-032'},
  {slide:2,q:'Tình huống nào phù hợp hơn với Augmentation?',o:['Đổi tên file theo quy tắc','AI gợi ý phản hồi để giảng viên duyệt','Tính tổng bảng số liệu','Gửi lịch cố định'],a:1,e:'Phản hồi học tập cần phán đoán và có hậu quả nếu sai, nên con người cần duyệt.',ref:'T02-034'},
  {slide:3,q:'Lộ trình triển khai AI an toàn được khuyến nghị là gì?',o:['Automation 100% ngay','Bắt đầu với Augmentation rồi tăng dần','Không cần đo lường','Để AI tự quyết định'],a:1,e:'Nên giữ con người giám sát ở giai đoạn đầu, quan sát và tăng tự động hoá dần.',ref:'T02-033'},
  {slide:4,q:'North Star Metric phù hợp cho sản phẩm học tập là gì?',o:['Số phút mở app','Số thông báo gửi đi','Mức cải thiện kết quả học tập','Số lần đăng nhập'],a:2,e:'Chỉ số đích cần phản ánh hiệu quả học tập thay vì chỉ hành vi sử dụng.',ref:'T02-024'},
  {slide:4,q:'Vai trò của các chỉ số trung gian là gì?',o:['Thay thế hoàn toàn chỉ số đích','Tạo bậc thang giả thuyết dẫn đến giá trị cuối','Chỉ dùng để báo cáo marketing','Không có vai trò'],a:1,e:'Chúng là các giả thuyết nối dần hành vi với North Star Metric.',ref:'T02-025'},
  {slide:5,q:'Khi một bài toán có thể viết thành quy tắc rõ ràng, nên ưu tiên gì?',o:['Multi-agent','Rule-based','Fine-tuning','Model lớn nhất'],a:1,e:'Giải pháp rule-based đơn giản, an toàn và dễ kiểm soát hơn khi quy tắc đã rõ.',ref:'T02-036'},
  {slide:5,q:'Workflow AI có đặc điểm nào?',o:['Không có bước xác định','Chia thành các bước và có gate kiểm tra','Luôn tự quyết định mọi task','Không dùng LLM'],a:1,e:'Workflow chia bài toán thành các bước lớn, có LLM và các gate kiểm tra.',ref:'T02-037'}
];

// --- TRẠNG THÁI ỨNG DỤNG ---
let currentSlide = 0;
let viewed = new Set([0]);
let chatAll = false;
let pdfDoc = null;
let quiz = { scope: 'slide', count: 3, items: [], index: 0, selected: null, checked: false, score: 0 };

const $ = s => document.querySelector(s);
const esc = s => { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; };

/**
 * KHỞI TẠO FILE PDF
 */
async function initPDF() {
  const url = 'sliders.pdf'; // File PDF cùng thư mục
  try {
    const loadingTask = pdfjsLib.getDocument(url);
    pdfDoc = await loadingTask.promise;
    console.log(`PDF Loaded: ${pdfDoc.numPages} pages.`);
    renderSlide();
  } catch (err) {
    console.error("Error loading PDF: ", err);
    $('#slideCanvas').innerHTML = `<p style="padding:20px; color:red;">Không tìm thấy file sliders.pdf trong thư mục. Vui lòng kiểm tra lại.</p>`;
  }
}

/**
 * RENDER TRANG PDF LÊN CANVAS
 */
async function renderSlide() {
  if (!pdfDoc) return;

  const pageNumber = currentSlide + 1; // PDF.js dùng index từ 1
  const page = await pdfDoc.getPage(pageNumber);
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  // Điều chỉnh tỷ lệ hiển thị (scale 1.5 - 2.0 cho nét)
  const viewport = page.getViewport({ scale: 1.5 });
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  // Render vào vùng chứa
  const slideCanvas = $('#slideCanvas');
  // Clear previous content and append canvas
  slideCanvas.innerHTML = ''; 
  // ensure slide container is positioned for absolute overlays
  slideCanvas.style.position = 'relative';
  slideCanvas.appendChild(canvas);

  // Make canvas responsive (CSS) while keeping pixel buffer for rendering
  canvas.style.width = '100%';
  canvas.style.height = 'auto';

  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };

  await page.render(renderContext).promise;

  // --- Render selectable text layer so users can highlight text ---
  try {
    const textContent = await page.getTextContent();

    // remove any existing textLayer
    const existing = slideCanvas.querySelector('.textLayer');
    if (existing) existing.remove();

    const textLayerDiv = document.createElement('div');
    textLayerDiv.className = 'textLayer';
    // size in PDF pixels (matching canvas.width/height)
    textLayerDiv.style.position = 'absolute';
    textLayerDiv.style.left = '0';
    textLayerDiv.style.top = '0';
    textLayerDiv.style.width = canvas.width + 'px';
    textLayerDiv.style.height = canvas.height + 'px';
    textLayerDiv.style.transformOrigin = '0 0';

    slideCanvas.appendChild(textLayerDiv);

    // scale text layer to match displayed canvas size
    const scale = canvas.clientWidth / canvas.width || 1;
    textLayerDiv.style.transform = `scale(${scale})`;

    // Use PDF.js helper to render text layer (enhanced selection)
    pdfjsLib.renderTextLayer({
      textContent: textContent,
      container: textLayerDiv,
      viewport: viewport,
      enhanceTextSelection: true
    });
  } catch (e) {
    console.warn('Text layer render failed:', e);
  }

  // Cập nhật UI thông tin slide
  updateUI();
}

/**
 * CẬP NHẬT GIAO DIỆN PHỤ TRỢ (Metadata, Progress, Nav)
 */
function updateUI() {
  const s = slides[currentSlide];
  if (!s) return;

  // Cập nhật thanh tiêu đề và vị trí
  $('#slidePosition').textContent = `Slide ${currentSlide + 1} / ${pdfDoc.numPages}`;
  $('#slideSection').textContent = s.title;
  
  // Chat context & Transcript refs
  $('#contextSlide').textContent = chatAll ? 'Tất cả slides' : `Slide ${currentSlide + 1}`;
  $('#transcriptRef').textContent = `Nguồn: ${s.refs.join(' · ')}`;
  
  // Trạng thái nút bấm
  $('#prevSlide').disabled = currentSlide === 0;
  $('#nextSlide').disabled = currentSlide === pdfDoc.numPages - 1;
  
  // Thanh tiến trình
  const progressPercent = (viewed.size / pdfDoc.numPages) * 100;
  $('#lessonProgress').style.width = `${progressPercent}%`;
  $('#progressText').textContent = `${viewed.size}/${pdfDoc.numPages} slide đã xem`;
  
  $('#currentSlideScope').textContent = `Slide ${currentSlide + 1} · ${s.title}`;
  
  // Các chấm tròn (Dots)
  $('#slideDots').innerHTML = slides.map((_, i) => 
    `<button class="${i === currentSlide ? 'active' : ''}" onclick="goSlide(${i})" aria-label="Slide ${i + 1}"></button>`
  ).join('');

  renderNav();
  renderSuggestions();
}

/**
 * ĐIỀU HƯỚNG SLIDE
 */
function goSlide(i) {
  currentSlide = Math.max(0, Math.min(pdfDoc.numPages - 1, i));
  viewed.add(currentSlide);
  renderSlide();
  
  // Đóng sidebar nếu trên mobile
  if (window.innerWidth <= 750) {
    $('#slideNav').classList.remove('open');
    $('#backdrop').classList.remove('open');
  }
}

/**
 * RENDER DANH SÁCH SLIDE (SIDEBAR)
 */
function renderNav() {
  $('#slideList').innerHTML = slides.map((s, i) => `
    <button class="slide-thumb ${i === currentSlide ? 'active' : ''}" onclick="goSlide(${i})">
      <span class="thumb-number">${String(i + 1).padStart(2, '0')}</span>
      <span class="thumb-preview">${esc(s.short)}</span>
      <span class="thumb-copy"><strong>${esc(s.title)}</strong><small>${s.time}</small></span>
    </button>
  `).join('');
}

/**
 * GỢI Ý CÂU HỎI
 */
function renderSuggestions() {
  const p = slides[currentSlide].prompts;
  $('#suggestedQuestions').innerHTML = `<span>Gợi ý theo slide ${currentSlide + 1}</span>${p.map(x => `<button onclick="ask('${x}')">${x}</button>`).join('')}`;
}

/**
 * HỆ THỐNG TRẢ LỜI RAG (MOCKUP)
 */
function findAnswer(q) {
  const l = q.toLowerCase();
  let text, refs;
  
  if (l.includes('automation') || l.includes('augmentation') || l.includes('giám sát')) {
    text = '<p><strong>Automation</strong> là AI làm thay, còn <strong>Augmentation</strong> là AI hỗ trợ trong khi con người vẫn quyết định.</p><p>Giảng viên khuyến nghị bắt đầu với Augmentation, theo dõi chất lượng rồi mới tăng dần mức tự động hoá—đặc biệt khi hậu quả của lỗi cao.</p>';
    refs = ['T02-032', 'T02-033'];
  } 
  else if (l.includes('north star') || l.includes('lượt truy cập') || l.includes('đo lường')) {
    text = '<p>North Star Metric là chỉ số phản ánh <strong>giá trị cuối cùng</strong> sản phẩm tạo ra. Với sản phẩm học tập, đó nên là kết quả học tập tốt hơn.</p><p>Lượt truy cập hay thời gian sử dụng chỉ là chỉ số trung gian và chưa tự chứng minh người học tiến bộ.</p>';
    refs = ['T02-024', 'T02-025'];
  } 
  else if (l.includes('rule') || l.includes('workflow') || l.includes('agent')) {
    text = '<p>Nếu bài toán có quy tắc rõ, hãy ưu tiên <strong>rule-based</strong>. Khi cần nhiều bước có LLM và gate kiểm tra, dùng workflow. Agent chỉ nên đến sau khi cách đơn giản chạm trần.</p>';
    refs = ['T02-036', 'T02-037'];
  } 
  else if (l.includes('mơ hồ') || l.includes('bắt đầu') || l.includes('ba câu') || l.includes('ví dụ')) {
    text = '<p>Đừng bắt đầu từ câu “dùng AI nào”, mà hãy làm rõ <strong>ai đang gặp vấn đề, họ tắc ở bước nào và hậu quả là gì</strong>.</p><p>Ví dụ: thay vì “làm chatbot AI”, hãy xác định “học viên đang xem lại slide cần tìm nhanh lời giải thích có nguồn để tiếp tục học”.</p>';
    refs = ['T01-001', 'T01-004', 'T01-005'];
  } 
  else {
    const s = slides[currentSlide];
    text = `<p>Mình tìm thấy nội dung gần nhất trong transcript của <strong>Slide ${currentSlide + 1}</strong>: ${esc(s.desc)}</p><p>Bạn có thể hỏi cụ thể hơn để mình truy xuất đúng đoạn nguồn.</p>`;
    refs = s.refs;
  }
  return { text, refs };
}

window.ask = function(raw) {
  const q = raw.trim();
  if (!q) return;

  const suggestions = $('#suggestedQuestions');
  suggestions.hidden = true;

  // Thêm tin nhắn user
  $('#chatMessages').insertAdjacentHTML('beforeend', `
    <div class="user-message"><div>${esc(q)}</div></div>
    <div class="ai-message" id="typing"><span class="mini-ai">✦</span><div class="typing"><i></i><i></i><i></i></div></div>
  `);
  
  $('#chatInput').value = '';
  $('#sendChat').disabled = true;
  $('#chatMessages').scrollTop = $('#chatMessages').scrollHeight;

  setTimeout(() => {
    document.querySelector('#typing')?.remove();
    const a = findAnswer(q);
    const cites = a.refs.map(r => `<button onclick="openSource('${r}')">${r} ↗</button>`).join('');
    
    $('#chatMessages').insertAdjacentHTML('beforeend', `
      <div class="rag-answer">
        <div class="answer-label"><i></i>ĐÃ TÌM TRONG TRANSCRIPT</div>
        <div class="ai-message">
          <span class="mini-ai">✦</span>
          <div class="message-content">${a.text}<div class="citation-row">${cites}</div></div>
        </div>
        <div class="answer-tools">
          <span>${a.refs.length} đoạn nguồn · vừa xong</span>
          <button aria-label="Hữu ích"><svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M7 10v10H3V10h4Zm0 9h10a2 2 0 0 0 2-1.5l1.5-5A2 2 0 0 0 18.6 9H14l.7-3.4A2 2 0 0 0 12.7 3L7 10Z"/></svg></button>
        </div>
      </div>
    `);
    
    $('#chatMessages').appendChild(suggestions);
    suggestions.hidden = false;
    $('#chatMessages').scrollTop = $('#chatMessages').scrollHeight;
  }, 650);
}

/**
 * QUẢN LÝ SOURCE DRAWER & MODAL
 */
window.openSource = function(id) {
  const s = sources[id];
  if(!s) return;
  $('#sourceTitle').textContent = s.title;
  $('#sourceId').textContent = id;
  $('#matchScore').textContent = s.score;
  $('#sourceText').textContent = s.text;
  
  $('#quizModal').classList.remove('open');
  $('#sourceDrawer').classList.add('open');
  $('#sourceDrawer').setAttribute('aria-hidden', 'false');
  $('#backdrop').classList.add('open');
}

function closeLayers() {
  ['#sourceDrawer', '#quizModal', '#slideNav'].forEach(x => $(x).classList.remove('open'));
  $('#sourceDrawer').setAttribute('aria-hidden', 'true');
  $('#quizModal').setAttribute('aria-hidden', 'true');
  $('#backdrop').classList.remove('open');
}

/**
 * HỆ THỐNG QUIZ
 */
window.openQuiz = function() {
  closeLayers();
  $('#quizSetup').hidden = false;
  $('#quizPlay').hidden = true;
  $('#quizResult').hidden = true;
  $('#quizModal').classList.add('open');
  $('#quizModal').setAttribute('aria-hidden', 'false');
  $('#backdrop').classList.add('open');
}

function scopedFallbacks(slideIndex) {
  const s = slides[slideIndex];
  const mainRef = s.refs[0];
  return [
    { slide: slideIndex, q: `Thông điệp chính của slide “${s.title}” là gì?`, o: [s.desc, 'Luôn chọn model lớn nhất', 'Tự động hoá mọi bước ngay lập tức', 'Chỉ cần đo số lượt truy cập'], a: 0, e: `Slide nhấn mạnh: ${s.desc}`, ref: mainRef }
  ];
}

window.makeQuiz = function() {
  let pool;
  if (quiz.scope === 'slide') {
    pool = quizBank.filter(x => x.slide === currentSlide);
    if (pool.length === 0) pool = scopedFallbacks(currentSlide);
  } else {
    pool = quizBank;
  }
  
  quiz.items = [...pool].sort(() => 0.5 - Math.random()).slice(0, quiz.count);
  quiz.index = 0; quiz.score = 0; quiz.selected = null; quiz.checked = false;
  
  $('#quizSetup').hidden = true;
  $('#quizPlay').hidden = false;
  renderQuestion();
}

function renderQuestion() {
  const item = quiz.items[quiz.index];
  const total = quiz.items.length;
  $('#quizPosition').textContent = `Câu ${quiz.index + 1} / ${total}`;
  $('#quizScore').textContent = `${quiz.score} điểm`;
  $('#quizProgress').style.width = `${(quiz.index / total) * 100}%`;
  $('#quizQuestion').textContent = item.q;
  $('#quizExplanation').hidden = true;
  $('#nextQuestion').textContent = 'Kiểm tra đáp án';
  $('#nextQuestion').disabled = true;
  
  $('#quizOptions').innerHTML = item.o.map((o, i) => `
    <button class="quiz-option" onclick="selectOption(${i})">
      <span class="option-letter">${String.fromCharCode(65 + i)}</span>
      <span>${esc(o)}</span>
    </button>
  `).join('');
}

window.selectOption = function(i) {
  if (quiz.checked) return;
  quiz.selected = i;
  document.querySelectorAll('.quiz-option').forEach((opt, idx) => {
    opt.classList.toggle('selected', idx === i);
  });
  $('#nextQuestion').disabled = false;
}

window.advanceQuiz = function() {
  const item = quiz.items[quiz.index];
  if (!quiz.checked) {
    quiz.checked = true;
    const isCorrect = quiz.selected === item.a;
    if (isCorrect) quiz.score++;
    
    document.querySelectorAll('.quiz-option').forEach((opt, idx) => {
      opt.classList.add('locked');
      if (idx === item.a) opt.classList.add('correct');
      if (idx === quiz.selected && !isCorrect) opt.classList.add('wrong');
    });
    
    $('#quizExplanation').innerHTML = `<strong>${isCorrect ? 'Chính xác!' : 'Chưa đúng.'}</strong> ${item.e} <button onclick="openSource('${item.ref}')">Xem nguồn ${item.ref} ↗</button>`;
    $('#quizExplanation').hidden = false;
    $('#nextQuestion').textContent = quiz.index === quiz.items.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo';
  } else {
    if (quiz.index < quiz.items.length - 1) {
      quiz.index++; quiz.selected = null; quiz.checked = false;
      renderQuestion();
    } else {
      showResult();
    }
  }
}

function showResult() {
  $('#quizPlay').hidden = true;
  $('#quizResult').hidden = false;
  const total = quiz.items.length;
  const pc = Math.round((quiz.score / total) * 100);
  $('#finalScore').textContent = `${quiz.score}/${total}`;
  $('#correctAnswers').textContent = quiz.score;
  $('#accuracy').textContent = `${pc}%`;
  $('#resultTitle').textContent = pc >= 80 ? 'Bạn nắm bài rất tốt!' : pc >= 50 ? 'Bạn đang tiến bộ!' : 'Cùng xem lại slide nhé!';
}

// --- GÁN SỰ KIỆN ---
$('#prevSlide').onclick = () => goSlide(currentSlide - 1);
$('#nextSlide').onclick = () => goSlide(currentSlide + 1);
$('#closeChat').onclick = () => $('#chatPanel').classList.remove('open');
$('#chatFab').onclick = () => $('#chatPanel').classList.add('open');
$('#openSlides').onclick = () => { $('#slideNav').classList.add('open'); $('#backdrop').classList.add('open'); };
$('#closeSlides').onclick = closeLayers;
$('#backdrop').onclick = closeLayers;
$('#closeSource').onclick = closeLayers;
$('#openQuiz').onclick = openQuiz;
$('#closeQuiz').onclick = closeLayers;
$('#finishQuiz').onclick = closeLayers;
$('#retryQuiz').onclick = () => { $('#quizResult').hidden = true; $('#quizSetup').hidden = false; };
$('#generateQuiz').onclick = makeQuiz;
$('#nextQuestion').onclick = advanceQuiz;
$('#askSlide').onclick = () => { $('#chatPanel').classList.add('open'); $('#chatInput').focus(); };

$('#chatForm').onsubmit = e => { e.preventDefault(); ask($('#chatInput').value); };
$('#chatInput').oninput = e => { 
  e.target.style.height = 'auto'; 
  e.target.style.height = `${Math.min(e.target.scrollHeight, 80)}px`;
  $('#sendChat').disabled = !e.target.value.trim(); 
};

// Selection to Chat
$('#slideCanvas').addEventListener('pointerup', () => {
  setTimeout(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const text = selection.toString().trim();
    if (text.length < 3) return;
    
    const input = $('#chatInput');
    input.value = `“${text}”\n\n`;
    $('#chatPanel').classList.add('open');
    input.focus();
    $('#sendChat').disabled = false;
  }, 0);
});

// Fullscreen
$('#fullscreen').onclick = () => {
  const el = $('.lesson-stage');
  if (!document.fullscreenElement) el.requestFullscreen?.();
  else document.exitFullscreen?.();
};

// Keyboard Nav
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') goSlide(currentSlide - 1);
  if (e.key === 'ArrowRight') goSlide(currentSlide + 1);
  if (e.key === 'Escape') closeLayers();
});

// Quiz Config Toggles
document.querySelectorAll('.scope-card').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.scope-card').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    quiz.scope = b.dataset.scope;
  };
});
document.querySelectorAll('.count-picker button').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('.count-picker button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    quiz.count = Number(b.dataset.count);
  };
});

// KHỞI CHẠY
initPDF();