import React, { useState, useMemo } from 'react';
import SidebarNav from '../components/SidebarNav';
import LessonCard from '../components/LessonCard';
import { lessonsData } from '../data/lessonsData';

export default function LessonsView({ onOpenLesson }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredLessons = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    return lessonsData.filter((lesson) => {
      const matchesFilter = activeFilter === 'all' || lesson.status === activeFilter;
      const matchesSearch =
        !term ||
        lesson.title.toLowerCase().includes(term) ||
        lesson.titleSearch.toLowerCase().includes(term) ||
        lesson.desc.toLowerCase().includes(term);
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div style={{ minHeight: '100vh', background: '#fafbfc' }}>
      <SidebarNav
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onViewChange={() => {}}
      />

      <main className="lessons-main">
        <header className="topbar">
          <button
            className="menu"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Mở menu"
          >
            <svg viewBox="0 0 24 24">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>

          <div className="search">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              type="search"
              placeholder="Tìm kiếm bài học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="top-actions">
            <button aria-label="Thông báo">
              <svg viewBox="0 0 24 24">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
              </svg>
              <i></i>
            </button>
            <div className="avatar">MH</div>
          </div>
        </header>

        <div className="content">
          <section className="welcome">
            <div>
              <span className="eyebrow">BÀI HỌC CỦA TÔI</span>
              <h1>
                Chào Minh, tiếp tục học nhé! <span>👋</span>
              </h1>
              <p>Xem lại slide, hỏi đáp với trợ giảng AI và ôn tập kiến thức sau mỗi bài.</p>
            </div>
            <div className="streak">
              <span className="flame">♨</span>
              <div>
                <strong>4 ngày</strong>
                <small>Chuỗi học liên tiếp</small>
              </div>
            </div>
          </section>

          <section className="continue-card">
            <div className="continue-art">
              <span className="art-grid"></span>
              <span className="art-badge">AI</span>
              <div className="art-copy">
                <small>AI PRODUCT · KHOÁ 3</small>
                <strong>
                  Xác định
                  <br />
                  bài toán AI
                </strong>
              </div>
            </div>
            <div className="continue-info">
              <span className="continue-label">
                <i></i> ĐANG HỌC
              </span>
              <h2>Day 2 · Xác định bài toán kinh doanh cho AI</h2>
              <p>
                Tiếp tục từ <strong>Slide 3: Automation & Augmentation</strong>
              </p>
              <div className="continue-progress">
                <i></i>
              </div>
              <div className="progress-meta">
                <span>3/6 slides đã xem</span>
                <span>50%</span>
              </div>
            </div>
            <button
              className="continue-button"
              onClick={() => onOpenLesson(2)}
            >
              <span>Tiếp tục học</span>
              <svg viewBox="0 0 24 24">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </section>

          <section className="library-head">
            <div>
              <h2>Tất cả bài học</h2>
              <span>{filteredLessons.length} bài học</span>
            </div>
            <div className="filters">
              <button
                className={activeFilter === 'all' ? 'active' : ''}
                onClick={() => setActiveFilter('all')}
              >
                Tất cả
              </button>
              <button
                className={activeFilter === 'learning' ? 'active' : ''}
                onClick={() => setActiveFilter('learning')}
              >
                Đang học
              </button>
              <button
                className={activeFilter === 'done' ? 'active' : ''}
                onClick={() => setActiveFilter('done')}
              >
                Đã hoàn thành
              </button>
              <button
                className={activeFilter === 'new' ? 'active' : ''}
                onClick={() => setActiveFilter('new')}
              >
                Chưa học
              </button>
            </div>
          </section>

          {filteredLessons.length > 0 ? (
            <section className="lesson-grid">
              {filteredLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onOpenLesson={onOpenLesson}
                />
              ))}
            </section>
          ) : (
            <div className="empty-state">
              <span>⌕</span>
              <strong>Không tìm thấy bài học</strong>
              <p>Thử một từ khoá hoặc bộ lọc khác.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
