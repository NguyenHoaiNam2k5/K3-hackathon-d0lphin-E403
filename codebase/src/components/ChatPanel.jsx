import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  chunkMapFromChunks,
  citationsFromText,
  messageFromApiError,
  sendChatMessage,
  slideApiPayload
} from '../services/aiAgentService';
import { slides } from '../data/slidesData';

export default function ChatPanel({
  isOpen,
  onClose,
  currentSlide,
  slidePrompts,
  onOpenSource,
  chatInputText,
  setChatInputText,
  markedText,
  onMarkedTextConsumed,
  onRegisterSourceChunks
}) {
  const [chatAllContext, setChatAllContext] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'ai-intro',
      text: 'Chào Minh! Mình đã đọc slide và transcript của bài học này.\nBạn có thể hỏi mình giải thích, lấy ví dụ hoặc làm rõ bất kỳ nội dung nào đang xuất hiện trên slide.'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 80)}px`;
    }
  }, [chatInputText]);

  const handleSend = async (questionText) => {
    const q = (questionText || chatInputText).trim();
    if (!q) return;

    const outgoingMarkedText = markedText || '';
    const activeSlide = slides[currentSlide] || slides[0];
    const history = messages
      .filter((message) => message.type === 'user' || message.type === 'rag-answer')
      .slice(-6)
      .map((message) => ({
        role: message.type === 'user' ? 'user' : 'assistant',
        content: message.text || message.plainText || ''
      }))
      .filter((message) => message.content);

    setMessages((prev) => [...prev, { type: 'user', text: q }]);
    setChatInputText('');
    onMarkedTextConsumed?.();
    setIsTyping(true);

    try {
      const result = await sendChatMessage({
        message: q,
        marked_text: outgoingMarkedText,
        history,
        provider: 'deepseek',
        scope: chatAllContext ? 'all' : 'slide',
        ...slideApiPayload(activeSlide, currentSlide)
      });
      const refs = citationsFromText(result.assistant_text || '');
      const sourceMap = chunkMapFromChunks(result.transcript_context?.chunks || []);
      onRegisterSourceChunks?.(sourceMap);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          type: 'rag-answer',
          markdownText: result.assistant_text || 'Mình chưa nhận được câu trả lời từ AI agent.',
          plainText: result.assistant_text || '',
          refs
        }
      ]);
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          type: 'rag-answer',
          markdownText: messageFromApiError(error),
          plainText: messageFromApiError(error),
          refs: []
        }
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className={`chat-panel ${isOpen ? 'open' : ''}`}>
      <div className="chat-head">
        <div className="ai-title">
          <span className="ai-mark">✦</span>
          <div>
            <strong>Trợ giảng AI</strong>
            <span>
              <i></i> Đang dùng 6 transcript
            </span>
          </div>
        </div>
        <button className="header-icon" onClick={onClose} aria-label="Đóng chatbot">
          <svg viewBox="0 0 24 24">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>

      <div className="context-bar">
        <svg viewBox="0 0 24 24">
          <path d="M5 4h14v16H5zM8 8h8M8 12h6" />
        </svg>
        <span>
          Đang hỏi theo{' '}
          <strong>{chatAllContext ? 'Tất cả slides' : `Slide ${currentSlide + 1}`}</strong>
        </span>
        <button onClick={() => setChatAllContext(!chatAllContext)}>Đổi</button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => {
          if (msg.type === 'ai-intro') {
            return (
              <div className="ai-message intro-message" key={index}>
                <span className="mini-ai">✦</span>
                <div className="message-content">
                  <p>Chào Minh! Mình đã đọc slide và transcript của bài học này.</p>
                  <p>
                    Bạn có thể hỏi mình giải thích, lấy ví dụ hoặc làm rõ bất kỳ nội dung nào đang xuất
                    hiện trên slide.
                  </p>
                </div>
              </div>
            );
          }
          if (msg.type === 'user') {
            return (
              <div className="user-message" key={index}>
                <div>{msg.text}</div>
              </div>
            );
          }
          if (msg.type === 'rag-answer') {
            return (
              <div className="rag-answer" key={index}>
                <div className="answer-label">
                  <i></i>ĐÃ TÌM TRONG TRANSCRIPT
                </div>
                <div className="ai-message">
                  <span className="mini-ai">✦</span>
                  <div className="message-content">
                    <div className="markdown-message">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.markdownText || msg.plainText || ''}
                      </ReactMarkdown>
                    </div>
                    <div className="citation-row">
                      {msg.refs.map((refId) => (
                        <button key={refId} onClick={() => onOpenSource(refId)}>
                          {refId} ↗
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="answer-tools">
                  <span>{msg.refs.length} đoạn nguồn · vừa xong</span>
                  <button aria-label="Hữu ích">
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path
                        fill="currentColor"
                        d="M7 10v10H3V10h4Zm0 9h10a2 2 0 0 0 2-1.5l1.5-5A2 2 0 0 0 18.6 9H14l.7-3.4A2 2 0 0 0 12.7 3L7 10Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })}

        {isTyping && (
          <div className="ai-message">
            <span className="mini-ai">✦</span>
            <div className="typing">
              <i></i>
              <i></i>
              <i></i>
            </div>
          </div>
        )}

        {slidePrompts && slidePrompts.length > 0 && !isTyping && (
          <div className="suggested-questions">
            <span>Gợi ý theo slide {currentSlide + 1}</span>
            {slidePrompts.map((promptText, pIdx) => (
              <button key={pIdx} onClick={() => handleSend(promptText)}>
                {promptText}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-composer-wrap">
        <form
          className="chat-composer"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Hỏi về nội dung slide..."
            value={chatInputText}
            onChange={(e) => setChatInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Câu hỏi"
          />
          <div className="composer-row">
            <span>
              <svg viewBox="0 0 24 24">
                <path d="M5 4h14v16H5zM8 8h8M8 12h6" />
              </svg>{' '}
              RAG · Transcript bài giảng
            </span>
            <button type="submit" disabled={!chatInputText.trim()} aria-label="Gửi">
              <svg viewBox="0 0 24 24">
                <path d="m5 12 14-7-4 14-3-6-7-1Z" />
                <path d="m12 13 7-8" />
              </svg>
            </button>
          </div>
        </form>
        <p>AI có thể mắc lỗi · Kiểm tra lại từ trích dẫn</p>
      </div>
    </aside>
  );
}
