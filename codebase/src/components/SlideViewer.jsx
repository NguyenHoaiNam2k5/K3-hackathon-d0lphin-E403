import React, { useRef, useState, useEffect } from 'react';
import { usePdfRenderer } from '../hooks/usePdfRenderer';
import { useTextSelection } from '../hooks/useTextSelection';

export default function SlideViewer({
  slides,
  currentSlide,
  onGoSlide,
  onOpenNavMobile,
  onOpenQuiz,
  onAskAI,
  onSelectTextToChat
}) {
  const stageRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slide = slides[currentSlide] || slides[0];

  const { canvasRef, containerRef, pdfError } = usePdfRenderer('/sliders.pdf', currentSlide);
  const { selectedSnippet, selectionPos, handlePointerUp, clearSelection } = useTextSelection(containerRef);

  // Clear text selection and tooltip automatically whenever page/slide changes
  useEffect(() => {
    clearSelection();
  }, [currentSlide, clearSelection]);

  const handleAskSelected = () => {
    if (selectedSnippet) {
      onSelectTextToChat(selectedSnippet);
      onAskAI();
      clearSelection();
    }
  };

  const toggleFullscreen = () => {
    if (!stageRef.current) return;
    if (!document.fullscreenElement) {
      stageRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <section className="lesson-stage" ref={stageRef}>
      <div className="lesson-toolbar">
        <button className="toolbar-button mobile-slides" onClick={onOpenNavMobile}>
          <svg viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Slides</span>
        </button>

        <div className="slide-position">
          <span>
            Slide {currentSlide + 1} / {slides.length}
          </span>
          <strong>{slide.title}</strong>
        </div>

        <div className="stage-actions">
          <button className="toolbar-button" onClick={onOpenQuiz}>
            <svg viewBox="0 0 24 24">
              <path d="M9 3h6l1 2h3v16H5V5h3l1-2Z" />
              <path d="m9 12 2 2 4-4M9 18h6" />
            </svg>
            <span>Ôn tập</span>
          </button>

          <button className="toolbar-button" onClick={toggleFullscreen} aria-label="Toàn màn hình">
            <svg viewBox="0 0 24 24">
              <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="slide-area" onPointerUp={handlePointerUp}>
        <div className="slide-canvas" ref={containerRef} style={{ position: 'relative' }}>
          {pdfError ? (
            <div className="slide-layout">
              <div className="slide-kicker">{slide.kicker}</div>
              <h1>{slide.heading}</h1>
              <p>{slide.desc}</p>
              <div className="slide-brand">
                <i></i> VLearn AI Product
              </div>
            </div>
          ) : (
            <canvas ref={canvasRef} />
          )}

          {/* Selection Tooltip Action */}
          {selectedSnippet && selectionPos && (
            <div
              className="selection-toast"
              style={{
                position: 'absolute',
                top: `${Math.max(10, selectionPos.top)}px`,
                left: `${Math.max(80, selectionPos.left)}px`,
                transform: 'translateX(-50%)',
                zIndex: 40
              }}
            >
              <span>Đã chọn text ({selectedSnippet.length} ký tự)</span>
              <button
                onClick={handleAskSelected}
                style={{
                  padding: '3px 8px',
                  borderRadius: '5px',
                  background: '#6d55dc',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 700
                }}
              >
                ✦ Hỏi AI
              </button>
            </div>
          )}
        </div>

        <div className="selection-hint">
          <svg viewBox="0 0 24 24">
            <path d="M5 4h14v16H5zM8 8h8M8 12h6" />
          </svg>
          Bôi đen văn bản trên slide để hỏi AI
        </div>

        <div className="slide-controls">
          <button
            onClick={() => onGoSlide(currentSlide - 1)}
            disabled={currentSlide === 0}
            aria-label="Slide trước"
          >
            <svg viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <div className="slide-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={i === currentSlide ? 'active' : ''}
                onClick={() => onGoSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => onGoSlide(currentSlide + 1)}
            disabled={currentSlide === slides.length - 1}
            aria-label="Slide sau"
          >
            <svg viewBox="0 0 24 24">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="slide-footer">
        <div className="transcript-state">
          <span className="pulse"></span>
          <span>
            <strong>Transcript đã đồng bộ</strong>
            <small>Nguồn: {slide.refs.join(' · ')}</small>
          </span>
        </div>

        <button onClick={onAskAI}>
          <svg viewBox="0 0 24 24">
            <path d="M20 14a3 3 0 0 1-3 3H8l-4 3V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7Z" />
          </svg>
          Hỏi AI về slide này
        </button>
      </div>
    </section>
  );
}
