import React from 'react';

export default function SlideNav({
  slides,
  currentSlide,
  viewedSlidesCount,
  onGoSlide,
  isOpen,
  onClose
}) {
  const totalSlides = slides.length;
  const progressPercent = (viewedSlidesCount / totalSlides) * 100;

  return (
    <aside className={`slide-nav ${isOpen ? 'open' : ''}`}>
      <div className="slide-nav-head">
        <div>
          <strong>Nội dung bài học</strong>
          <span>{totalSlides} slides · 24 phút</span>
        </div>
        <button className="mobile-close" onClick={onClose} aria-label="Đóng">
          ×
        </button>
      </div>

      <div className="lesson-progress">
        <i style={{ width: `${progressPercent}%` }}></i>
      </div>

      <div className="slide-list">
        {slides.map((s, idx) => {
          const isActive = idx === currentSlide;
          return (
            <button
              key={idx}
              className={`slide-thumb ${isActive ? 'active' : ''}`}
              onClick={() => onGoSlide(idx)}
            >
              <span className="thumb-number">{String(idx + 1).padStart(2, '0')}</span>
              <div className="thumb-badge">
                <svg viewBox="0 0 24 24">
                  <path d="M4 5h16v12H4zM9 21h6M12 17v4" />
                </svg>
              </div>
              <div className="thumb-copy">
                <strong>{s.title}</strong>
                <span className="thumb-sub">{s.short}</span>
                <small>{s.time}</small>
              </div>
            </button>
          );
        })}
      </div>

      <div className="lesson-complete">
        <span className="complete-icon">✓</span>
        <div>
          <strong>Tiến độ bài học</strong>
          <span>
            {viewedSlidesCount}/{totalSlides} slide đã xem
          </span>
        </div>
      </div>
    </aside>
  );
}
