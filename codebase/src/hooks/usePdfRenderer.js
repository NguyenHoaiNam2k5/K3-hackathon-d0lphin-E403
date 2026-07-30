import { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

/**
 * Custom hook for managing PDF document state and aspect-ratio scale calculations.
 */
export function usePdfRenderer(pdfUrl, pageIndex) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const renderTaskRef = useRef(null);
  const textLayerTaskRef = useRef(null);

  const [pdfDoc, setPdfDoc] = useState(null);
  const [pdfError, setPdfError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load PDF Document once
  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    async function loadPDF() {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const doc = await loadingTask.promise;
        if (!isCancelled) {
          setPdfDoc(doc);
          setPdfError(false);
        }
      } catch (err) {
        console.error(`Failed to load PDF "${pdfUrl}":`, err);
        if (!isCancelled) {
          setPdfError(true);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPDF();

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl]);

  // Render function fitting both width & height of the slide-area stage
  const renderCurrentPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current || !containerRef.current) return;

    try {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
      if (textLayerTaskRef.current?.cancel) {
        textLayerTaskRef.current.cancel();
      }

      const pageNumber = pageIndex + 1;
      const page = await pdfDoc.getPage(pageNumber);

      const container = containerRef.current;
      const stage = container.closest('.slide-area') || container.parentElement;

      // Available dimensions inside slide-area stage
      const stageWidth = Math.max(300, (stage?.clientWidth || 800) - 32);
      const stageHeight = Math.max(200, (stage?.clientHeight || 600) - 110); // reserve space for toolbar/controls

      const unscaledViewport = page.getViewport({ scale: 1.0 });

      // Compute scale so page fits both width and height boundaries
      const widthScale = stageWidth / unscaledViewport.width;
      const heightScale = stageHeight / unscaledViewport.height;
      const scale = Math.min(widthScale, heightScale);

      const cssViewport = page.getViewport({ scale });
      const dpr = window.devicePixelRatio || 1;
      const renderViewport = page.getViewport({ scale: scale * dpr });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = renderViewport.width;
      canvas.height = renderViewport.height;
      canvas.style.width = `${cssViewport.width}px`;
      canvas.style.height = `${cssViewport.height}px`;

      const renderContext = {
        canvasContext: context,
        viewport: renderViewport
      };

      renderTaskRef.current = page.render(renderContext);
      await renderTaskRef.current.promise;

      // Render Text Layer
      const existingTextLayer = container.querySelector('.textLayer');
      if (existingTextLayer) existingTextLayer.remove();

      const textContent = await page.getTextContent();
      const textLayerDiv = document.createElement('div');
      textLayerDiv.className = 'textLayer';
      textLayerDiv.style.width = `${cssViewport.width}px`;
      textLayerDiv.style.height = `${cssViewport.height}px`;
      textLayerDiv.style.position = 'absolute';
      textLayerDiv.style.left = '0';
      textLayerDiv.style.top = '0';
      textLayerDiv.style.setProperty('--scale-factor', `${cssViewport.scale}`);

      container.appendChild(textLayerDiv);

      textLayerTaskRef.current = pdfjsLib.renderTextLayer({
        textContentSource: textContent,
        container: textLayerDiv,
        viewport: cssViewport,
        enhanceTextSelection: true
      });

      if (textLayerTaskRef.current.promise) {
        await textLayerTaskRef.current.promise;
      }
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Error rendering PDF page:', err);
      }
    }
  }, [pdfDoc, pageIndex]);

  useEffect(() => {
    renderCurrentPage();

    const handleResize = () => renderCurrentPage();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCurrentPage]);

  return {
    canvasRef,
    containerRef,
    pdfDoc,
    pdfError,
    isLoading
  };
}
