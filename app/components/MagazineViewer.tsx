import { useState, useEffect, useMemo, useCallback } from "react";
import { Download, ZoomIn, ZoomOut, Maximize, Minimize, ChevronLeft, ChevronRight, X, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { PDFLoadingSpinner } from "~/components/PDFLoadingSpinner";
import { usePanZoom } from "~/hooks/usePanZoom";
import { usePageTransition } from "~/hooks/usePageTransition";

interface MagazineViewerProps {
  pdfUrl: string;
  issueNumber: string;
  date?: string;
}

export function MagazineViewer({ pdfUrl, issueNumber, date }: MagazineViewerProps) {
  // State management
  const [numPages, setNumPages] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [PdfComponents, setPdfComponents] = useState<any>(null);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // Pan/Zoom functionality
  const { 
    containerRef, 
    transform, 
    isDragging, 
    zoomIn, 
    zoomOut, 
    setScale 
  } = usePanZoom({
    minScale: 0.5,
    maxScale: 3.0,
    zoomStep: 0.2,
    enabled: true,
  });

  // Page transition with debouncing
  const {
    isLoading,
    currentPage,
    requestPageChange,
    onPageRenderComplete,
  } = usePageTransition(1, { debounceMs: 150 });

  // Use proxy URL to avoid CORS issues
  const proxyUrl = useMemo(() => 
    date ? `/api/pdf/date/${date}` : `/api/pdf/issue/${issueNumber}`,
    [date, issueNumber]
  );

  // Memoize file and options
  const fileConfig = useMemo(() => ({ url: proxyUrl }), [proxyUrl]);
  const pdfOptions = useMemo(() => ({ 
    cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/', 
    cMapPacked: true 
  }), []);

  // Load react-pdf dynamically (client-only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadPdf = async () => {
      try {
        const reactPdf = await import("react-pdf");
        reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${reactPdf.pdfjs.version}/build/pdf.worker.min.mjs`;
        
        setPdfComponents({
          Document: reactPdf.Document,
          Page: reactPdf.Page,
        });
        setIsMounted(true);
      } catch (error) {
        console.error("Failed to load PDF library:", error);
      }
    };
    
    loadPdf();
  }, []);

  // Document load success
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  // Download handler
  const handleDownload = useCallback(async () => {
    try {
      // Fetch the PDF file
      const response = await fetch(proxyUrl);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `الثورة-العدد-${issueNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }, [proxyUrl, issueNumber]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, [isFullscreen]);

  // Page navigation with local loading state
  const nextPage = useCallback(() => {
    if (currentPage < numPages && !isNavigating) {
      setIsNavigating(true);
      requestPageChange(currentPage + 1);
    }
  }, [currentPage, numPages, isNavigating, requestPageChange]);

  const prevPage = useCallback(() => {
    if (currentPage > 1 && !isNavigating) {
      setIsNavigating(true);
      requestPageChange(currentPage - 1);
    }
  }, [currentPage, isNavigating, requestPageChange]);

  // Handle page render complete
  const handlePageRenderComplete = useCallback(() => {
    setIsNavigating(false);
    onPageRenderComplete();
  }, [onPageRenderComplete]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't interfere with input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "PageUp":
          e.preventDefault();
          prevPage();
          break;
        case "ArrowLeft":
        case "PageDown":
          e.preventDefault();
          nextPage();
          break;
        case "+":
        case "=":
          e.preventDefault();
          zoomIn();
          break;
        case "-":
          e.preventDefault();
          zoomOut();
          break;
        case "Escape":
          if (isFullscreen) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [prevPage, nextPage, zoomIn, zoomOut, isFullscreen, toggleFullscreen]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Sync zoom with scale state
  useEffect(() => {
    setScale(transform.scale);
  }, [transform.scale, setScale]);

  // Loading state
  if (!isMounted || !PdfComponents) {
    return (
      <div className="w-full h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <PDFLoadingSpinner message="جاري تحميل عارض المجلة..." size="lg" />
      </div>
    );
  }

  const { Document, Page } = PdfComponents;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Controls Toolbar */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Back to Home & Page Navigation */}
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="العودة للرئيسية"
              >
                <Home className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </Link>
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
              <button
                onClick={prevPage}
                disabled={currentPage <= 1 || isLoading}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="الصفحة السابقة"
              >
                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <motion.span 
                key={currentPage}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[100px] text-center"
              >
                {currentPage} / {numPages}
              </motion.span>
              <button
                onClick={nextPage}
                disabled={currentPage >= numPages || isLoading}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="الصفحة التالية"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={zoomOut}
                disabled={transform.scale <= 0.5}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="تصغير"
              >
                <ZoomOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <motion.span 
                key={transform.scale}
                initial={{ scale: 1.2, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center"
              >
                {Math.round(transform.scale * 100)}%
              </motion.span>
              <button
                onClick={zoomIn}
                disabled={transform.scale >= 3.0}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="تكبير"
              >
                <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">تحميل</span>
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label={isFullscreen ? "خروج من ملء الشاشة" : "ملء الشاشة"}
              >
                {isFullscreen ? (
                  <Minimize className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Maximize className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewport with Pan/Zoom */}
      <div className="flex-1 overflow-hidden relative bg-gray-200 dark:bg-gray-800 p-1 md:p-2">
        <div
          ref={containerRef}
          className={`pdf-viewport w-full h-full max-w-7xl mx-auto overflow-hidden rounded-xl flex items-center justify-center ${isDragging ? 'dragging' : ''}`}
          style={{
            touchAction: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          aria-busy={isLoading}
        >
          <motion.div
            className="pdf-content"
            animate={{
              x: transform.translateX,
              y: transform.translateY,
            }}
            transition={{
              type: isDragging ? 'tween' : 'spring',
              stiffness: isDragging ? 0 : 300,
              damping: isDragging ? 0 : 30,
              duration: isDragging ? 0 : 0.3,
            }}
          >
            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden relative min-h-[calc(100vh-8rem)] flex items-center justify-center">
                {/* Loading Overlay - Stable, no layout shift */}
                <AnimatePresence>
                  {isNavigating && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-20 flex items-center justify-center pointer-events-none"
                      role="status"
                      aria-live="polite"
                    >
                      <PDFLoadingSpinner message="جاري تحميل الصفحة..." size="md" />
                      <span className="sr-only">Loading page {currentPage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="min-h-[calc(100vh-8rem)] w-full flex items-center justify-center">
                  <Document
                    file={fileConfig}
                    onLoadSuccess={onDocumentLoadSuccess}
                    options={pdfOptions}
                    loading={
                    // <div className="flex items-center justify-center w-full h-[calc(100vh-8rem)]">
                      <PDFLoadingSpinner message="جاري تحميل المجلة..." size="lg" />
                    // </div>
                  }
                    error={
                    <div className="flex items-center justify-center w-full h-screen">
                      <div className="text-center">
                        <X className="w-16 h-16 text-red-600 mx-auto mb-4" />
                        <p className="text-red-600 dark:text-red-400 mb-4">فشل عرض المجلة</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          إعادة المحاولة
                        </button>
                      </div>
                    </div>
                  }
                  >
                    <Page
                      pageNumber={currentPage}
                      scale={transform.scale * 1.5}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      onRenderSuccess={handlePageRenderComplete}
                      loading={
                        <PDFLoadingSpinner message="جاري تحميل الصفحة..." size="lg" />
                      }
                    />
                  </Document>
                </div>
              </div>
          </motion.div>
        </div>
      </div>

      {/* CSS for smooth interactions */}
      <style>{`
        .pdf-viewport {
          position: relative;
          user-select: none;
          -webkit-user-select: none;
        }

        .pdf-viewport.dragging {
          cursor: grabbing !important;
        }

        /* Prevent text selection during drag */
        .pdf-viewport.dragging * {
          user-select: none !important;
          -webkit-user-select: none !important;
        }
      `}</style>
    </div>
  );
}
