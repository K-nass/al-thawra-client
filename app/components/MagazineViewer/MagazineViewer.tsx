/**
 * MagazineViewer — Photorealistic Two-Page Book Reader
 * =====================================================
 *
 * Pipeline:
 *  1. LOADER  — pdfjs-dist converts each PDF page to high-res JPEG DataURL
 *  2. RENDER  — react-pageflip (HTMLFlipBook) renders a realistic two-page
 *               spread that fills the viewport
 *
 * Key design decisions:
 *  - Pages use the ACTUAL PDF dimensions as base with very generous max bounds
 *    so the book fills the available viewport height/width
 *  - showCover: true gives proper single-page cover behavior
 *  - Navigation arrows positioned at viewport edges (matching reference)
 *  - Thin, unobtrusive toolbar at the bottom
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { Link } from 'react-router';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Maximize,
  Minimize,
  FileDown,
  Printer,
  PanelLeft,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

import { ViewerLoadingState } from './ViewerLoadingState';
import { ThumbnailSidebar } from './ThumbnailSidebar';

import './magazine-viewer.css';

/* =========================================================================
   Types
   ========================================================================= */

interface MagazineViewerProps {
  pdfUrl: string;
  issueNumber: string;
  date?: string;
}

interface PdfToImagesResult {
  pages: string[];
  progress: number;
  error: string | null;
  totalPages: number;
  pageWidth: number;
  pageHeight: number;
}

/* =========================================================================
   usePdfToImages — PDF.js Loader Hook
   ========================================================================= */

function usePdfToImages(pdfUrl: string): PdfToImagesResult {
  const [pages, setPages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      try {
        setError(null);
        setProgress(0);
        setPages([]);

        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://unpkg.com/pdfjs-dist@5.5.207/build/pdf.worker.min.mjs';

        const resolvedUrl = `/api/pdf/proxy?url=${encodeURIComponent(pdfUrl)}`;
        const loadingTask = pdfjsLib.getDocument({
          url: resolvedUrl,
          disableRange: true,
          disableAutoFetch: false,
        });

        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const numPages = pdf.numPages;
        setTotalPages(numPages);

        const renderedPages: string[] = [];
        const scale = 2; // 2x for retina clarity

        for (let i = 1; i <= numPages; i++) {
          if (cancelled) return;

          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });

          if (i === 1) {
            const baseViewport = page.getViewport({ scale: 1 });
            setPageWidth(baseViewport.width);
            setPageHeight(baseViewport.height);
          }

          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas 2D context unavailable');

          await page.render({ canvas, canvasContext: ctx, viewport }).promise;

          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          renderedPages.push(dataUrl);

          setProgress(Math.round((i / numPages) * 100));
          page.cleanup();
        }

        if (cancelled) return;
        setPages(renderedPages);
        pdf.destroy();
      } catch (err) {
        if (cancelled) return;
        console.error('[MagazineViewer] PDF load error:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'فشل تحميل المجلة. يُرجى المحاولة مرة أخرى.'
        );
      }
    }

    loadPdf();
    return () => { cancelled = true; };
  }, [pdfUrl]);

  return { pages, progress, error, totalPages, pageWidth, pageHeight };
}

/* =========================================================================
   Page — forwardRef page for react-pageflip HTML mode
   ========================================================================= */

const Page = React.forwardRef<HTMLDivElement, { src: string; number: number }>(
  (props, ref) => (
    <div className="mv-page" ref={ref}>
      <img
        src={props.src}
        alt={`صفحة ${props.number}`}
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />
    </div>
  )
);
Page.displayName = 'Page';



/* =========================================================================
   MagazineViewer — Main Export
   ========================================================================= */

