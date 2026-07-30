import React from 'react';

export default function Backdrop({ isOpen, onClick, className = '' }) {
  if (!isOpen) return null;
  return (
    <div
      className={`backdrop ${isOpen ? 'open' : ''} ${className}`}
      onClick={onClick}
    />
  );
}
