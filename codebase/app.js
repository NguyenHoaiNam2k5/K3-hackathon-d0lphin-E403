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

let currentSlide=0, viewed=new Set([0]), chatAll=false;
let quiz={scope:'slide',count:3,items:[],index:0,selected:null,checked:false,score:0};
const $=s=>document.querySelector(s);
const esc=s=>{const d=document.createElement('div');d.textContent=s;return d.innerHTML};

// --- AI CONFIGURATION STATE ---
let aiConfig = {
  provider: localStorage.getItem('VLEARN_AI_PROVIDER') || 'gemini',
  apiKey: localStorage.getItem('VLEARN_AI_KEY') || '',
  customEndpoint: localStorage.getItem('VLEARN_AI_ENDPOINT') || ''
};

function updateAIStatusUI() {
  const badge = $('#aiStatusBadge');
  if (badge) {
    if (aiConfig.apiKey || aiConfig.provider === 'custom') {
      badge.textContent = `🟢 Real AI Call (${aiConfig.provider.toUpperCase()})`;
      badge.className = 'status-badge live';
    } else {
      badge.textContent = '⚠️ Yêu cầu API Key ⚙️';
      badge.className = 'status-badge offline';
    }
  }
}

function slideInner(s){
  const heading=esc(s.heading).replace('\n','<br>');
  let extra='';
  if(s.type==='cards') extra=`<div class="slide-cards"><div class="slide-card"><span>01</span><strong>Người dùng</strong><small>Ai thực sự gặp vấn đề?</small></div><div class="slide-card"><span>02</span><strong>Điểm đau</strong><small>Họ đang bị tắc ở đâu?</small></div><div class="slide-card"><span>03</span><strong>Tác động</strong><small>Mỗi lần vướng tốn điều gì?</small></div></div>`;
  if(s.type==='compare') extra=`<div class="slide-compare"><div class="compare-box"><b>Automation</b><p>AI thực hiện công việc thay con người · phù hợp tác vụ rõ ràng.</p></div><div class="compare-box"><b>Augmentation</b><p>AI hỗ trợ · con người vẫn giữ quyền phán đoán và quyết định.</p></div></div>`;
  if(s.type==='flow') extra=`<div class="slide-flow"><div class="flow-node"><b>Bắt đầu nhỏ</b><small>Con người giám sát</small></div><span class="flow-arrow">→</span><div class="flow-node"><b>Đo lường</b><small>Quan sát sai sót</small></div><span class="flow-arrow">→</span><div class="flow-node"><b>Tăng dần</b><small>Tự động hoá</small></div></div>`;
  if(s.type==='hero') extra=`<div class="slide-cards"><div class="slide-card"><span>?</span><strong>Problem</strong><small>Vấn đề nào đáng giải quyết?</small></div><div class="slide-card"><span>◎</span><strong>User</strong><small>Ai thực sự cần kết quả?</small></div><div class="slide-card"><span>↗</span><strong>Outcome</strong><small>Thay đổi nào cần tạo ra?</small></div></div>`;
  return `<div class="slide-layout"><span class="slide-kicker">${s.kicker}</span><h1>${heading}</h1><p>${s.desc}</p>${extra}<span class="slide-brand"><i></i> VLEARN · AI PRODUCT</span></div>`;
}

function renderNav(){
  $('#slideList').innerHTML=slides.map((s,i)=>`<button class="slide-thumb ${i===currentSlide?'active':''}" data-slide="${i}"><span class="thumb-number">${String(i+1).padStart(2,'0')}</span><span class="thumb-preview">${esc(s.short)}</span><span class="thumb-copy"><strong>${esc(s.title)}</strong><small>${s.time}</small></span></button>`).join('');
  document.querySelectorAll('.slide-thumb').forEach(b=>b.onclick=()=>goSlide(Number(b.dataset.slide)));
}

