import { useZoom, ZoomMode } from '@embedpdf/plugin-zoom/react';
import { useScroll, ScrollStrategy } from '@embedpdf/plugin-scroll/react';
import { useExport } from '@embedpdf/plugin-export/react';
import { useCapture } from '@embedpdf/plugin-capture/react';
import { usePrint } from '@embedpdf/plugin-print/react';
import { useRotate } from '@embedpdf/plugin-rotate/react';
import { useSpread, SpreadMode } from '@embedpdf/plugin-spread/react';
import { Link } from 'react-router';
import {
  Home,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
  Menu,
  MousePointer2,
  Hand,
  Camera,
  Printer,
  FileDown,
  ChevronDown,
  Settings2,
  ArrowUpDown,
  ArrowLeftRight,
  Columns2,
  Square,
  SquareDashedMousePointer,
  RotateCw,
  RotateCcw,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface ViewerToolbarProps {
  documentId: string;
  issueNumber: string;
  date?: string;
  totalPages: number;
  currentPage: number;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  isPanHoldEnabled: boolean;
  onPanHoldChange: (enabled: boolean) => void;
}

export function ViewerToolbar({
  documentId,
  issueNumber,
  date,
  totalPages,
  currentPage,
  onToggleSidebar,
  isSidebarOpen,
  isPanHoldEnabled,
  onPanHoldChange,
}: ViewerToolbarProps) {
  const { provides: zoom, state: zoomState } = useZoom(documentId);
  const { provides: scroll } = useScroll(documentId);
  const { provides: exportScope } = useExport(documentId);
  const { provides: capture, state: captureState } = useCapture(documentId);
  const { provides: print } = usePrint(documentId);
  const { provides: rotate } = useRotate(documentId);
  const { provides: spread, spreadMode } = useSpread(documentId);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isZoomMenuOpen, setIsZoomMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scrollStrategy, setScrollStrategy] = useState<ScrollStrategy>(
    ScrollStrategy.Vertical,
  );
  const [isPrinting, setIsPrinting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const zoomMenuRef = useRef<HTMLDivElement>(null);
  const settingsMenuRef = useRef<HTMLDivElement>(null);

  // Fullscreen listener
  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1 && scroll) {
      scroll.scrollToPage({ pageNumber: currentPage - 1 });
    }
  }, [currentPage, scroll]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages && scroll) {
      scroll.scrollToPage({ pageNumber: currentPage + 1 });
    }
  }, [currentPage, totalPages, scroll]);

  const handleDownload = useCallback(async () => {
    try {
      const proxyUrl = date
        ? `/api/pdf/date/${date}`
        : `/api/pdf/issue/${issueNumber}`;
      const response = await fetch(proxyUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `الثورة-العدد-${issueNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Download failed
    }
  }, [date, issueNumber]);

  const handleExport = useCallback(() => {
    if (exportScope) {
      exportScope.download();
      return;
    }
    handleDownload();
  }, [exportScope, handleDownload]);

  const handleCaptureToggle = useCallback(() => {
    capture?.toggleMarqueeCapture();
    setIsMenuOpen(false);
  }, [capture]);

  const handlePrint = useCallback(() => {
    if (!print || isPrinting) return;
    setIsPrinting(true);
    const task = print.print();
    task.wait(
      () => setIsPrinting(false),
      () => setIsPrinting(false),
    );
    setIsMenuOpen(false);
  }, [print, isPrinting]);

  const handleScrollStrategy = useCallback(
    (strategy: ScrollStrategy) => {
      scroll?.setScrollStrategy(strategy);
      setScrollStrategy(strategy);
    },
    [scroll],
  );

  const handleSpreadMode = useCallback(
    (mode: SpreadMode) => {
      spread?.setSpreadMode(mode);
    },
    [spread],
  );

  const handleZoomSelect = useCallback(
    (value: ZoomMode | number) => {
      zoom?.requestZoom(value);
      setIsZoomMenuOpen(false);
    },
    [zoom],
  );

  useEffect(() => {
    if (!capture) return;
    const unsubscribe = capture.onCaptureArea((result) => {
      const url = URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `al-thawra-${issueNumber}-page-${result.pageIndex + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
    return () => {
      unsubscribe();
    };
  }, [capture, issueNumber]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
      if (zoomMenuRef.current && !zoomMenuRef.current.contains(target)) {
        setIsZoomMenuOpen(false);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsMenuOpen(false);
      setIsZoomMenuOpen(false);
      setIsSettingsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const zoomPresets = useMemo(
    () => [
      { label: 'ملاءمة الصفحة', value: ZoomMode.FitPage },
      { label: 'ملاءمة العرض', value: ZoomMode.FitWidth },
      { label: '50%', value: 0.5 },
      { label: '75%', value: 0.75 },
      { label: '100%', value: 1 },
      { label: '125%', value: 1.25 },
      { label: '150%', value: 1.5 },
      { label: '200%', value: 2 },
      { label: '300%', value: 3 },
      { label: '400%', value: 4 },
      { label: '500%', value: 5 },
    ],
    [],
  );

  const isCaptureActive = captureState?.isMarqueeCaptureActive ?? false;

  const zoomPercent = zoomState
    ? Math.round(zoomState.currentZoomLevel * 100)
    : 100;
  const isMarqueeZoomActive = zoomState?.isMarqueeZoomActive ?? false;

  return (
    <div className="viewer-toolbar" id="viewer-toolbar">
      {/* Left section: Home + Sidebar toggle */}
      <div className="viewer-toolbar-section">
        <Link
          to="/"
          className="viewer-toolbar-btn"
          aria-label="العودة للرئيسية"
        >
          <Home className="w-[18px] h-[18px]" />
        </Link>

        <div className="viewer-toolbar-divider" />

        <button
          onClick={onToggleSidebar}
          className={`viewer-toolbar-btn ${isSidebarOpen ? 'viewer-toolbar-btn-active' : ''}`}
          aria-label="عرض الصور المصغرة"
          type="button"
        >
          <PanelLeft className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Center section: Page navigation */}
      <div className="viewer-toolbar-section">
        {/* RTL: ChevronRight = prev, ChevronLeft = next */}
        <button
          onClick={goToPrevPage}
          disabled={currentPage <= 1}
          className="viewer-toolbar-btn"
          aria-label="الصفحة السابقة"
          type="button"
        >
          <ChevronRight className="w-[18px] h-[18px]" />
        </button>

        <span className="viewer-toolbar-page-info">
          <span className="font-sans-en tabular-nums">{currentPage}</span>
          <span className="mx-1 opacity-40">/</span>
          <span className="font-sans-en tabular-nums">{totalPages}</span>
        </span>

        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          className="viewer-toolbar-btn"
          aria-label="الصفحة التالية"
          type="button"
        >
          <ChevronLeft className="w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Right section: Tools + Zoom + Menus */}
      <div className="viewer-toolbar-section">
        <button
          onClick={() => onPanHoldChange(true)}
          className={`viewer-toolbar-btn ${isPanHoldEnabled ? 'viewer-toolbar-btn-active' : ''}`}
          aria-label="وضع التحريك بالضغط"
          title="اضغط واسحب للتحريك"
          type="button"
        >
          <Hand className="w-[18px] h-[18px]" />
        </button>

        <button
          onClick={() => onPanHoldChange(false)}
          className={`viewer-toolbar-btn ${!isPanHoldEnabled ? 'viewer-toolbar-btn-active' : ''}`}
          aria-label="وضع المؤشر"
          title="وضع المؤشر"
          type="button"
        >
          <MousePointer2 className="w-[18px] h-[18px]" />
        </button>

        <div className="viewer-toolbar-divider" />

        <button
          onClick={() => zoom?.zoomOut()}
          disabled={zoomPercent <= 25}
          className="viewer-toolbar-btn"
          aria-label="تصغير"
          type="button"
        >
          <ZoomOut className="w-[18px] h-[18px]" />
        </button>

        <div className="viewer-toolbar-dropdown" ref={zoomMenuRef}>
          <button
            className="viewer-toolbar-btn viewer-toolbar-zoom-trigger"
            onClick={() => setIsZoomMenuOpen((prev) => !prev)}
            aria-label="خيارات التكبير"
            aria-expanded={isZoomMenuOpen}
            type="button"
          >
            <span className="viewer-toolbar-zoom-info font-sans-en tabular-nums">
              {zoomPercent}%
            </span>
            <ChevronDown className="w-[14px] h-[14px] opacity-70" />
          </button>
          {isZoomMenuOpen ? (
            <div className="viewer-toolbar-dropdown-menu">
              <div className="viewer-toolbar-dropdown-section">
                <span className="viewer-toolbar-dropdown-label">القياسات</span>
                {zoomPresets.slice(0, 2).map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleZoomSelect(preset.value)}
                    className="viewer-toolbar-dropdown-item"
                    type="button"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="viewer-toolbar-dropdown-section">
                <span className="viewer-toolbar-dropdown-label">نِسَب التكبير</span>
                <div className="viewer-toolbar-zoom-grid">
                  {zoomPresets.slice(2).map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handleZoomSelect(preset.value)}
                      className="viewer-toolbar-dropdown-item viewer-toolbar-dropdown-item-compact"
                      type="button"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <button
          onClick={() => zoom?.zoomIn()}
          disabled={zoomPercent >= 500}
          className="viewer-toolbar-btn"
          aria-label="تكبير"
          type="button"
        >
          <ZoomIn className="w-[18px] h-[18px]" />
        </button>

        <button
          onClick={() => zoom?.toggleMarqueeZoom()}
          className={`viewer-toolbar-btn ${isMarqueeZoomActive ? 'viewer-toolbar-btn-active' : ''}`}
          aria-label="تكبير بالتحديد"
          title="تكبير بالتحديد"
          type="button"
        >
          <SquareDashedMousePointer className="w-[18px] h-[18px]" />
        </button>

        <div className="viewer-toolbar-divider" />

        <div className="viewer-toolbar-dropdown" ref={settingsMenuRef}>
          <button
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            className="viewer-toolbar-btn"
            aria-label="إعدادات الصفحات"
            aria-expanded={isSettingsOpen}
            type="button"
          >
            <Settings2 className="w-[18px] h-[18px]" />
          </button>
          {isSettingsOpen ? (
            <div className="viewer-toolbar-dropdown-menu viewer-toolbar-settings-menu">
              <div className="viewer-toolbar-dropdown-section">
                <span className="viewer-toolbar-dropdown-label">نمط الصفحات</span>
                <button
                  onClick={() => handleSpreadMode(SpreadMode.None)}
                  className={`viewer-toolbar-dropdown-item ${spreadMode === SpreadMode.None ? 'viewer-toolbar-dropdown-item-active' : ''}`}
                  type="button"
                >
                  <Square className="w-[16px] h-[16px]" />
                  صفحة مفردة
                </button>
                <button
                  onClick={() => handleSpreadMode(SpreadMode.Odd)}
                  className={`viewer-toolbar-dropdown-item ${spreadMode === SpreadMode.Odd ? 'viewer-toolbar-dropdown-item-active' : ''}`}
                  type="button"
                >
                  <Columns2 className="w-[16px] h-[16px]" />
                  صفحتان (فردي)
                </button>
                <button
                  onClick={() => handleSpreadMode(SpreadMode.Even)}
                  className={`viewer-toolbar-dropdown-item ${spreadMode === SpreadMode.Even ? 'viewer-toolbar-dropdown-item-active' : ''}`}
                  type="button"
                >
                  <Columns2 className="w-[16px] h-[16px]" />
                  صفحتان (زوجي)
                </button>
              </div>

              <div className="viewer-toolbar-dropdown-section">
                <span className="viewer-toolbar-dropdown-label">اتجاه التمرير</span>
                <button
                  onClick={() => handleScrollStrategy(ScrollStrategy.Vertical)}
                  className={`viewer-toolbar-dropdown-item ${scrollStrategy === ScrollStrategy.Vertical ? 'viewer-toolbar-dropdown-item-active' : ''}`}
                  type="button"
                >
                  <ArrowUpDown className="w-[16px] h-[16px]" />
                  عمودي
                </button>
                <button
                  onClick={() => handleScrollStrategy(ScrollStrategy.Horizontal)}
                  className={`viewer-toolbar-dropdown-item ${scrollStrategy === ScrollStrategy.Horizontal ? 'viewer-toolbar-dropdown-item-active' : ''}`}
                  type="button"
                >
                  <ArrowLeftRight className="w-[16px] h-[16px]" />
                  أفقي
                </button>
              </div>

              <div className="viewer-toolbar-dropdown-section">
                <span className="viewer-toolbar-dropdown-label">تدوير الصفحات</span>
                <button
                  onClick={() => rotate?.rotateForward()}
                  className="viewer-toolbar-dropdown-item"
                  type="button"
                >
                  <RotateCw className="w-[16px] h-[16px]" />
                  تدوير مع عقارب الساعة
                </button>
                <button
                  onClick={() => rotate?.rotateBackward()}
                  className="viewer-toolbar-dropdown-item"
                  type="button"
                >
                  <RotateCcw className="w-[16px] h-[16px]" />
                  تدوير عكس عقارب الساعة
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="viewer-toolbar-dropdown" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="viewer-toolbar-btn"
            aria-label="قائمة الخيارات"
            aria-expanded={isMenuOpen}
            type="button"
          >
            <Menu className="w-[18px] h-[18px]" />
          </button>
          {isMenuOpen ? (
            <div className="viewer-toolbar-dropdown-menu">
              <button
                onClick={handleCaptureToggle}
                className={`viewer-toolbar-dropdown-item ${isCaptureActive ? 'viewer-toolbar-dropdown-item-active' : ''}`}
                type="button"
              >
                <Camera className="w-[16px] h-[16px]" />
                {isCaptureActive ? 'إلغاء لقطة' : 'لقطة شاشة'}
              </button>
              <button
                onClick={handleExport}
                className="viewer-toolbar-dropdown-item"
                type="button"
              >
                <FileDown className="w-[16px] h-[16px]" />
                تصدير
              </button>
              <button
                onClick={handlePrint}
                className="viewer-toolbar-dropdown-item"
                type="button"
                disabled={isPrinting}
              >
                <Printer className="w-[16px] h-[16px]" />
                {isPrinting ? '...جارٍ التحضير' : 'طباعة'}
              </button>
              <button
                onClick={() => {
                  toggleFullscreen();
                  setIsMenuOpen(false);
                }}
                className="viewer-toolbar-dropdown-item"
                type="button"
              >
                {isFullscreen ? (
                  <Minimize className="w-[16px] h-[16px]" />
                ) : (
                  <Maximize className="w-[16px] h-[16px]" />
                )}
                {isFullscreen ? 'الخروج من ملء الشاشة' : 'ملء الشاشة'}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