export function MagazineViewer({ pdfUrl, issueNumber, date }: MagazineViewerProps) {
  const { pages, progress, error, totalPages, pageWidth, pageHeight } =
    usePdfToImages(pdfUrl);
  const [retryKey, setRetryKey] = useState(0);

  const handleRetry = useCallback(() => setRetryKey((k) => k + 1), []);

  if (error) {
    return (
      <div className="mv-error-root">
        <RefreshCw className="mv-error-icon" />
        <h2 className="mv-error-title">حدث خطأ</h2>
        <p className="mv-error-message">{error}</p>
        <button className="mv-error-btn" onClick={handleRetry} type="button">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <ViewerLoadingState
        message={
          totalPages > 0
            ? `جاري معالجة الصفحات... (${Math.round(progress)}%)`
            : 'جاري تحميل المجلة...'
        }
        progress={totalPages > 0 ? progress : undefined}
      />
    );
  }

  return (
    <FlipBookViewer
      key={retryKey}
      pages={pages}
      totalPages={totalPages}
      pageWidth={pageWidth}
      pageHeight={pageHeight}
      issueNumber={issueNumber}
      date={date}
      pdfUrl={pdfUrl}
    />
  );
}

/* =========================================================================
   FlipBookViewer — Full-viewport book + controls
   ========================================================================= */

interface FlipBookViewerProps {
  pages: string[];
  totalPages: number;
  pageWidth: number;
  pageHeight: number;
  issueNumber: string;
  date?: string;
  pdfUrl: string;
}