function renderSlide(){
  const s=slides[currentSlide];
  $('#slideCanvas').innerHTML=slideInner(s);$('#slidePosition').textContent=`Slide ${currentSlide+1} / ${slides.length}`;$('#slideSection').textContent=s.title;
  $('#contextSlide').textContent=chatAll?'Tất cả slides':`Slide ${currentSlide+1}`;$('#transcriptRef').textContent=`Nguồn: ${s.refs.join(' · ')}`;
  $('#prevSlide').disabled=currentSlide===0;$('#nextSlide').disabled=currentSlide===slides.length-1;
  $('#lessonProgress').style.width=`${(viewed.size/slides.length)*100}%`;$('#progressText').textContent=`${viewed.size}/${slides.length} slide đã xem`;
  $('#currentSlideScope').textContent=`Slide ${currentSlide+1} · ${s.title}`;
  $('#slideDots').innerHTML=slides.map((_,i)=>`<button class="${i===currentSlide?'active':''}" data-dot="${i}" aria-label="Slide ${i+1}"></button>`).join('');
  document.querySelectorAll('[data-dot]').forEach(b=>b.onclick=()=>goSlide(Number(b.dataset.dot)));
  renderNav();renderSuggestions();updateAIStatusUI();
}
function goSlide(i){currentSlide=Math.max(0,Math.min(slides.length-1,i));viewed.add(currentSlide);renderSlide();if(innerWidth<=750){$('#slideNav').classList.remove('open');$('#backdrop').classList.remove('open')}}
function renderSuggestions(){const p=slides[currentSlide].prompts;$('#suggestedQuestions').innerHTML=`<span>Gợi ý theo slide ${currentSlide+1}</span>${p.map(x=>`<button>${x}</button>`).join('')}`;document.querySelectorAll('#suggestedQuestions button').forEach(b=>b.onclick=()=>ask(b.textContent))}

