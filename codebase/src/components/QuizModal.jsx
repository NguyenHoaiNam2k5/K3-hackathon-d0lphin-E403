import React from 'react';
import { useQuizMachine } from '../hooks/useQuizMachine';
import Modal from './common/Modal';
import { slides } from '../data/slidesData';

export default function QuizModal({
  isOpen,
  onClose,
  currentSlide,
  onOpenSource,
  onRegisterSourceChunks
}) {
  const currentSlideInfo = slides[currentSlide] || slides[0];

  const {
    step,
    scope,
    setScope,
    count,
    setCount,
    isLoading,
    quizMessage,
    error,
    currentIndex,
    selectedOption,
    isChecked,
    score,
    totalItems,
    currentItem,
    isCorrect,
    accuracyPercentage,
    generateQuiz,
    selectOption,
    advance,
    retry
  } = useQuizMachine(currentSlide, onRegisterSourceChunks);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-head">
        <div>
          <span className="modal-icon">
            <svg viewBox="0 0 24 24">
              <path d="M9 3h6l1 2h3v16H5V5h3l1-2Z" />
              <path d="m9 12 2 2 4-4M9 18h6" />
            </svg>
          </span>
          <span>
            <strong>Ôn tập cùng AI</strong>
            <small>Tạo câu hỏi từ transcript bài giảng</small>
          </span>
        </div>
        <button onClick={onClose} aria-label="Đóng">
          ×
        </button>
      </div>

      {/* SETUP STEP */}
      {step === 'setup' && (
        <div className="quiz-setup">
          <div className="quiz-hero">
            <span>✦</span>
            <h2>Bạn muốn ôn tập phần nào?</h2>
            <p>AI sẽ tạo câu hỏi từ transcript và giải thích đáp án bằng nguồn tương ứng.</p>
          </div>

          <div className="scope-options">
            <button
              className={`scope-card ${scope === 'slide' ? 'active' : ''}`}
              onClick={() => setScope('slide')}
            >
              <span className="scope-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M4 5h16v12H4zM9 21h6M12 17v4" />
                </svg>
              </span>
              <span>
                <strong>Slide hiện tại</strong>
                <small>
                  Slide {currentSlide + 1} · {currentSlideInfo.title}
                </small>
              </span>
              <span className="radio"></span>
            </button>

            <button
              className={`scope-card ${scope === 'all' ? 'active' : ''}`}
              onClick={() => setScope('all')}
            >
              <span className="scope-icon all">
                <svg viewBox="0 0 24 24">
                  <path d="M6 3h12v14H6z" />
                  <path d="M3 7v14h12M9 7h6M9 11h6" />
                </svg>
              </span>
              <span>
                <strong>Toàn bộ bài học</strong>
                <small>Tổng hợp nội dung từ tất cả {slides.length} slides</small>
              </span>
              <span className="radio"></span>
            </button>
          </div>

          <div className="quiz-config">
            <span>
              <strong>Số lượng câu hỏi</strong>
              <small>Ước tính 2–4 phút</small>
            </span>
            <div className="count-picker">
              <button
                className={count === 3 ? 'active' : ''}
                onClick={() => setCount(3)}
              >
                3
              </button>
              <button
                className={count === 5 ? 'active' : ''}
                onClick={() => setCount(5)}
              >
                5
              </button>
            </div>
          </div>

          {(quizMessage || error) && (
            <div className="quiz-explanation">
              <strong>{error ? 'Chưa tạo được quiz.' : 'Thông báo từ AI.'}</strong>{' '}
              {error || quizMessage}
            </div>
          )}

          <button className="generate-button" onClick={generateQuiz} disabled={isLoading}>
            <span>✦</span> {isLoading ? 'Đang tạo từ transcript...' : 'Tạo câu hỏi ôn tập'}
          </button>
        </div>
      )}

      {/* PLAY STEP */}
      {step === 'play' && currentItem && (
        <div className="quiz-play">
          <div className="quiz-status">
            <span>
              Câu {currentIndex + 1} / {totalItems}
            </span>
            <span>{score} điểm</span>
          </div>

          <div className="quiz-progress">
            <i style={{ width: `${(currentIndex / totalItems) * 100}%` }}></i>
          </div>

          <span className="question-label">
            SLIDE {currentItem.slide + 1} · CHỌN MỘT ĐÁP ÁN
          </span>
          {quizMessage && <p className="quiz-partial-note">{quizMessage}</p>}
          <h2>{currentItem.q}</h2>

          <div className="quiz-options">
            {currentItem.o.map((optionText, optIdx) => {
              let classNames = 'quiz-option';
              if (selectedOption === optIdx) classNames += ' selected';
              if (isChecked) {
                classNames += ' locked';
                if (optIdx === currentItem.a) classNames += ' correct';
                if (optIdx === selectedOption && selectedOption !== currentItem.a) {
                  classNames += ' wrong';
                }
              }

              return (
                <button
                  key={optIdx}
                  className={classNames}
                  onClick={() => selectOption(optIdx)}
                >
                  <span className="option-letter">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{optionText}</span>
                </button>
              );
            })}
          </div>

          {isChecked && (
            <div className="quiz-explanation">
              <strong>{isCorrect ? 'Chính xác!' : 'Chưa đúng.'}</strong>{' '}
              {currentItem.e}{' '}
              {currentItem.ref && (
                <button onClick={() => onOpenSource(currentItem.ref)}>
                  Xem nguồn {currentItem.ref} ↗
                </button>
              )}
            </div>
          )}

          <button
            className="next-question"
            disabled={selectedOption === null}
            onClick={advance}
          >
            {!isChecked
              ? 'Kiểm tra đáp án'
              : currentIndex === totalItems - 1
              ? 'Xem kết quả'
              : 'Câu tiếp theo'}
          </button>
        </div>
      )}

      {/* RESULT STEP */}
      {step === 'result' && (
        <div className="quiz-result">
          <div className="score-ring">
            <span>
              {score}/{totalItems}
            </span>
          </div>
          <span className="result-label">HOÀN THÀNH LƯỢT ÔN TẬP</span>
          <h2>
            {accuracyPercentage >= 80
              ? 'Bạn nắm bài rất tốt!'
              : accuracyPercentage >= 50
              ? 'Bạn đang tiến bộ!'
              : 'Cùng xem lại slide nhé!'}
          </h2>
          <p>Kết quả lượt làm quiz sẽ giúp AI cá nhân hoá các câu hỏi tiếp theo.</p>

          <div className="result-grid">
            <div>
              <strong>{score}</strong>
              <span>Trả lời đúng</span>
            </div>
            <div>
              <strong>{accuracyPercentage}%</strong>
              <span>Độ chính xác</span>
            </div>
          </div>

          <div className="result-actions">
            <button onClick={retry}>Làm lại</button>
            <button onClick={onClose}>Hoàn tất</button>
          </div>
        </div>
      )}
    </Modal>
  );
}
