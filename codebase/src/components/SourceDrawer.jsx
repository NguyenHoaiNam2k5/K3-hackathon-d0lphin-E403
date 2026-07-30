import React from 'react';
import { sources } from '../data/slidesData';

export default function SourceDrawer({ sourceId, runtimeSources = {}, isOpen, onClose }) {
  const source = sourceId ? runtimeSources[sourceId] || sources[sourceId] : null;

  return (
    <aside className={`source-drawer ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
      <div className="drawer-head">
        <div>
          <span>Đoạn transcript nguồn</span>
          <strong>{source?.title || 'Nguồn trích dẫn'}</strong>
        </div>
        <button onClick={onClose} aria-label="Đóng">
          ×
        </button>
      </div>

      {source && (
        <div className="drawer-body">
          <div className="source-meta">
            <span>{sourceId}</span>
            <span>
              Nguồn <strong>{source.score}</strong>
            </span>
          </div>
          <p>{source.text}</p>
          <div className="verified">
            <span>✓</span> Nội dung đã được đối chiếu với transcript bài giảng.
          </div>
        </div>
      )}
    </aside>
  );
}
