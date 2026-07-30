import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SlideNav from '../components/SlideNav';
import SlideViewer from '../components/SlideViewer';
import ChatPanel from '../components/ChatPanel';
import SourceDrawer from '../components/SourceDrawer';
import QuizModal from '../components/QuizModal';
import NotesModal from '../components/NotesModal';
import Backdrop from '../components/common/Backdrop';

import { useLessonProgress } from '../hooks/useLessonProgress';
import { slides } from '../data/slidesData';
import { lessonsData } from '../data/lessonsData';

export default function WorkspaceView({ lessonId, onViewChange }) {
  const lesson = lessonsData.find((l) => l.id === lessonId) || lessonsData[1];

  const { currentSlide, viewedCount, goToSlide } = useLessonProgress(
    lessonId,
    slides.length
  );

  const [isSlideNavOpen, setIsSlideNavOpen] = useState(false);
  const [isChatPanelOpen, setIsChatPanelOpen] = useState(false);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);
  const [activeSourceId, setActiveSourceId] = useState(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [chatInputText, setChatInputText] = useState('');
  const [markedText, setMarkedText] = useState('');
  const [runtimeSources, setRuntimeSources] = useState({});

  const closeAllOverlays = () => {
    setIsSlideNavOpen(false);
    setIsSourceDrawerOpen(false);
    setIsQuizModalOpen(false);
    setIsNotesModalOpen(false);
  };

  const handleGoSlide = (index) => {
    goToSlide(index);
    if (window.innerWidth <= 750) {
      setIsSlideNavOpen(false);
    }
  };

  // Keyboard navigation & Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        handleGoSlide(currentSlide - 1);
      } else if (e.key === 'ArrowRight') {
        handleGoSlide(currentSlide + 1);
      } else if (e.key === 'Escape') {
        closeAllOverlays();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const handleOpenSource = (sourceId) => {
    closeAllOverlays();
    setActiveSourceId(sourceId);
    setIsSourceDrawerOpen(true);
  };

  const handleOpenQuiz = () => {
    closeAllOverlays();
    setIsQuizModalOpen(true);
  };

  const handleOpenNotes = () => {
    closeAllOverlays();
    setIsNotesModalOpen(true);
  };

  const handleSelectTextToChat = (text) => {
    setMarkedText(text);
    setChatInputText(`“${text}”\n\n`);
    setIsChatPanelOpen(true);
  };

  const currentSlideInfo = slides[currentSlide] || slides[0];
  const registerSourceChunks = (sourceMap) => {
    setRuntimeSources((prev) => ({ ...prev, ...sourceMap }));
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header
        activeView="workspace"
        onViewChange={onViewChange}
        currentLessonTitle={`${lesson.day} · ${lesson.title}`}
        onOpenNotes={handleOpenNotes}
      />

      <main className="workspace">
        <SlideNav
          slides={slides}
          currentSlide={currentSlide}
          viewedSlidesCount={viewedCount}
          onGoSlide={handleGoSlide}
          isOpen={isSlideNavOpen}
          onClose={() => setIsSlideNavOpen(false)}
        />

        <SlideViewer
          slides={slides}
          currentSlide={currentSlide}
          onGoSlide={handleGoSlide}
          onOpenNavMobile={() => setIsSlideNavOpen(true)}
          onOpenQuiz={handleOpenQuiz}
          onAskAI={() => setIsChatPanelOpen(true)}
          onSelectTextToChat={handleSelectTextToChat}
        />

        <ChatPanel
          isOpen={isChatPanelOpen}
          onClose={() => setIsChatPanelOpen(false)}
          currentSlide={currentSlide}
          slidePrompts={currentSlideInfo.prompts}
          onOpenSource={handleOpenSource}
          chatInputText={chatInputText}
          setChatInputText={setChatInputText}
          markedText={markedText}
          onMarkedTextConsumed={() => setMarkedText('')}
          onRegisterSourceChunks={registerSourceChunks}
        />
      </main>

      {/* Floating FAB on Mobile */}
      <button
        className="chat-fab"
        onClick={() => setIsChatPanelOpen(true)}
        aria-label="Mở trợ giảng AI"
      >
        <span>✦</span> Hỏi AI
      </button>

      {/* Backdrop for mobile slide nav and source drawer */}
      <Backdrop
        isOpen={isSlideNavOpen || isSourceDrawerOpen}
        onClick={closeAllOverlays}
      />

      {/* Source Drawer */}
      <SourceDrawer
        sourceId={activeSourceId}
        runtimeSources={runtimeSources}
        isOpen={isSourceDrawerOpen}
        onClose={() => setIsSourceDrawerOpen(false)}
      />

      {/* Quiz Modal */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        currentSlide={currentSlide}
        onOpenSource={handleOpenSource}
        onRegisterSourceChunks={registerSourceChunks}
      />

      {/* Slide Notes Modal */}
      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        lessonId={lessonId}
        currentSlide={currentSlide}
        slideTitle={currentSlideInfo.title}
      />
    </div>
  );
}
