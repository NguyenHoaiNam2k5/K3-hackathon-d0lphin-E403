import React, { useState } from 'react';
import LessonsView from './views/LessonsView';
import WorkspaceView from './views/WorkspaceView';
import './styles/index.css';
import './styles/lessons.css';
import './styles/workspace.css';

export default function App() {
  const [activeView, setActiveView] = useState('lessons'); // 'lessons' | 'workspace'
  const [selectedLessonId, setSelectedLessonId] = useState(2);

  const handleOpenLesson = (lessonId) => {
    setSelectedLessonId(lessonId);
    setActiveView('workspace');
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {activeView === 'lessons' ? (
        <LessonsView onOpenLesson={handleOpenLesson} />
      ) : (
        <WorkspaceView
          lessonId={selectedLessonId}
          onViewChange={(view) => setActiveView(view)}
        />
      )}
    </div>
  );
}
