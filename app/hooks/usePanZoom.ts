import { useRef, useCallback, useState, useEffect } from "react";

interface PanZoomState {
  scale: number;
  translateX: number;
  translateY: number;
}

interface UsePanZoomOptions {
  minScale?: number;
  maxScale?: number;
  zoomStep?: number;
  enabled?: boolean;
}

interface UsePanZoomReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  transform: PanZoomState;
  isDragging: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setScale: (scale: number) => void;
}

/**
 * Production-grade pan/zoom hook with pointer events and double-click zoom
 * Uses GPU-accelerated transforms and RAF for smooth 60fps performance
 */
export function usePanZoom(options: UsePanZoomOptions = {}): UsePanZoomReturn {
  const {
    minScale = 0.5,
    maxScale = 3.0,
    zoomStep = 0.2,
    enabled = true,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<PanZoomState>({
    scale: 0.5,
    translateX: 0,
    translateY: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  // Refs for drag state (no re-renders)
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    translateX: 0,
    translateY: 0,
  });

  // RAF handle for smooth updates
  const rafHandle = useRef<number | null>(null);
  
  // Previous scale for double-click toggle
  const previousScale = useRef(0.5);
  
  // Last click time for double-click detection
  const lastClickTime = useRef(0);

  /**
   * Update transform with RAF for smooth 60fps
   */
  const updateTransform = useCallback((newTransform: Partial<PanZoomState>) => {
    setTransform((prev) => ({ ...prev, ...newTransform }));
  }, []);

  /**
   * Pointer down handler - start dragging
   */
  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (!enabled || !containerRef.current) return;
    
    // Only handle primary button/touch
    if (e.button !== 0 && e.pointerType === "mouse") return;

    // Don't interfere with text selection or inputs
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
      return;
    }

    e.preventDefault();
    
    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      translateX: transform.translateX,
      translateY: transform.translateY,
    };

    setIsDragging(true);
    containerRef.current.setPointerCapture(e.pointerId);
  }, [enabled, transform.translateX, transform.translateY]);

  /**
   * Pointer move handler - pan the view
   */
  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragState.current.isDragging) return;

    e.preventDefault();

    const deltaX = e.clientX - dragState.current.lastX;
    const deltaY = e.clientY - dragState.current.lastY;

    dragState.current.lastX = e.clientX;
    dragState.current.lastY = e.clientY;

    // Use RAF for smooth updates
    if (rafHandle.current) {
      cancelAnimationFrame(rafHandle.current);
    }

    rafHandle.current = requestAnimationFrame(() => {
      const newTranslateX = transform.translateX + deltaX;
      const newTranslateY = transform.translateY + deltaY;

      // Apply boundary constraints
      // Allow panning up to 25% of the viewport size in any direction
      const container = containerRef.current;
      if (container) {
        const maxPanX = container.clientWidth * 0.25;
        const maxPanY = container.clientHeight * 0.25;

        const clampedX = Math.max(-maxPanX, Math.min(maxPanX, newTranslateX));
        const clampedY = Math.max(-maxPanY, Math.min(maxPanY, newTranslateY));

        updateTransform({
          translateX: clampedX,
          translateY: clampedY,
        });
      } else {
        updateTransform({
          translateX: newTranslateX,
          translateY: newTranslateY,
        });
      }
    });
  }, [transform.translateX, transform.translateY, updateTransform]);

  /**
   * Pointer up handler - end dragging
   */
  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (!dragState.current.isDragging) return;

    dragState.current.isDragging = false;
    setIsDragging(false);

    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  }, []);

  /**
   * Double-click zoom - zoom at cursor position
   */
  const handleDoubleClick = useCallback((e: MouseEvent | PointerEvent) => {
    if (!enabled || !containerRef.current) return;

    e.preventDefault();

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Calculate point relative to container
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Point in content space (before zoom)
    const contentX = (clientX - transform.translateX) / transform.scale;
    const contentY = (clientY - transform.translateY) / transform.scale;

    // Toggle zoom
    const isZoomedIn = transform.scale > 1;
    const newScale = isZoomedIn ? previousScale.current : Math.min(transform.scale + zoomStep * 2, maxScale);

    if (!isZoomedIn) {
      previousScale.current = transform.scale;
    }

    // Calculate new translate to keep point under cursor
    const newTranslateX = clientX - contentX * newScale;
    const newTranslateY = clientY - contentY * newScale;

    updateTransform({
      scale: newScale,
      translateX: newTranslateX,
      translateY: newTranslateY,
    });
  }, [enabled, transform, zoomStep, maxScale, updateTransform]);

  /**
   * Click handler for double-click detection
   */
  const handleClick = useCallback((e: MouseEvent) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime.current;

    if (timeSinceLastClick < 300) {
      // Double click detected
      handleDoubleClick(e);
    }

    lastClickTime.current = now;
  }, [handleDoubleClick]);

  /**
   * Zoom in centered
   */
  const zoomIn = useCallback(() => {
    const newScale = Math.min(transform.scale + zoomStep, maxScale);
    updateTransform({ scale: newScale });
  }, [transform.scale, zoomStep, maxScale, updateTransform]);

  /**
   * Zoom out centered
   */
  const zoomOut = useCallback(() => {
    const newScale = Math.max(transform.scale - zoomStep, minScale);
    updateTransform({ scale: newScale });
  }, [transform.scale, zoomStep, minScale, updateTransform]);

  /**
   * Reset zoom and pan
   */
  const resetZoom = useCallback(() => {
    updateTransform({
      scale: 0.5,
      translateX: 0,
      translateY: 0,
    });
    previousScale.current = 0.5;
  }, [updateTransform]);

  /**
   * Set specific scale
   */
  const setScale = useCallback((scale: number) => {
    const clampedScale = Math.max(minScale, Math.min(scale, maxScale));
    updateTransform({ scale: clampedScale });
  }, [minScale, maxScale, updateTransform]);

  /**
   * Setup pointer event listeners
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    // Type-safe event handler wrappers
    const pointerDownHandler = (e: Event) => handlePointerDown(e as PointerEvent);
    const pointerMoveHandler = (e: Event) => handlePointerMove(e as PointerEvent);
    const pointerUpHandler = (e: Event) => handlePointerUp(e as PointerEvent);
    const clickHandler = (e: Event) => handleClick(e as MouseEvent);

    // Add pointer event listeners
    container.addEventListener("pointerdown", pointerDownHandler);
    container.addEventListener("pointermove", pointerMoveHandler);
    container.addEventListener("pointerup", pointerUpHandler);
    container.addEventListener("pointercancel", pointerUpHandler);
    container.addEventListener("click", clickHandler);

    // Cleanup
    return () => {
      container.removeEventListener("pointerdown", pointerDownHandler);
      container.removeEventListener("pointermove", pointerMoveHandler);
      container.removeEventListener("pointerup", pointerUpHandler);
      container.removeEventListener("pointercancel", pointerUpHandler);
      container.removeEventListener("click", clickHandler);

      if (rafHandle.current) {
        cancelAnimationFrame(rafHandle.current);
      }
    };
  }, [enabled, handlePointerDown, handlePointerMove, handlePointerUp, handleClick]);

  return {
    containerRef,
    transform,
    isDragging,
    zoomIn,
    zoomOut,
    resetZoom,
    setScale,
  };
}
