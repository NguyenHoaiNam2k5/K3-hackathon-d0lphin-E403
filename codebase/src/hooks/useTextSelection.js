import { useState, useCallback } from 'react';

/**
 * Custom hook to capture text selection inside a container and compute absolute tooltip positioning.
 */
export function useTextSelection(containerRef) {
  const [selectedSnippet, setSelectedSnippet] = useState('');
  const [selectionPos, setSelectionPos] = useState(null);

  const clearSelection = useCallback(() => {
    setSelectedSnippet('');
    setSelectionPos(null);
    try {
      window.getSelection()?.removeAllRanges();
    } catch {
      // Ignore browser window reference errors
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setSelectedSnippet('');
        setSelectionPos(null);
        return;
      }

      const text = selection.toString().trim();
      if (text.length >= 3 && containerRef.current) {
        setSelectedSnippet(text);

        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();

          setSelectionPos({
            top: rect.top - containerRect.top - 40,
            left: rect.left - containerRect.left + rect.width / 2
          });
        } catch {
          setSelectionPos(null);
        }
      } else {
        setSelectedSnippet('');
        setSelectionPos(null);
      }
    }, 10);
  }, [containerRef]);

  return {
    selectedSnippet,
    selectionPos,
    handlePointerUp,
    clearSelection
  };
}
