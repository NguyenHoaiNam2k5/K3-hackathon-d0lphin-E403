import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import Modal from './common/Modal';

export default function NotesModal({ isOpen, onClose, lessonId, currentSlide, slideTitle }) {
  const noteKey = `vlearn_notes_${lessonId}_slide_${currentSlide}`;
  const [noteContent, setNoteContent] = useState('');
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedNote = storageService.get(noteKey, '');
      setNoteContent(savedNote);
      setSavedStatus(false);
    }
  }, [isOpen, noteKey]);

  const handleSave = () => {
    storageService.set(noteKey, noteContent);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="480px">
      <div className="modal-head">
        <div>
          <span className="modal-icon notes-icon">
            <svg viewBox="0 0 24 24">
              <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />
            </svg>
          </span>
          <span>
            <strong>Ghi chú Slide {currentSlide + 1}</strong>
            <small>{slideTitle}</small>
          </span>
        </div>
        <button onClick={onClose} aria-label="Đóng">
          ×
        </button>
      </div>

      <div className="notes-body">
        <textarea
          className="notes-textarea"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Nhập ghi chú hoặc tóm tắt cá nhân cho slide này..."
        />

        <div className="notes-footer">
          <span className={`notes-status ${savedStatus ? 'saved' : ''}`}>
            {savedStatus ? '✓ Đã lưu vào bộ nhớ' : 'Tự động đồng bộ cục bộ'}
          </span>
          <div className="notes-actions">
            <button className="btn-secondary" onClick={onClose}>
              Đóng
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Lưu ghi chú
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