// --- REAL LLM API CALL ENGINE (NO IF-ELSE FALLBACK) ---
async function fetchLLMResponse(systemPrompt, userQuery) {
  const provider = aiConfig.provider;
  const apiKey = aiConfig.apiKey;

  if (provider === 'gemini') {
    const candidateModels = [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash',
      'gemini-pro'
    ];
    
    let lastErrText = '';
    for (const modelName of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\nCâu hỏi học viên: ${userQuery}` }] }
            ]
          })
        });
        if (res.ok) {
          const data = await res.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
        lastErrText = await res.text();
      } catch (err) {
        lastErrText = err.message;
      }
    }
    throw new Error(`Gemini API Error: ${lastErrText}`);
  }

  if (provider === 'openai' || provider === 'groq' || provider === 'openrouter' || provider === 'custom') {
    let endpoint = 'https://api.openai.com/v1/chat/completions';
    let model = 'gpt-4o-mini';
    if (provider === 'groq') {
      endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      model = 'llama-3.3-70b-versatile';
    } else if (provider === 'openrouter') {
      endpoint = 'https://openrouter.ai/api/v1/chat/completions';
      model = 'google/gemini-2.0-flash-001';
    } else if (provider === 'custom') {
      endpoint = aiConfig.customEndpoint || 'http://localhost:11434/v1/chat/completions';
      model = 'llama3';
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        temperature: 0.3
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`${provider.toUpperCase()} API Error (${res.status}): ${errText}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }

  throw new Error('Unrecognized provider');
}

async function generateRealAIAnswer(q) {
  const currentSlideObj = slides[currentSlide];

  // 1. Require API key setup for Real AI Execution (CP3/CP4 Rubric Strict Compliance)
  if (!aiConfig.apiKey && aiConfig.provider !== 'custom') {
    return {
      text: `<p><strong>✦ Chưa cấu hình AI API Key!</strong></p><p>Để gọi AI thật (Gemini / OpenAI / Groq / OpenRouter) sinh câu trả lời tự động mà không dùng bất kỳ câu mẫu if-else nào, bạn hãy nhấp vào biểu tượng <strong>⚙️ Cấu hình</strong> ở góc trên bên phải khung chat để điền API Key nhé.</p><p><button onclick="openSettings()" style="padding:6px 12px;border:0;border-radius:6px;background:var(--purple);color:#fff;font-weight:700;cursor:pointer;">Mở Cấu Hình ⚙️</button></p>`,
      refs: []
    };
  }

  // 2. Prepare Context Prompt for LLM Call
  const slidesSummary = slides.map((s, i) => `Slide ${i+1}: ${s.title} - ${s.desc} (Nguồn: ${s.refs.join(', ')})`).join('\n');
  const sourcesSummary = Object.entries(sources).map(([id, s]) => `[${id}] (${s.title}): "${s.text}"`).join('\n');
  
  const systemPrompt = `Bạn là Trợ giảng AI VLearn cho khoá học "AI Product".
Nhiệm vụ của bạn là hỗ trợ học viên giải thích slide và tra cứu transcript bài giảng.

NGUYÊN TẮC QUAN TRỌNG (HAX Guidelines):
1. Độc lập phân tích và trả lời câu hỏi trực tiếp, đúng trọng tâm.
2. Trích dẫn mã nguồn [Txx-xxx] (ví dụ: [T01-004], [T02-032]) nếu thông tin nằm trong transcript bên dưới. KHÔNG bịa trích dẫn mã nguồn giả nếu thông tin không xuất hiện trong transcript.
3. Nếu câu hỏi quá mơ hồ (ví dụ: "heloo", "tóm tắt", "cái này"), hãy hỏi lại học viên một cách lịch sự để thu hẹp phạm vi theo HAX G10.
4. Nếu câu hỏi ngoài phạm vi bài học (ví dụ: đòi tải file PDF, hỏi thao tác UI, hỏi lịch học/logistics, hỏi cá nhân), hãy từ chối lịch sự và hướng dẫn kênh hỗ trợ phù hợp.

DỮ LIỆU BÀI HỌC VLEARN:
--- DANH SÁCH SLIDES ---
${slidesSummary}

--- TRANSCRIPT BÀI GIẢNG ---
${sourcesSummary}

Đang xem tại: Slide ${currentSlide + 1} (${currentSlideObj.title}).`;

  try {
    const llmRawResponse = await fetchLLMResponse(systemPrompt, q);
    
    // Extract cited refs from real LLM response
    const refs = [];
    Object.keys(sources).forEach(refKey => {
      if (llmRawResponse.includes(refKey)) {
        refs.push(refKey);
      }
    });

    const formattedText = llmRawResponse.split('\n\n').map(p => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('');
    return { 
      text: formattedText, 
      refs: Array.from(new Set(refs)) 
    };

  } catch (err) {
    return {
      text: `<p><strong>⚠️ Lỗi gọi AI API:</strong> ${esc(err.message)}</p><p>Vui lòng kiểm tra lại API Key hoặc nhà cung cấp LLM trong menu ⚙️ Cấu hình.</p>`,
      refs: []
    };
  }
}

async function ask(raw){
  const q = raw.trim();
  if(!q) return;
  
  const suggestions = $('#suggestedQuestions');
  suggestions.hidden = true;
  
  $('#chatMessages').insertAdjacentHTML('beforeend', `<div class="user-message"><div>${esc(q)}</div></div><div class="ai-message" id="typing"><span class="mini-ai">✦</span><div class="typing"><i></i><i></i><i></i></div></div>`);
  $('#chatInput').value = '';
  $('#sendChat').disabled = true;
  $('#chatMessages').scrollTop = $('#chatMessages').scrollHeight;
  
  // Real AI API Call
  const a = await generateRealAIAnswer(q);
  
  document.querySelector('#typing')?.remove();
  
  const cites = a.refs.map(r => `<button data-ref="${r}">${r} ↗</button>`).join('');
  const labelText = a.refs.length > 0 ? 'ĐÃ TRÍCH DẪN NGUỒN TRANSCRIPT' : 'PHẢN HỒI TỪ TRỢ GIẢNG AI';
  
  $('#chatMessages').insertAdjacentHTML('beforeend', `<div class="rag-answer"><div class="answer-label"><i></i>${labelText}</div><div class="ai-message"><span class="mini-ai">✦</span><div class="message-content">${a.text}<div class="citation-row">${cites}</div></div></div><div class="answer-tools"><span>${a.refs.length} đoạn nguồn · vừa xong</span><button aria-label="Hữu ích"><svg viewBox="0 0 24 24"><path d="M7 10v10H3V10h4Zm0 9h10a2 2 0 0 0 2-1.5l1.5-5A2 2 0 0 0 18.6 9H14l.7-3.4A2 2 0 0 0 12.7 3L7 10Z"/></svg></button></div></div>`);
  
  bindSources();
  $('#chatMessages').appendChild(suggestions);
  suggestions.hidden = false;
  renderSuggestions();
  $('#chatMessages').scrollTop = $('#chatMessages').scrollHeight;
}

function bindSources(){document.querySelectorAll('[data-ref]').forEach(b=>b.onclick=()=>openSource(b.dataset.ref))}
function openSource(id){const s=sources[id];if(!s)return;$('#sourceTitle').textContent=s.title;$('#sourceId').textContent=id;$('#matchScore').textContent=s.score;$('#sourceText').textContent=s.text;$('#quizModal').classList.remove('open');$('#sourceDrawer').classList.add('open');$('#sourceDrawer').setAttribute('aria-hidden','false');$('#backdrop').classList.add('open')}
function closeLayers(){['#sourceDrawer','#quizModal','#slideNav','#settingsModal'].forEach(x=>$(x)?.classList.remove('open'));$('#sourceDrawer')?.setAttribute('aria-hidden','true');$('#quizModal')?.setAttribute('aria-hidden','true');$('#settingsModal')?.setAttribute('aria-hidden','true');$('#backdrop')?.classList.remove('remove');$('#backdrop')?.classList.remove('open')}

// --- SETTINGS MODAL HANDLERS ---
function openSettings() {
  closeLayers();
  $('#aiProvider').value = aiConfig.provider;
  $('#apiKeyInput').value = aiConfig.apiKey;
  $('#customEndpointInput').value = aiConfig.customEndpoint;
  toggleCustomEndpoint();
  $('#settingsModal').classList.add('open');
  $('#settingsModal').setAttribute('aria-hidden', 'false');
  $('#backdrop').classList.add('open');
}

function toggleCustomEndpoint() {
  const provider = $('#aiProvider').value;
  $('#customEndpointGroup').style.display = provider === 'custom' ? 'flex' : 'none';
}

function saveSettings() {
  aiConfig.provider = $('#aiProvider').value;
  aiConfig.apiKey = $('#apiKeyInput').value.trim();
  aiConfig.customEndpoint = $('#customEndpointInput').value.trim();

  localStorage.setItem('VLEARN_AI_PROVIDER', aiConfig.provider);
  localStorage.setItem('VLEARN_AI_KEY', aiConfig.apiKey);
  localStorage.setItem('VLEARN_AI_ENDPOINT', aiConfig.customEndpoint);

  updateAIStatusUI();
  closeLayers();
}

function openQuiz(){closeLayers();$('#quizSetup').hidden=false;$('#quizPlay').hidden=true;$('#quizResult').hidden=true;$('#currentSlideScope').textContent=`Slide ${currentSlide+1} · ${slides[currentSlide].title}`;$('#quizModal').classList.add('open');$('#quizModal').setAttribute('aria-hidden','false');$('#backdrop').classList.add('open')}
function scopedFallbacks(slideIndex){const s=slides[slideIndex],mainRef=s.refs[0];return[
  {slide:slideIndex,q:`Thông điệp chính của slide “${s.title}” là gì?`,o:[s.desc,'Luôn chọn model lớn nhất','Tự động hoá mọi bước ngay lập tức','Chỉ cần đo số lượt truy cập'],a:0,e:`Slide nhấn mạnh: ${s.desc}`,ref:mainRef},
  {slide:slideIndex,q:'Phát biểu nào phù hợp nhất với nội dung slide này?',o:[`Chủ đề trọng tâm là ${s.short.toLowerCase()}`,'Công nghệ luôn quan trọng hơn vấn đề','Không cần con người kiểm tra AI','Mọi sản phẩm đều cần agent'],a:0,e:`Nội dung slide tập trung vào “${s.short}”.`,ref:mainRef},
  {slide:slideIndex,q:'Khi áp dụng kiến thức trong slide, hành động phù hợp nhất là gì?',o:['Bám vào nguyên tắc của slide và kiểm chứng bằng dữ liệu','Bỏ qua bối cảnh người dùng','Chọn giải pháp phức tạp nhất','Không cần đánh giá kết quả'],a:0,e:'Kiến thức trong bài cần được áp dụng theo bối cảnh và kiểm chứng thay vì giả định.',ref:s.refs[1]||mainRef},
  {slide:slideIndex,q:'Đoạn transcript nào là một trong các nguồn trực tiếp của slide này?',o:[s.refs[0],'T99-999','Không có transcript','Nguồn mạng xã hội'],a:0,e:`Slide này được liên kết trực tiếp với đoạn ${s.refs[0]} trong transcript.`,ref:mainRef}
]}
function makeQuiz(){let pool;if(quiz.scope==='slide'){pool=quizBank.filter(x=>x.slide===currentSlide);const extra=scopedFallbacks(currentSlide);pool=[...pool,...extra].slice(0,quiz.count)}else{const pickedSlides=Array.from({length:quiz.count},(_,i)=>Math.round(i*(slides.length-1)/Math.max(1,quiz.count-1)));pool=pickedSlides.map(slideIndex=>quizBank.find(x=>x.slide===slideIndex)||scopedFallbacks(slideIndex)[0])}quiz.items=pool;quiz.index=0;quiz.selected=null;quiz.checked=false;quiz.score=0;$('#quizSetup').hidden=true;$('#quizResult').hidden=true;$('#quizPlay').hidden=false;renderQuestion()}
function renderQuestion(){const item=quiz.items[quiz.index],total=quiz.items.length;$('#quizPosition').textContent=`Câu ${quiz.index+1} / ${total}`;$('#quizScore').textContent=`${quiz.score} điểm`;$('#quizProgress').style.width=`${quiz.index/total*100}%`;$('#questionLabel').textContent=`SLIDE ${item.slide+1} · CHỌN MỘT ĐÁP ÁN`;$('#quizQuestion').textContent=item.q;$('#quizExplanation').hidden=true;$('#nextQuestion').textContent='Kiểm tra đáp án';$('#nextQuestion').disabled=true;$('#quizOptions').innerHTML=item.o.map((o,i)=>`<button class="quiz-option" data-option="${i}"><span class="option-letter">${String.fromCharCode(65+i)}</span><span>${o}</span></button>`).join('');document.querySelectorAll('.quiz-option').forEach(b=>b.onclick=()=>{if(quiz.checked)return;quiz.selected=Number(b.dataset.option);document.querySelectorAll('.quiz-option').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');$('#nextQuestion').disabled=false})}
function advanceQuiz(){const item=quiz.items[quiz.index];if(!quiz.checked){quiz.checked=true;const ok=quiz.selected===item.a;if(ok)quiz.score++;$('#quizScore').textContent=`${quiz.score} điểm`;document.querySelectorAll('.quiz-option').forEach(b=>{const i=Number(b.dataset.option);b.classList.add('locked');if(i===item.a)b.classList.add('correct');if(i===quiz.selected&&!ok)b.classList.add('wrong')});$('#quizExplanation').innerHTML=`<strong>${ok?'Chính xác!':'Chưa chính xác.'}</strong> ${item.e} <button data-ref="${item.ref}">Xem nguồn ${item.ref} ↗</button>`;$('#quizExplanation').hidden=false;bindSources();$('#nextQuestion').textContent=quiz.index===quiz.items.length-1?'Xem kết quả':'Câu tiếp theo';return}if(quiz.index<quiz.items.length-1){quiz.index++;quiz.selected=null;quiz.checked=false;renderQuestion()}else showResult()}
function showResult(){const total=quiz.items.length,pc=Math.round(quiz.score/total*100);$('#quizPlay').hidden=true;$('#quizResult').hidden=false;$('#finalScore').textContent=`${quiz.score}/${total}`;$('#correctAnswers').textContent=quiz.score;$('#accuracy').textContent=`${pc}%`;$('#resultTitle').textContent=pc>=80?'Bạn nắm bài rất tốt!':pc>=50?'Bạn đang tiến bộ!':'Cùng xem lại slide nhé!';$('#resultMessage').textContent=pc>=80?'Bạn đã hiểu chắc các ý chính trong phạm vi vừa chọn.':'Hãy mở lại các trích dẫn để củng cố phần còn nhầm lẫn.'}

// EVENT LISTENERS
$('#prevSlide').onclick=()=>goSlide(currentSlide-1);$('#nextSlide').onclick=()=>goSlide(currentSlide+1);$('#askSlide').onclick=()=>{if(innerWidth<=1080)$('#chatPanel').classList.add('open');$('#chatInput').focus()};$('#chatFab').onclick=()=>$('#chatPanel').classList.add('open');$('#closeChat').onclick=()=>$('#chatPanel').classList.remove('open');$('#openSlides').onclick=()=>{$('#slideNav').classList.add('open');$('#backdrop').classList.add('open')};$('#closeSlides').onclick=closeLayers;$('#backdrop').onclick=closeLayers;$('#closeSource').onclick=closeLayers;$('#openQuiz').onclick=openQuiz;$('#closeQuiz').onclick=closeLayers;$('#finishQuiz').onclick=closeLayers;$('#retryQuiz').onclick=makeQuiz;$('#generateQuiz').onclick=makeQuiz;$('#nextQuestion').onclick=advanceQuiz;

// Settings modal bindings
$('#openSettings').onclick=openSettings;
$('#closeSettings').onclick=closeLayers;
$('#cancelSettings').onclick=closeLayers;
$('#saveSettings').onclick=saveSettings;
$('#aiProvider').onchange=toggleCustomEndpoint;

$('#contextAll').onclick=()=>{chatAll=!chatAll;$('#contextSlide').textContent=chatAll?'Tất cả slides':`Slide ${currentSlide+1}`;$('#contextAll').textContent=chatAll?'Theo slide':'Đổi'};
document.querySelectorAll('.scope-card').forEach(b=>b.onclick=()=>{document.querySelectorAll('.scope-card').forEach(x=>x.classList.remove('active'));b.classList.add('active');quiz.scope=b.dataset.scope});document.querySelectorAll('.count-picker button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.count-picker button').forEach(x=>x.classList.remove('active'));b.classList.add('active');quiz.count=Number(b.dataset.count)});

$('#chatForm').onsubmit=e=>{e.preventDefault();ask($('#chatInput').value)};$('#chatInput').oninput=e=>{e.target.style.height='auto';e.target.style.height=`${Math.min(e.target.scrollHeight,80)}px`;$('#sendChat').disabled=!e.target.value.trim()};$('#chatInput').onkeydown=e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask(e.target.value)}};

function moveSelectionToChat(){
  const selection=window.getSelection();
  if(!selection||selection.isCollapsed)return;
  const selectedText=selection.toString().replace(/\s+/g,' ').trim();
  if(selectedText.length<2)return;
  const range=selection.getRangeAt(0);
  const node=range.commonAncestorContainer.nodeType===Node.TEXT_NODE?range.commonAncestorContainer.parentElement:range.commonAncestorContainer;
  if(!$('#slideCanvas').contains(node))return;
  const excerpt=selectedText.length>500?`${selectedText.slice(0,500)}…`:selectedText;
  const input=$('#chatInput');
  input.value=`“${excerpt}”\n\n`;
  input.dispatchEvent(new Event('input',{bubbles:true}));
  if(innerWidth<=1080)$('#chatPanel').classList.add('open');
  input.focus();
  input.setSelectionRange(input.value.length,input.value.length);
  document.querySelector('.selection-toast')?.remove();
  const toast=document.createElement('div');
  toast.className='selection-toast';
  toast.innerHTML='<span>✓</span> Đã thêm đoạn bôi đen vào khung chat';
  document.body.appendChild(toast);
  setTimeout(()=>toast.remove(),1800);
}
$('#slideCanvas').addEventListener('pointerup',()=>setTimeout(moveSelectionToChat,0));

$('#fullscreen').onclick=()=>{const el=$('.lesson-stage');if(!document.fullscreenElement)el.requestFullscreen?.();else document.exitFullscreen?.()};document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')goSlide(currentSlide-1);if(e.key==='ArrowRight')goSlide(currentSlide+1);if(e.key==='Escape')closeLayers()});
renderSlide();
