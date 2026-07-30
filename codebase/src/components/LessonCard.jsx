import React from 'react';

export default function LessonCard({ lesson, onOpenLesson }) {
  const isLearning = lesson.status === 'learning';
  const isDone = lesson.status === 'done';

  return (
    <article className={`lesson-card ${lesson.featured ? 'featured' : ''}`}>
      <div className={`card-cover ${lesson.coverClass}`}>
        <span className="day">{lesson.day}</span>
        <div className="cover-symbol">{lesson.symbol}</div>
        <strong>{lesson.shortTitle}</strong>
        <span className="duration">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          {lesson.duration}
        </span>
      </div>

      <div className="card-body">
        {isDone && <span className="status done">✓ Đã hoàn thành</span>}
        {isLearning && (
          <span className="status learning">
            <i></i> Đang học · {lesson.progress || 50}%
          </span>
        )}
        {!isDone && !isLearning && <span className="status new">Chưa học</span>}

        <h3>{lesson.title}</h3>
        <p>{lesson.desc}</p>

        {isLearning && (
          <div className="mini-progress">
            <i style={{ width: `${lesson.progress || 50}%` }}></i>
          </div>
        )}

        <div className="card-meta">
          <span>{lesson.slidesCount} slides</span>
          <span>·</span>
          <span>{lesson.quizCount} câu ôn tập</span>
        </div>

        <button
          className={`card-action ${isLearning ? 'primary' : ''}`}
          onClick={() => onOpenLesson(lesson.id)}
        >
          <span>{isDone ? 'Xem lại bài' : isLearning ? 'Tiếp tục học' : 'Bắt đầu học'}</span>
          <svg viewBox="0 0 24 24">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </article>
  );
}
