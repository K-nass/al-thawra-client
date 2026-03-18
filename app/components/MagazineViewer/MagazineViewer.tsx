import { useState, useEffect, useCallback, useMemo, useRef, type PointerEvent } from 'react';
import { EmbedPDF } from '@embedpdf/core/react';
import { usePdfiumEngine } from '@embedpdf/engines/react';
import {
  Viewport,
} from '@embedpdf/plugin-viewport/react';
import { Scroller, useScroll } from '@embedpdf/plugin-scroll/react';
import {
  DocumentContent,
} from '@embedpdf/plugin-document-manager/react';
import { RenderLayer } from '@embedpdf/plugin-render/react';
import {
  ZoomGestureWrapper,
  MarqueeZoom,
  useZoom,
  ZoomMode,
} from '@embedpdf/plugin-zoom/react';
import { Rotate } from '@embedpdf/plugin-rotate/react';
import { MarqueeCapture } from '@embedpdf/plugin-capture/react';
import { usePan } from '@embedpdf/plugin-pan/react';
import {
  PagePointerProvider,
  GlobalPointerProvider,
} from '@embedpdf/plugin-interaction-manager/react';

import { createViewerPlugins } from '~/lib/pdf-viewer-plugins';
import { ViewerToolbar } from './ViewerToolbar';
import { ThumbnailSidebar } from './ThumbnailSidebar';
import { ViewerLoadingState } from './ViewerLoadingState';

import './magazine-viewer.css';

interface MagazineViewerProps {
  pdfUrl: string;
  issueNumber: string;
  date?: string;
}

// Hardcoded test URL for development
const TEST_PDF_URL = 'https://www.ijirmf.com/wp-content/uploads/IJIRMF201908054.pdf';
const TEST_PDF_PROXY_URL = `/api/pdf/proxy?url=${encodeURIComponent(TEST_PDF_URL)}`;

export function MagazineViewer({ pdfUrl, issueNumber, date }: MagazineViewerProps) {
  const { engine, isLoading: isEngineLoading } = usePdfiumEngine();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Use test URL for now; swap to pdfUrl for production
  const resolvedUrl = TEST_PDF_PROXY_URL;

  const plugins = useMemo(() => createViewerPlugins(resolvedUrl), [resolvedUrl]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Engine loading state
  if (isEngineLoading || !engine) {
    return <ViewerLoadingState message="جاري تحميل محرك العرض..." />;
  }

  return (
    <div className="viewer-root">
      <EmbedPDF engine={engine} plugins={plugins}>
        {({ activeDocumentId }) =>
          activeDocumentId ? (
            <DocumentContent documentId={activeDocumentId}>
              {({ isLoaded }) =>
                isLoaded ? (
                  <ViewerLayout
                    documentId={activeDocumentId}
                    issueNumber={issueNumber}
                    date={date}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={toggleSidebar}
                  />
                ) : (
                  <ViewerLoadingState message="جاري تحميل المجلة..." />
                )
              }
            </DocumentContent>
          ) : (
            <ViewerLoadingState message="جاري فتح المستند..." />
          )
        }
      </EmbedPDF>
    </div>
  );
}

/**
 * Inner layout component — must be rendered inside <EmbedPDF> and <DocumentContent>
 * so that the embedpdf hooks (useZoom, useScroll) have access to the plugin context.
 */
function ViewerLayout({
  documentId,
  issueNumber,
  date,
  isSidebarOpen,
  onToggleSidebar,
}: {
  documentId: string;
  issueNumber: string;
  date?: string;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}) {
  const { provides: zoom } = useZoom(documentId);
  const { provides: scroll, state: scrollState } = useScroll(documentId);
  const { provides: pan } = usePan(documentId);
  const [panHoldEnabled, setPanHoldEnabled] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const currentPage = scrollState?.currentPage ?? 1;
  const totalPages = scrollState?.totalPages ?? 0;

  // Double-click to toggle zoom
  const handleDoubleClick = useCallback(() => {
    if (!zoom) return;
    const zoomState = zoom as any;
    // Toggle between FitPage and 2x zoom
    zoom.requestZoom(ZoomMode.FitPage);
  }, [zoom]);

  // Pan hold state sync
  useEffect(() => {
    if (!panHoldEnabled) {
      pan?.disablePan();
    }
  }, [panHoldEnabled, pan]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageUp':
          e.preventDefault();
          if (currentPage > 1 && scroll) {
            scroll.scrollToPage({ pageNumber: currentPage - 1 });
          }
          break;
        case 'ArrowLeft':
        case 'PageDown':
          e.preventDefault();
          if (currentPage < totalPages && scroll) {
            scroll.scrollToPage({ pageNumber: currentPage + 1 });
          }
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoom?.zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoom?.zoomOut();
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            e.preventDefault();
            document.exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, zoom, scroll]);

  const handleViewportPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!panHoldEnabled || event.button !== 0) return;
      pan?.enablePan();
    },
    [panHoldEnabled, pan],
  );

  const handleViewportPointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!panHoldEnabled) return;
      pan?.disablePan();
    },
    [panHoldEnabled, pan],
  );

  return (
    <div className="viewer-layout" ref={viewerRef}>
      {/* Thumbnail sidebar */}
      <ThumbnailSidebar
        documentId={documentId}
        isOpen={isSidebarOpen}
        currentPage={currentPage}
      />

      {/* Main viewport area */}
      <div className="viewer-main">
        <GlobalPointerProvider
          documentId={documentId}
          onPointerDown={handleViewportPointerDown}
          onPointerUp={handleViewportPointerUp}
          onPointerLeave={handleViewportPointerUp}
          onPointerCancel={handleViewportPointerUp}
        >
          <Viewport
            documentId={documentId}
            style={{ backgroundColor: '#d0e8f2'}}
            className={`viewer-viewport ${panHoldEnabled ? 'viewer-viewport-pan' : 'viewer-viewport-pointer'}`}
            onDoubleClick={handleDoubleClick}
          >
            <div className="viewer-center-wrap">
              <ZoomGestureWrapper documentId={documentId}>
                <Scroller
                  documentId={documentId}
                  renderPage={({ width, height, pageIndex }) => (
                    <Rotate documentId={documentId} pageIndex={pageIndex}>
                      <PagePointerProvider
                        documentId={documentId}
                        pageIndex={pageIndex}
                      >
                        <div
                          style={{ width, height }}
                          className="viewer-page"
                        >
                          <RenderLayer
                            documentId={documentId}
                            pageIndex={pageIndex}
                            className="viewer-page-image"
                          />
                          <MarqueeZoom
                            documentId={documentId}
                            pageIndex={pageIndex}
                          />
                          <MarqueeCapture
                            documentId={documentId}
                            pageIndex={pageIndex}
                          />
                        </div>
                      </PagePointerProvider>
                    </Rotate>
                  )}
                />
              </ZoomGestureWrapper>
            </div>
          </Viewport>
        </GlobalPointerProvider>

        {/* Floating toolbar */}
          <ViewerToolbar
            documentId={documentId}
            issueNumber={issueNumber}
            date={date}
            totalPages={totalPages}
            currentPage={currentPage}
            onToggleSidebar={onToggleSidebar}
            isSidebarOpen={isSidebarOpen}
            isPanHoldEnabled={panHoldEnabled}
            onPanHoldChange={setPanHoldEnabled}
          />
      </div>
    </div>
  );
}