function FlipBookViewer({
  pages,
  totalPages,
  pageWidth,
  pageHeight,
  issueNumber,
  date,
}: FlipBookViewerProps) {
  const viewerRootRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<any>(null);

  const [FlipBookComp, setFlipBookComp] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBookReady, setIsBookReady] = useState(false);
  // Pan & zoom state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const bookWrapperRef = useRef<HTMLDivElement>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  // Track viewport size for fixed-dimension book sizing
  const [winSize, setWinSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => setWinSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ---- Dynamic import (SSR safe) ---- */
  useEffect(() => {
    import('react-pageflip').then((mod) => {
      setFlipBookComp(() => (mod as any).default || mod);
    }).catch(console.error);
  }, []);

  /* ---- Memoized pages ---- */
  const pageElements = useMemo(
    () => pages.map((src, i) => <Page key={i} src={src} number={i + 1} />),
    [pages],
  );

  /* ---- Book configuration ----
     CRITICAL: Use size="fixed" (NOT "stretch") with explicit pixel dimensions.
     size="stretch" + autoSize=true creates a circular loop:
       book resizes → container resizes → book resizes → collapses to 1-page width
     This makes the left page invisible.

     Instead: calculate page dimensions from the actual viewport height and
     the PDF's aspect ratio so the book fills the screen. */
  const bookConfig = useMemo(() => {
    const TOOLBAR_H = 52;
    const PADDING_V = 24; // top + bottom padding
    const PADDING_H = 112; // left + right (arrows)

    const availH = Math.max((winSize.h || window.innerHeight) - TOOLBAR_H - PADDING_V, 400);
    const availW = Math.max((winSize.w || window.innerWidth) - PADDING_H, 600);

    const aspect = pageWidth > 0 && pageHeight > 0 ? pageWidth / pageHeight : 0.7;

    // Each single page is aspect-ratio locked
    // In landscape (spread) mode the book is 2 pages wide
    // Fit by height first, then check if 2*w fits available width
    let pageH = Math.round(availH);
    let pageW = Math.round(pageH * aspect);

    // If two pages side-by-side are too wide, fit by width instead
    if (pageW * 2 > availW) {
      pageW = Math.round(availW / 2);
      pageH = Math.round(pageW / aspect);
    }

    return { width: pageW, height: pageH };
  }, [winSize.w, winSize.h, pageWidth, pageHeight]);

  /* ---- Events ---- */
  const handleFlip = useCallback((e: any) => {
    setCurrentPage(e.data as number);
  }, []);

  const handleOrientationChange = useCallback((e: any) => {
    setOrientation(e.data as 'portrait' | 'landscape');
  }, []);

  const handleInit = useCallback(() => {
    setIsBookReady(true);
  }, []);

  const handleStateChange = useCallback((e: any) => {
    // States: 'read' (static), 'user_fold', 'fold_corner', 'flipping'
    setIsFlipping(e.data !== 'read');
  }, []);

  /* ---- Navigation ---- */
  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext('top');
  }, []);

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev('top');
  }, []);

  const goToPage = useCallback(
    (idx: number) => {
      const pf = bookRef.current?.pageFlip();
      if (!pf) return;
      const clamped = Math.max(0, Math.min(idx, totalPages - 1));
      pf.turnToPage(clamped);
      setCurrentPage(clamped);
    },
    [totalPages],
  );

  const goToFirst = useCallback(() => goToPage(0), [goToPage]);
  const goToLast = useCallback(() => goToPage(totalPages - 1), [goToPage, totalPages]);

  /* ---- Zoom (cursor-aware, production-grade) ----
     We use transformOrigin = "0 0" on the book wrapper, so:
       rendered point = pan + scale * originalPoint
     To keep the point under the cursor fixed after a scale change:
       newPan = cursorOffset - newScale * ((cursorOffset - oldPan) / oldScale)
     where cursorOffset is the cursor position relative to the container. */
  const zoomIn = useCallback(() => {
    setZoomLevel((z) => Math.min(z + 0.5, 4));
  }, []);
  const zoomOut = useCallback(() => {
    setZoomLevel((z) => {
      const next = Math.max(z - 0.5, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);
  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleDoubleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Find cursor position relative to the mv-book-area container
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    setZoomLevel((oldZoom) => {
      if (oldZoom > 1) {
        // Zoom out — reset everything
        setPan({ x: 0, y: 0 });
        return 1;
      }
      // Zoom in at cursor focal point
      const newZoom = 2;
      // The book wrapper center is the visual origin (center of container)
      // With transformOrigin = 'center center' the math is:
      //   newPan.x = cursorX + (pan.x - cursorX) * (newZoom / oldZoom)
      // But since we're going from oldZoom=1 and pan={0,0}:
      //   newPan.x = (1 - newZoom) * (cursorX - containerWidth / 2)
      const containerW = rect.width;
      const containerH = rect.height;
      const newPanX = (1 - newZoom) * (cursorX - containerW / 2);
      const newPanY = (1 - newZoom) * (cursorY - containerH / 2);
      setPan({ x: newPanX, y: newPanY });
      return newZoom;
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only start panning when zoomed; ignore if the target is a nav button
    if (zoomLevel <= 1) return;
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    setIsPanning(true);
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, [zoomLevel, pan.x, pan.y]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    e.preventDefault();

    const rawX = e.clientX - panStart.current.x;
    const rawY = e.clientY - panStart.current.y;

    // Clamp pan so the book cannot be dragged fully off-screen.
    // At scale z, the scaled book is (bookW * z) wide and (bookH * z) tall.
    // The book is centered, so the max offset in each direction before the
    // near edge leaves the viewport = (scaledSize - originalSize) / 2.
    // We allow a generous boundary — the book edge must stay within the container.
    const scaledW = bookConfig.width * 2 * zoomLevel;
    const scaledH = bookConfig.height * zoomLevel;
    const containerW = e.currentTarget.clientWidth;
    const containerH = e.currentTarget.clientHeight;
    const maxX = Math.max(0, (scaledW - containerW) / 2);
    const maxY = Math.max(0, (scaledH - containerH) / 2);

    setPan({
      x: Math.max(-maxX, Math.min(maxX, rawX)),
      y: Math.max(-maxY, Math.min(maxY, rawY)),
    });
  }, [isPanning, bookConfig.width, bookConfig.height, zoomLevel]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    setIsPanning(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, [isPanning]);

  /* ---- Fullscreen ---- */
  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = viewerRootRef.current;
    if (!el) return;
    document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
  }, []);

  /* ---- Download ---- */
  const handleDownload = useCallback(async () => {
    try {
      const url = date ? `/api/pdf/date/${date}` : `/api/pdf/issue/${issueNumber}`;
      const res = await fetch(url);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), {
        href,
        download: `الثورة-العدد-${issueNumber}.pdf`,
      });
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch { /* silent */ }
  }, [date, issueNumber]);

  /* ---- Print ---- */
  const handlePrint = useCallback(() => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>الثورة - العدد ${issueNumber}</title>
      <style>*{margin:0;padding:0}img{width:100%;page-break-after:always;display:block}</style>
      </head><body>${pages.map((s) => `<img src="${s}"/>`).join('')}</body></html>`);
    w.document.close();
    w.onload = () => w.print();
  }, [pages, issueNumber]);

  /* ---- Keyboard ---- */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case 'ArrowRight': e.preventDefault(); flipPrev(); break;
        case 'ArrowLeft': e.preventDefault(); flipNext(); break;
        case 'Home': e.preventDefault(); goToFirst(); break;
        case 'End': e.preventDefault(); goToLast(); break;
        case '+': case '=': e.preventDefault(); zoomIn(); break;
        case '-': e.preventDefault(); zoomOut(); break;
        case '0': e.preventDefault(); resetZoom(); break;
        case 'Escape': document.fullscreenElement && document.exitFullscreen(); break;
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [flipNext, flipPrev, goToFirst, goToLast, zoomIn, zoomOut, resetZoom]);

  /* ---- Sidebar ---- */
  const toggleSidebar = useCallback(() => setIsSidebarOpen((p) => !p), []);

  /* ---- Slider ---- */
  const handleSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => goToPage(+e.target.value),
    [goToPage],
  );

  /* ---- Page Input ---- */
  const [pageInput, setPageInput] = useState('');
  const submitPage = useCallback(
    (e: React.FormEvent | React.FocusEvent) => {
      e.preventDefault();
      const v = parseInt(pageInput, 10);
      if (!isNaN(v) && v >= 1 && v <= totalPages) goToPage(v - 1);
      setPageInput('');
    },
    [pageInput, totalPages, goToPage],
  );

  const displayPage = currentPage + 1;
  const isZoomed = zoomLevel !== 1;
  const canPrev = currentPage > 0 && !isZoomed;
  const canNext = currentPage < totalPages - 1 && !isZoomed;

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div className="mv-root" ref={viewerRootRef} dir="ltr">
      {/* ---- Thumbnail Sidebar ---- */}
      <ThumbnailSidebar
        pages={pages}
        currentPage={currentPage}
        isOpen={isSidebarOpen}
        onGoToPage={goToPage}
      />

      {/* ---- Main book area ---- */}
      <div 
        className={`mv-book-area ${isZoomed ? 'mv-zoomed' : ''} ${isPanning ? 'mv-panning' : ''}`}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >

        {/* Side navigation arrows — positioned at viewport edges */}
        <button
          className={`mv-nav-arrow mv-nav-arrow-prev ${canPrev ? '' : 'mv-nav-arrow-disabled'}`}
          onClick={flipPrev}
          disabled={!canPrev}
          aria-label="الصفحة السابقة"
          type="button"
        >
          <ChevronRight size={40} strokeWidth={1.5} />
        </button>

        <button
          className={`mv-nav-arrow mv-nav-arrow-next ${canNext ? '' : 'mv-nav-arrow-disabled'}`}
          onClick={flipNext}
          disabled={!canNext}
          aria-label="الصفحة التالية"
          type="button"
        >
          <ChevronLeft size={40} strokeWidth={1.5} />
        </button>

        {/* Book wrapper — must be TWO page-widths wide so react-pageflip
            renders in landscape mode. If the parent is only 1-page wide,
            the library auto-switches to portrait (single-page) mode. */}
        <div
          className={`mv-book-wrapper ${isBookReady ? 'mv-book-ready' : ''} ${
            currentPage === 0 ? 'mv-on-cover' : ''
          }`}
          style={{
            width: bookConfig.width * 2,
            height: bookConfig.height,
            /* transformOrigin = 'center center' (default) is required so that
               the pan + scale focal-point math in handleDoubleClick works correctly.
               The formula: newPan = (1 - newZoom) * (cursor - center) keeps the
               pixel under the cursor fixed when zooming. */
            transform: isZoomed
              ? `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`
              : `translateX(${
                  currentPage === 0
                    ? -bookConfig.width / 2
                    : currentPage === totalPages - 1 && totalPages % 2 === 0
                    ? bookConfig.width / 2
                    : 0
                }px)`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        >
          {FlipBookComp && bookConfig.width > 0 ? (
            <FlipBookComp
              ref={bookRef}
              width={bookConfig.width}
              height={bookConfig.height}
              size="fixed"
              showCover={true}
              drawShadow={true}
              maxShadowOpacity={0.5}
              flippingTime={700}
              usePortrait={false}
              autoSize={true}
              mobileScrollSupport={true}
              startZIndex={0}
              startPage={0}
              clickEventForward={true}
              disableFlipByClick={true}
              className={`mv-flipbook ${isZoomed ? 'mv-flipbook-zoomed' : ''}`}
              onFlip={handleFlip}
              onChangeOrientation={handleOrientationChange}
              onChangeState={handleStateChange}
              onInit={handleInit}
              useMouseEvents={zoomLevel === 1}
            >
              {pageElements}
            </FlipBookComp>
          ) : (
            <div className="mv-book-placeholder" />
          )}

          {/* Center gutter shadow to simulate depth at the spine.
              Only visible when a full spread is showing (not on the first cover page). */}
          {FlipBookComp && bookConfig.width > 0 && currentPage > 0 && (
            <div
              className={`mv-gutter ${isFlipping ? 'mv-gutter-hidden' : ''}`}
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {/* ================================================================
         BOTTOM TOOLBAR
         ================================================================ */}
      <div className="mv-toolbar" id="mv-toolbar">
        {/* Brand */}
        <Link to="/" className="mv-tb-brand" aria-label="العودة للرئيسية">
          <span className="mv-tb-brand-name">الثورة</span>
          <span className="mv-tb-brand-issue">العدد {issueNumber}</span>
        </Link>

        {/* Controls */}
        <div className="mv-tb-controls">
          {/* Thumbnails */}
          <button onClick={toggleSidebar} className={`mv-tb-btn ${isSidebarOpen ? 'mv-tb-btn-on' : ''}`} aria-label="الصور المصغرة" title="الصور المصغرة" type="button">
            <PanelLeft size={16} />
          </button>

          <span className="mv-tb-sep" />

          {/* Navigation */}
          <button onClick={goToFirst} disabled={!canPrev} className="mv-tb-btn" aria-label="الأولى" title="الصفحة الأولى" type="button">
            <ChevronsRight size={16} />
          </button>
          <button onClick={flipPrev} disabled={!canPrev} className="mv-tb-btn" aria-label="السابقة" type="button">
            <ChevronRight size={16} />
          </button>

          <form onSubmit={submitPage} className="mv-tb-page">
            <input
              type="number"
              className="mv-tb-page-input"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={submitPage}
              placeholder={String(displayPage)}
              min={1}
              max={totalPages}
              aria-label="رقم الصفحة"
            />
            <span className="mv-tb-page-of">/ {totalPages}</span>
          </form>

          <button onClick={flipNext} disabled={!canNext} className="mv-tb-btn" aria-label="التالية" type="button">
            <ChevronLeft size={16} />
          </button>
          <button onClick={goToLast} disabled={!canNext} className="mv-tb-btn" aria-label="الأخيرة" title="الصفحة الأخيرة" type="button">
            <ChevronsLeft size={16} />
          </button>

          <span className="mv-tb-sep" />

          {/* Slider */}
          <input
            type="range"
            className="mv-tb-slider"
            min={0}
            max={totalPages - 1}
            value={currentPage}
            onChange={handleSlider}
            aria-label="شريط التنقل"
            style={{ direction: 'ltr' }}
          />

          <span className="mv-tb-sep" />

          {/* Zoom */}
          <button onClick={zoomOut} disabled={zoomLevel <= 0.5} className="mv-tb-btn" aria-label="تصغير" title="تصغير" type="button">
            <ZoomOut size={16} />
          </button>
          <button onClick={resetZoom} className="mv-tb-btn" aria-label="إعادة الحجم" title="إعادة الحجم الأصلي" type="button">
            <RotateCcw size={14} />
          </button>
          <button onClick={zoomIn} disabled={zoomLevel >= 2.5} className="mv-tb-btn" aria-label="تكبير" title="تكبير" type="button">
            <ZoomIn size={16} />
          </button>

          <span className="mv-tb-sep" />

          {/* Actions */}
          <button onClick={handleDownload} className="mv-tb-btn" aria-label="تحميل" title="تحميل PDF" type="button">
            <FileDown size={16} />
          </button>
          <button onClick={handlePrint} className="mv-tb-btn" aria-label="طباعة" title="طباعة" type="button">
            <Printer size={16} />
          </button>

          <span className="mv-tb-sep" />

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="mv-tb-btn" aria-label={isFullscreen ? 'خروج' : 'ملء الشاشة'} title={isFullscreen ? 'خروج' : 'ملء الشاشة'} type="button">
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
