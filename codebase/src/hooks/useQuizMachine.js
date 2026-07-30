import { useState, useCallback } from 'react';
import { slides } from '../data/slidesData';
import { chunkMapFromChunks, generateQuiz as requestQuiz, slideApiPayload } from '../services/aiAgentService';

/**
 * Custom state machine hook for managing the Quiz setup, play loop, scoring, and retry flows.
 */
export function useQuizMachine(currentSlide, onRegisterSourceChunks) {
  const [step, setStep] = useState('setup'); // 'setup' | 'play' | 'result'
  const [scope, setScope] = useState('slide'); // 'slide' | 'all'
  const [count, setCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [quizMessage, setQuizMessage] = useState('');
  const [error, setError] = useState('');

  const [quizItems, setQuizItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState(0);

  const currentSlideInfo = slides[currentSlide] || slides[0];

  const generateQuiz = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setQuizMessage('');
    try {
      const result = await requestQuiz({
        scope,
        requested_count: count,
        provider: 'deepseek',
        ...slideApiPayload(currentSlideInfo, currentSlide)
      });
      onRegisterSourceChunks?.(chunkMapFromChunks(result.chunks || []));
      const items = (result.questions || []).map((item) => ({
        slide: currentSlide,
        q: item.question,
        o: item.options,
        a: item.correct_option_index,
        e: item.explanation,
        ref: item.citations?.[0] || null
      }));

      if (items.length === 0) {
        setQuizMessage(result.reason || 'Phạm vi này chưa đủ căn cứ để tạo câu hỏi đáng tin.');
        setStep('setup');
        return;
      }

      setQuizItems(items);
      setCurrentIndex(0);
      setScore(0);
      setSelectedOption(null);
      setIsChecked(false);
      setQuizMessage(result.status === 'PARTIAL' ? result.reason || '' : '');
      setStep('play');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Không kết nối được AI agent.');
      setStep('setup');
    } finally {
      setIsLoading(false);
    }
  }, [scope, currentSlide, count, currentSlideInfo, onRegisterSourceChunks]);

  const selectOption = useCallback((optIndex) => {
    if (isChecked) return;
    setSelectedOption(optIndex);
  }, [isChecked]);

  const advance = useCallback(() => {
    const item = quizItems[currentIndex];
    if (!isChecked) {
      setIsChecked(true);
      if (selectedOption === item.a) {
        setScore((prev) => prev + 1);
      }
    } else {
      if (currentIndex < quizItems.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsChecked(false);
      } else {
        setStep('result');
      }
    }
  }, [isChecked, quizItems, currentIndex, selectedOption]);

  const retry = useCallback(() => {
    setQuizMessage('');
    setError('');
    setStep('setup');
  }, []);

  const totalItems = quizItems.length;
  const currentItem = quizItems[currentIndex];
  const isCorrect = isChecked && selectedOption === currentItem?.a;
  const accuracyPercentage = totalItems > 0 ? Math.round((score / totalItems) * 100) : 0;

  return {
    step,
    scope,
    setScope,
    count,
    setCount,
    isLoading,
    quizMessage,
    error,
    quizItems,
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
  };
}
