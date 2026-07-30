import React from 'react';
import Backdrop from './Backdrop';

export default function Modal({
  isOpen,
  onClose,
  children,
  className = '',
  maxWidth
}) {
  if (!isOpen) return null;

  return (
    <>
      <section
        className={`quiz-modal ${isOpen ? 'open' : ''} ${className}`}
        style={maxWidth ? { maxWidth } : undefined}
        aria-hidden={!isOpen}
      >
        {children}
      </section>
      <Backdrop isOpen={isOpen} onClick={onClose} />
    </>
  );
}
