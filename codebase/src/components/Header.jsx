import React from 'react';

export default function Header({ activeView, onViewChange, currentLessonTitle = 'Day 2 · Xác định bài toán AI', onOpenNotes }) {
  return (
    <header className="app-header">
      <button className="brand" onClick={() => onViewChange('lessons')} aria-label="VLearn">
        <span className="brand-mark">
          <svg viewBox="0 0 28 28">
            <path d="M7 6.5 14 3l7 3.5v7.8c0 4.4-2.9 8.4-7 10.2-4.1-1.8-7-5.8-7-10.2V6.5Z" />
            <path d="m10.5 13.8 2.2 2.2 5-5" />
          </svg>
        </span>
        <span>VLearn</span>
      </button>

      <div className="breadcrumb">
        <button onClick={() => onViewChange('lessons')}>Khoá học AI Product</button>
        <span>/</span>
        <strong>{currentLessonTitle}</strong>
      </div>

      <div className="header-actions">
        <span className="saved">
          <i></i> Đã lưu tiến độ
        </span>
        <button className="header-icon" onClick={onOpenNotes} aria-label="Ghi chú" title="Ghi chú bài học">
          <svg viewBox="0 0 24 24">
            <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />
          </svg>
        </button>
        <div className="avatar">MH</div>
      </div>
    </header>
  );
}
