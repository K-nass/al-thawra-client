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
  Info,
  X,
  Mouse,
  Move,
  Keyboard,
  Hand,
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
          'https://unpkg.com/pdfjs-dist@4.9.155/build/pdf.worker.min.mjs';

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

          await page.render({ canvasContext: ctx, viewport }).promise;

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
        
        // Provide more helpful error messages
        let errorMessage = 'فشل تحميل المجلة. يُرجى المحاولة مرة أخرى.';
        
        if (err instanceof Error) {
          if (err.message.includes('404') || err.message.includes('not found')) {
            errorMessage = 'ملف المجلة غير موجود على الخادم. يُرجى التواصل مع الدعم الفني.';
            console.error('[MagazineViewer] PDF file not found at URL:', pdfUrl);
          } else if (err.message.includes('500')) {
            errorMessage = 'خطأ في الخادم أثناء تحميل المجلة. يُرجى المحاولة لاحقاً.';
          } else {
            errorMessage = err.message;
          }
        }
        
        setError(errorMessage);
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  /* ================================================================
     TRANSFORM ENGINE — Production-grade zoom + pan
     ================================================================
     Architecture:
     - `transform` ref = single source of truth { x, y, scale }
     - `drag` ref = gesture tracking with DEAD ZONE to separate
       clicks/double-clicks from drag gestures
     - Native DOM listeners (zero React synthetic events for gestures)
     - Every handler reads ONLY from refs (zero stale closures)
     - React state (pan, isPanning, zoomLevel) used ONLY to trigger
       re-renders for CSS — never read by gesture handlers
     ================================================================ */

  const transform = useRef({ x: 0, y: 0, scale: 1 });
  const drag = useRef({
    active: false,     // pointer is down
    panning: false,    // moved past dead zone — actually panning
    startX: 0,         // pointer clientX at gesture start
    startY: 0,         // pointer clientY at gesture start
    startTX: 0,        // transform.x at gesture start
    startTY: 0,        // transform.y at gesture start
  });
  const bookAreaRef = useRef<HTMLDivElement>(null);
  const bookConfigRef = useRef({ width: 0, height: 0 });

  // Viewport size
  const [winSize, setWinSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const update = () => setWinSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Mobile detection — single-page portrait mode below 768px
  const isMobile = winSize.w > 0 && winSize.w < 768;
  const isMobileRef = useRef(isMobile);
  isMobileRef.current = isMobile; // sync during render for native listeners

  // React state — projections of ref data for triggering re-renders
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);

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

  /* ---- Book configuration ---- */
  const bookConfig = useMemo(() => {
    const TOOLBAR_H = 52;
    const PADDING_V = 24;
    const PADDING_H = isMobile ? 24 : 112;
    const availH = Math.max((winSize.h || window.innerHeight) - TOOLBAR_H - PADDING_V, 300);
    const availW = Math.max((winSize.w || window.innerWidth) - PADDING_H, 300);
    const aspect = pageWidth > 0 && pageHeight > 0 ? pageWidth / pageHeight : 0.7;

    let pageW: number;
    let pageH: number;

    if (isMobile) {
      // Single page: fit to full available width
      pageW = Math.round(availW);
      pageH = Math.round(pageW / aspect);
      if (pageH > availH) {
        pageH = Math.round(availH);
        pageW = Math.round(pageH * aspect);
      }
    } else {
      // Two-page spread: each page fits half the available width
      pageH = Math.round(availH);
      pageW = Math.round(pageH * aspect);
      if (pageW * 2 > availW) {
        pageW = Math.round(availW / 2);
        pageH = Math.round(pageW / aspect);
      }
    }

    const config = { width: pageW, height: pageH };
    bookConfigRef.current = config;
    return config;
  }, [winSize.w, winSize.h, pageWidth, pageHeight, isMobile]);

  /* ---- react-pageflip callbacks ---- */
  const handleFlip = useCallback((e: any) => setCurrentPage(e.data as number), []);
  const handleOrientationChange = useCallback((e: any) => setOrientation(e.data as 'portrait' | 'landscape'), []);
  const handleInit = useCallback(() => setIsBookReady(true), []);
  const handleStateChange = useCallback((e: any) => setIsFlipping(e.data !== 'read'), []);

  /* ---- Transform helpers (all read from refs — zero closures) ---- */

  /** Reset pan position in both ref and React state */
  const resetPan = useCallback(() => {
    transform.current.x = 0;
    transform.current.y = 0;
    setPan({ x: 0, y: 0 });
  }, []);

  /** Full reset — zoom + pan */
  const resetTransform = useCallback(() => {
    transform.current = { x: 0, y: 0, scale: 1 };
    setPan({ x: 0, y: 0 });
    setZoomLevel(1);
  }, []);

  /** Apply a new zoom level, clamp pan to boundaries, sync React state */
  const applyZoom = useCallback((newScale: number) => {
    const t = transform.current;
    const s = Math.max(1, Math.min(4, newScale));

    if (s <= 1) {
      t.x = 0; t.y = 0; t.scale = 1;
    } else {
      const bc = bookConfigRef.current;
      const contentW = bc.width * (isMobileRef.current ? 1 : 2);
      const maxX = Math.max(0, (contentW * s - window.innerWidth) / 2);
      const maxY = Math.max(0, (bc.height * s - window.innerHeight) / 2);
      t.x = Math.max(-maxX, Math.min(maxX, t.x));
      t.y = Math.max(-maxY, Math.min(maxY, t.y));
      t.scale = s;
    }

    setPan({ x: t.x, y: t.y });
    setZoomLevel(t.scale);
  }, []);

  /* ---- Navigation ---- */
  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext('top');
    resetPan();
  }, [resetPan]);

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev('top');
    resetPan();
  }, [resetPan]);

  const goToPage = useCallback((idx: number) => {
    const pf = bookRef.current?.pageFlip();
    if (!pf) return;
    const clamped = Math.max(0, Math.min(idx, totalPages - 1));
    pf.turnToPage(clamped);
    setCurrentPage(clamped);
    resetPan();
  }, [totalPages, resetPan]);

  const goToFirst = useCallback(() => goToPage(0), [goToPage]);
  const goToLast = useCallback(() => goToPage(totalPages - 1), [goToPage, totalPages]);

  /* ---- Zoom controls ---- */
  const zoomIn = useCallback(() => applyZoom(transform.current.scale + 0.5), [applyZoom]);
  const zoomOut = useCallback(() => applyZoom(transform.current.scale - 0.5), [applyZoom]);
  const resetZoom = useCallback(() => resetTransform(), [resetTransform]);



  /* ================================================================
     NATIVE DOM GESTURE LISTENERS
     ================================================================
     Architecture:
     - DESKTOP: pointer events for drag-pan, wheel for zoom
     - MOBILE:  touch events handle EVERYTHING (1-finger pan when
       zoomed, 2-finger pinch-zoom). Pointer events are disabled
       on touch devices to prevent conflicts with react-pageflip.
     - All listeners use capture:true on mobile so we intercept
       BEFORE react-pageflip's internal handlers.
     - Dead zone (4px) separates taps from deliberate drags.
     ================================================================ */
  useEffect(() => {
    const el = bookAreaRef.current;
    if (!el) return;
    const target: HTMLDivElement = el;

    const DEAD_ZONE = 4;

    // Helper: compute pan limits for a given scale
    function getPanLimits(scale: number) {
      const bc = bookConfigRef.current;
      const contentW = bc.width * (isMobileRef.current ? 1 : 2);
      return {
        maxX: Math.max(0, (contentW * scale - window.innerWidth) / 2),
        maxY: Math.max(0, (bc.height * scale - window.innerHeight) / 2),
      };
    }

    function clampPan(x: number, y: number, scale: number) {
      if (scale <= 1) return { x: 0, y: 0 };
      const { maxX, maxY } = getPanLimits(scale);
      return {
        x: Math.max(-maxX, Math.min(maxX, x)),
        y: Math.max(-maxY, Math.min(maxY, y)),
      };
    }

    // Flush transform ref to React state
    function syncReact(scale?: number) {
      const t = transform.current;
      setPan({ x: t.x, y: t.y });
      if (scale !== undefined) setZoomLevel(scale);
    }

    /* ---- DESKTOP: Pointer events for drag-pan ---- */
    function onPointerDown(e: PointerEvent) {
      if (e.pointerType === 'touch') return;       // touch handled separately
      if (e.button !== 0) return;
      if (transform.current.scale <= 1) return;

      const d = drag.current;
      d.active = true;
      d.panning = false;
      d.startX = e.clientX;
      d.startY = e.clientY;
      d.startTX = transform.current.x;
      d.startTY = transform.current.y;
    }

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType === 'touch') return;
      const d = drag.current;
      if (!d.active) return;

      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;

      if (!d.panning) {
        if (Math.abs(dx) < DEAD_ZONE && Math.abs(dy) < DEAD_ZONE) return;
        d.panning = true;
        setIsPanning(true);
        try { target.setPointerCapture(e.pointerId); } catch {}
      }

      const t = transform.current;
      const clamped = clampPan(d.startTX + dx, d.startTY + dy, t.scale);
      t.x = clamped.x;
      t.y = clamped.y;
      syncReact();
    }

    function onPointerUp(e: PointerEvent) {
      if (e.pointerType === 'touch') return;
      const d = drag.current;
      if (!d.active) return;
      d.active = false;
      if (d.panning) {
        d.panning = false;
        setIsPanning(false);
        try { target.releasePointerCapture(e.pointerId); } catch {}
      }
    }

    /* ---- DESKTOP: Wheel zoom ---- */
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const t = transform.current;
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      const newScale = Math.max(1, Math.min(4, t.scale + delta));
      if (newScale === t.scale) return;

      const rect = target.getBoundingClientRect();
      const cx = e.clientX - rect.left - rect.width / 2;
      const cy = e.clientY - rect.top - rect.height / 2;
      const ratio = newScale / t.scale;

      let newX = cx - (cx - t.x) * ratio;
      let newY = cy - (cy - t.y) * ratio;

      const clamped = clampPan(newX, newY, newScale);
      t.x = clamped.x; t.y = clamped.y; t.scale = newScale;
      syncReact(newScale);
    }

    /* ---- MOBILE: Unified touch gesture system ---- */
    // Handles BOTH 1-finger pan (when zoomed) and 2-finger pinch-zoom.
    // Using touch events with capture:true takes priority over react-pageflip.
    let gesture: 'none' | 'pan' | 'pinch' = 'none';
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTX = 0;
    let touchStartTY = 0;
    let pinchDist0 = 0;
    let pinchScale0 = 1;
    let pinchMidX0 = 0;
    let pinchMidY0 = 0;
    let pinchTX0 = 0;
    let pinchTY0 = 0;

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length >= 2) {
        // --- PINCH START ---
        e.preventDefault();
        e.stopPropagation();
        gesture = 'pinch';
        const [a, b] = [e.touches[0], e.touches[1]];
        pinchDist0 = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
        pinchScale0 = transform.current.scale;
        pinchMidX0 = (a.clientX + b.clientX) / 2;
        pinchMidY0 = (a.clientY + b.clientY) / 2;
        pinchTX0 = transform.current.x;
        pinchTY0 = transform.current.y;
      } else if (e.touches.length === 1 && transform.current.scale > 1) {
        // --- PAN START (only when zoomed) ---
        gesture = 'none'; // will become 'pan' after dead zone
        const t = e.touches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        touchStartTX = transform.current.x;
        touchStartTY = transform.current.y;
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length >= 2 && (gesture === 'pinch' || gesture === 'none')) {
        // --- PINCH MOVE ---
        e.preventDefault();
        e.stopPropagation();
        gesture = 'pinch';
        const [a, b] = [e.touches[0], e.touches[1]];
        const dist = Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
        const newScale = Math.max(1, Math.min(4, pinchScale0 * (dist / pinchDist0)));

        // Zoom at initial midpoint
        const rect = target.getBoundingClientRect();
        const cx = pinchMidX0 - rect.left - rect.width / 2;
        const cy = pinchMidY0 - rect.top - rect.height / 2;
        const ratio = newScale / pinchScale0;
        let newX = cx - (cx - pinchTX0) * ratio;
        let newY = cy - (cy - pinchTY0) * ratio;

        // Add pan from midpoint drift
        const midX = (a.clientX + b.clientX) / 2;
        const midY = (a.clientY + b.clientY) / 2;
        newX += midX - pinchMidX0;
        newY += midY - pinchMidY0;

        const clamped = clampPan(newX, newY, newScale);
        const t = transform.current;
        t.x = clamped.x; t.y = clamped.y; t.scale = newScale;
        syncReact(newScale);

      } else if (e.touches.length === 1 && transform.current.scale > 1) {
        // --- 1-FINGER PAN MOVE (when zoomed) ---
        const touch = e.touches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;

        if (gesture !== 'pan') {
          // Dead zone
          if (Math.abs(dx) < DEAD_ZONE && Math.abs(dy) < DEAD_ZONE) return;
          gesture = 'pan';
          setIsPanning(true);
          // Once we start panning, prevent page flip
          e.preventDefault();
          e.stopPropagation();
        }

        if (gesture === 'pan') {
          e.preventDefault();
          e.stopPropagation();
          const t = transform.current;
          const clamped = clampPan(touchStartTX + dx, touchStartTY + dy, t.scale);
          t.x = clamped.x;
          t.y = clamped.y;
          syncReact();
        }
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (e.touches.length === 0) {
        if (gesture === 'pan') {
          setIsPanning(false);
        }
        gesture = 'none';
      } else if (e.touches.length === 1 && gesture === 'pinch') {
        // Pinch ended, one finger remains — re-anchor for potential pan
        gesture = 'none';
        const t = e.touches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        touchStartTX = transform.current.x;
        touchStartTY = transform.current.y;
      }
    }

    // Desktop listeners
    target.addEventListener('pointerdown', onPointerDown);
    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerup', onPointerUp);
    target.addEventListener('pointercancel', onPointerUp);
    target.addEventListener('wheel', onWheel, { passive: false });

    // Mobile listeners — capture:true to intercept before react-pageflip
    target.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
    target.addEventListener('touchmove', onTouchMove, { capture: true, passive: false });
    target.addEventListener('touchend', onTouchEnd, { capture: true });

    return () => {
      target.removeEventListener('pointerdown', onPointerDown);
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerup', onPointerUp);
      target.removeEventListener('pointercancel', onPointerUp);
      target.removeEventListener('wheel', onWheel);
      target.removeEventListener('touchstart', onTouchStart, { capture: true } as EventListenerOptions);
      target.removeEventListener('touchmove', onTouchMove, { capture: true } as EventListenerOptions);
      target.removeEventListener('touchend', onTouchEnd, { capture: true } as EventListenerOptions);
    };
  }, []);

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
  // Navigation is always available regardless of zoom — pan resets on each page turn
  const canPrev = currentPage > 0;
  const canNext = currentPage < totalPages - 1;

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

      {/* ---- Main book area — pan listeners attached natively via useEffect ---- */}
      <div
        ref={bookAreaRef}
        className={`mv-book-area ${isZoomed ? 'mv-zoomed' : ''} ${isPanning ? 'mv-panning' : ''}`}
      >

        {/* Side navigation arrows — positioned at viewport edges */}
        <button
          className={`mv-nav-arrow mv-nav-arrow-prev ${canPrev ? '' : 'mv-nav-arrow-disabled'}`}
          onClick={(e) => { e.stopPropagation(); flipPrev(); }}
          disabled={!canPrev}
          aria-label="الصفحة السابقة"
          type="button"
        >
          <ChevronRight size={40} strokeWidth={1.5} />
        </button>

        <button
          className={`mv-nav-arrow mv-nav-arrow-next ${canNext ? '' : 'mv-nav-arrow-disabled'}`}
          onClick={(e) => { e.stopPropagation(); flipNext(); }}
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
            width: isMobile ? bookConfig.width : bookConfig.width * 2,
            height: bookConfig.height,
            pointerEvents: isZoomed ? 'none' : 'auto',
            willChange: isZoomed ? 'transform' : 'auto',
            transform: isZoomed
              ? `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoomLevel})`
              : isMobile
              ? 'none'
              : `translateX(${
                  currentPage === 0
                    ? -bookConfig.width / 2
                    : currentPage === totalPages - 1 && totalPages % 2 === 0
                    ? bookConfig.width / 2
                    : 0
                }px)`,
            transformOrigin: 'center center',
          }}
        >
          {FlipBookComp && bookConfig.width > 0 ? (
            <FlipBookComp
              ref={bookRef}
              width={bookConfig.width}
              height={bookConfig.height}
              size="fixed"
              showCover={true}
              drawShadow={!isMobile}
              maxShadowOpacity={isMobile ? 0 : 0.5}
              flippingTime={isMobile ? 400 : 700}
              usePortrait={isMobile}
              autoSize={true}
              mobileScrollSupport={false}
              startZIndex={0}
              startPage={0}
              className={`mv-flipbook ${isZoomed ? 'mv-flipbook-zoomed' : ''}`}
              onFlip={handleFlip}
              onChangeOrientation={handleOrientationChange}
              onChangeState={handleStateChange}
              onInit={handleInit}
              useMouseEvents={zoomLevel === 1}
              clickEventForward={false}
            >
              {pageElements}
            </FlipBookComp>
          ) : (
            <div className="mv-book-placeholder" />
          )}

          {/* Center gutter shadow — desktop only (no spine in single-page mobile mode) */}
          {!isMobile && FlipBookComp && bookConfig.width > 0 && currentPage > 0 && (
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

          <span className="mv-tb-sep" />

          {/* Info */}
          <button onClick={() => setIsInfoOpen(true)} className="mv-tb-btn" aria-label="دليل الاستخدام" title="دليل الاستخدام" type="button">
            <Info size={16} />
          </button>
        </div>
      </div>
      {/* ---- Info Modal ---- */}
      {isInfoOpen && (
        <div className="mv-info-overlay" onClick={() => setIsInfoOpen(false)}>
          <div className="mv-info-modal" onClick={(e) => e.stopPropagation()} dir="rtl">
            <div className="mv-info-header">
              <h3 className="mv-info-title">دليل استخدام عارض المجلة</h3>
              <button className="mv-info-close" onClick={() => setIsInfoOpen(false)} type="button" aria-label="إغلاق">
                <X size={18} />
              </button>
            </div>

            <div className="mv-info-body">
              {/* Navigation */}
              <div className="mv-info-section">
                <h4 className="mv-info-section-title">
                  <Move size={14} />
                  التنقل
                </h4>
                <ul className="mv-info-list">
                  <li><span className="mv-info-icon"><ChevronRight size={14} /></span> الأسهم الجانبية لتقليب الصفحات</li>
                  <li><span className="mv-info-icon"><ChevronsRight size={14} /></span> الانتقال للصفحة الأولى / الأخيرة</li>
                  <li><span className="mv-info-icon"><PanelLeft size={14} /></span> عرض الصور المصغرة للتنقل السريع</li>
                  <li><span className="mv-info-icon">📄</span> إدخال رقم الصفحة للانتقال المباشر</li>
                </ul>
              </div>

              {/* Zoom & Pan */}
              <div className="mv-info-section">
                <h4 className="mv-info-section-title">
                  <Mouse size={14} />
                  التكبير والتحريك
                </h4>
                <ul className="mv-info-list">
                  <li><span className="mv-info-icon"><ZoomIn size={14} /></span> أزرار التكبير / التصغير في شريط الأدوات</li>
                  <li><span className="mv-info-icon"><Mouse size={14} /></span> عجلة الماوس للتكبير عند موضع المؤشر</li>
                  <li><span className="mv-info-icon"><Hand size={14} /></span> اسحب للتحريك أثناء التكبير</li>
                  <li><span className="mv-info-icon"><RotateCcw size={14} /></span> إعادة العرض للحجم الأصلي</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="mv-info-section">
                <h4 className="mv-info-section-title">
                  <FileDown size={14} />
                  إجراءات
                </h4>
                <ul className="mv-info-list">
                  <li><span className="mv-info-icon"><FileDown size={14} /></span> تحميل المجلة كملف PDF</li>
                  <li><span className="mv-info-icon"><Printer size={14} /></span> طباعة المجلة</li>
                  <li><span className="mv-info-icon"><Maximize size={14} /></span> وضع ملء الشاشة</li>
                </ul>
              </div>

              {/* Keyboard */}
              <div className="mv-info-section">
                <h4 className="mv-info-section-title">
                  <Keyboard size={14} />
                  اختصارات اللوحة
                </h4>
                <div className="mv-info-shortcuts">
                  <div className="mv-info-shortcut"><kbd>←</kbd> <span>الصفحة التالية</span></div>
                  <div className="mv-info-shortcut"><kbd>→</kbd> <span>الصفحة السابقة</span></div>
                  <div className="mv-info-shortcut"><kbd>Home</kbd> <span>الأولى</span></div>
                  <div className="mv-info-shortcut"><kbd>End</kbd> <span>الأخيرة</span></div>
                  <div className="mv-info-shortcut"><kbd>+</kbd> <span>تكبير</span></div>
                  <div className="mv-info-shortcut"><kbd>-</kbd> <span>تصغير</span></div>
                  <div className="mv-info-shortcut"><kbd>0</kbd> <span>إعادة الحجم</span></div>
                  <div className="mv-info-shortcut"><kbd>Esc</kbd> <span>خروج ملء الشاشة</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
