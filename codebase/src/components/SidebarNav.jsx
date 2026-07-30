import React from 'react';

export default function SidebarNav({ isOpen, onClose, onViewChange }) {
  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="brand" onClick={() => onViewChange('lessons')}>
          <span className="brand-mark">
            <svg viewBox="0 0 28 28">
              <path d="M7 6.5 14 3l7 3.5v7.8c0 4.4-2.9 8.4-7 10.2-4.1-1.8-7-5.8-7-10.2V6.5Z" />
              <path d="m10.5 13.8 2.2 2.2 5-5" />
            </svg>
          </span>
          <span>VLearn</span>
        </button>

        <button className="close-nav" onClick={onClose} aria-label="Đóng">
          ×
        </button>

        <nav>
          <button onClick={() => onViewChange('lessons')}>
            <svg viewBox="0 0 24 24">
              <path d="M4 11 12 4l8 7v9h-6v-6h-4v6H4v-9Z" />
            </svg>
            Trang chủ
          </button>
          <button className="active" onClick={() => onViewChange('lessons')}>
            <svg viewBox="0 0 24 24">
              <path d="M4 5h7v14H4zM13 5h7v14h-7z" />
              <path d="M7 9h1M16 9h1" />
            </svg>
            Bài học của tôi
          </button>
          <button onClick={() => onViewChange('lessons')}>
            <svg viewBox="0 0 24 24">
              <path d="M12 3 4 7l8 4 8-4-8-4ZM6 10v5c2 2 4 3 6 3s4-1 6-3v-5" />
            </svg>
            Lộ trình học
          </button>
          <button onClick={() => onViewChange('lessons')}>
            <svg viewBox="0 0 24 24">
              <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />
            </svg>
            Ghi chú
          </button>
          <button onClick={() => onViewChange('lessons')}>
            <svg viewBox="0 0 24 24">
              <path d="M12 3v18M3 12h18" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            Khám phá
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button onClick={() => {}}>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9a2.7 2.7 0 0 1 5 1.5c0 2-2.5 2-2.5 4M12 18h.01" />
            </svg>
            Trợ giúp
          </button>
          <div className="profile">
            <div className="avatar">MH</div>
            <span>
              <strong>Minh Hoàng</strong>
              <small>Học viên · Khoá 3</small>
            </span>
            <button>•••</button>
          </div>
        </div>
      </aside>

      <div className={`nav-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
    </>
  );
}
