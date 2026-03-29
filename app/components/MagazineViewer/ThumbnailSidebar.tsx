/**
 * ThumbnailSidebar — Virtualized page thumbnail panel
 *
 * Renders small preview images from the pre-rendered DataURL array.
 * Uses @tanstack/react-virtual for efficient rendering of large page counts.
 * Auto-scrolls to the active page when it changes.
 */

import { useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { X } from 'lucide-react';

interface ThumbnailSidebarProps {
  pages: string[];
  currentPage: number;
  isOpen: boolean;
  onGoToPage: (index: number) => void;
}

const THUMB_HEIGHT = 140;
const THUMB_GAP = 12;
const ITEM_SIZE = THUMB_HEIGHT + THUMB_GAP;

export function ThumbnailSidebar({
  pages,
  currentPage,
  isOpen,
  onGoToPage,
}: ThumbnailSidebarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: pages.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ITEM_SIZE,
    overscan: 4,
  });

  // Auto-scroll to keep active thumbnail visible
  useEffect(() => {
    if (isOpen && pages.length > 0) {
      virtualizer.scrollToIndex(currentPage, { align: 'center' });
    }
  }, [currentPage, isOpen, pages.length, virtualizer]);

  return (
    <aside
      className={`viewer-sidebar ${isOpen ? 'viewer-sidebar-open' : ''}`}
      aria-label="الصور المصغرة للصفحات"
    >
      <div className="viewer-sidebar-inner">
        <div className="viewer-sidebar-header">
          <span className="viewer-sidebar-title">الصفحات</span>
          <span className="viewer-sidebar-count">{pages.length}</span>
        </div>

        <div className="viewer-sidebar-content" ref={scrollRef}>
          <div
            style={{
              height: virtualizer.getTotalSize(),
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const pageIndex = virtualItem.index;
              const isActive = pageIndex === currentPage;

              return (
                <div
                  key={pageIndex}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: virtualItem.size,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  className="viewer-sidebar-thumb-wrapper"
                >
                  <button
                    onClick={() => onGoToPage(pageIndex)}
                    className={`viewer-sidebar-thumb-btn ${
                      isActive ? 'viewer-sidebar-thumb-active' : ''
                    }`}
                    aria-label={`الصفحة ${pageIndex + 1}`}
                    aria-current={isActive ? 'page' : undefined}
                    type="button"
                  >
                    <div className="viewer-sidebar-thumb-img">
                      <img
                        src={pages[pageIndex]}
                        alt={`صفحة ${pageIndex + 1}`}
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                    <span className="viewer-sidebar-thumb-label">
                      {pageIndex + 1}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
