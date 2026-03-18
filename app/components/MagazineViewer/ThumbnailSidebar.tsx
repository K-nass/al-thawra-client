import { useScroll } from '@embedpdf/plugin-scroll/react';
import {
  ThumbnailsPane,
  ThumbImg,
} from '@embedpdf/plugin-thumbnail/react';

interface ThumbnailSidebarProps {
  documentId: string;
  isOpen: boolean;
  currentPage: number;
}

export function ThumbnailSidebar({
  documentId,
  isOpen,
  currentPage,
}: ThumbnailSidebarProps) {
  const { provides: scroll } = useScroll(documentId);

  return (
    <aside
      className={`viewer-sidebar ${isOpen ? 'viewer-sidebar-open' : ''}`}
      aria-label="الصور المصغرة للصفحات"
    >
      <div className="viewer-sidebar-inner">
        <div className="viewer-sidebar-header">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
            الصفحات
          </span>
        </div>

        <div className="viewer-sidebar-content">
          <ThumbnailsPane documentId={documentId}>
            {(m) => (
              <div
                key={m.pageIndex}
                style={{
                  position: 'absolute',
                  top: m.top,
                  height: m.wrapperHeight,
                  width: '100%',
                }}
                className="viewer-sidebar-thumb-wrapper"
              >
                <button
                  onClick={() =>
                    scroll?.scrollToPage({ pageNumber: m.pageIndex + 1 })
                  }
                  className={`viewer-sidebar-thumb-btn ${
                    m.pageIndex + 1 === currentPage
                      ? 'viewer-sidebar-thumb-active'
                      : ''
                  }`}
                >
                  <div
                    style={{ width: m.width, height: m.height }}
                    className="viewer-sidebar-thumb-img"
                  >
                    <ThumbImg documentId={documentId} meta={m} />
                  </div>
                  <span className="viewer-sidebar-thumb-label">
                    {m.pageIndex + 1}
                  </span>
                </button>
              </div>
            )}
          </ThumbnailsPane>
        </div>
      </div>
    </aside>
  );
}
