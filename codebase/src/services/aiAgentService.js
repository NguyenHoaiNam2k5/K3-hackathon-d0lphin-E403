import ky from 'ky';

const api = ky.create({
  timeout: 60000
});

export class AgentApiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AgentApiError';
  }
}

export async function sendChatMessage(payload) {
  return api.post('/api/chat', { json: payload }).json();
}

export async function explainMarkedText(payload) {
  return api.post('/api/marked-text', { json: payload }).json();
}

export async function generateQuiz(payload) {
  return api.post('/api/quiz', { json: payload }).json();
}

export async function getAgentVersion() {
  return api.get('/api/version').json();
}

export function slideApiPayload(slide, slideIndex) {
  return {
    slide_id: `slide-${String(slideIndex + 1).padStart(2, '0')}`,
    slide_title: slide?.title || '',
    slide_text: [slide?.heading, slide?.desc].filter(Boolean).join('\n'),
    nearby_text: [slide?.kicker, slide?.short, ...(slide?.prompts || []), ...(slide?.refs || [])].filter(Boolean)
  };
}

export function chunkMapFromChunks(chunks = []) {
  return chunks.reduce((acc, chunk) => {
    const id = chunk.paragraph_id || chunk.id;
    if (!id) return acc;
    acc[id] = {
      title: chunk.source || 'Transcript bài giảng',
      score: chunk.score ? `${Math.round(Number(chunk.score) * 100)}%` : 'RAG',
      text: chunk.text || ''
    };
    return acc;
  }, {});
}

export function citationsFromText(text = '') {
  return [...new Set([...text.matchAll(/\[(T\d{2}-\d{3})\]/g)].map((match) => match[1]))];
}

export function messageFromApiError(error) {
  if (error instanceof AgentApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Không kết nối được AI agent. Kiểm tra backend Flask và thử lại.';
}
