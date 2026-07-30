import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';

/**
 * Custom hook to manage lesson slide index and progress persistence.
 */
export function useLessonProgress(lessonId, totalSlides) {
  const currentSlideKey = `vlearn_progress_lesson_${lessonId}_currentSlide`;
  const viewedSlidesKey = `vlearn_progress_lesson_${lessonId}_viewedSlides`;

  const [currentSlide, setCurrentSlide] = useState(() => {
    return storageService.get(currentSlideKey, 0);
  });

  const [viewedSlides, setViewedSlides] = useState(() => {
    const saved = storageService.get(viewedSlidesKey, [0]);
    return new Set(saved);
  });

  useEffect(() => {
    storageService.set(currentSlideKey, currentSlide);
    storageService.set(viewedSlidesKey, Array.from(viewedSlides));
  }, [currentSlide, viewedSlides, currentSlideKey, viewedSlidesKey]);

  const goToSlide = useCallback((index) => {
    const nextIdx = Math.max(0, Math.min(totalSlides - 1, index));
    setCurrentSlide(nextIdx);
    setViewedSlides((prev) => new Set([...prev, nextIdx]));
  }, [totalSlides]);

  return {
    currentSlide,
    viewedSlides,
    viewedCount: viewedSlides.size,
    goToSlide
  };
}
