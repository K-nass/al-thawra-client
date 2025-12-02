import { useEffect, useRef, useCallback } from "react";

interface UseDragScrollOptions {
  /**
   * Whether drag scrolling is enabled
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Scroll speed multiplier
   * @default 1
   */
  speed?: number;
}

/**
 * Custom hook for implementing click-and-drag scrolling
 * Supports both mouse and touch events for desktop and mobile
 */
export function useDragScroll(options: UseDragScrollOptions = {}) {
  const { enabled = true, speed = 1 } = options;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!enabled || !containerRef.current) return;
    
    // Only start drag on left mouse button
    if (e.button !== 0) return;
    
    isDragging.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    startY.current = e.pageY - containerRef.current.offsetTop;
    scrollLeft.current = containerRef.current.scrollLeft;
    scrollTop.current = containerRef.current.scrollTop;
    
    // Change cursor
    containerRef.current.style.cursor = "grabbing";
    containerRef.current.style.userSelect = "none";
  }, [enabled]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    
    e.preventDefault();
    
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - startX.current) * speed;
    const walkY = (y - startY.current) * speed;
    
    containerRef.current.scrollLeft = scrollLeft.current - walkX;
    containerRef.current.scrollTop = scrollTop.current - walkY;
  }, [speed]);

  const handleMouseUp = useCallback(() => {
    if (!containerRef.current) return;
    
    isDragging.current = false;
    containerRef.current.style.cursor = "grab";
    containerRef.current.style.userSelect = "";
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || !containerRef.current || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    isDragging.current = true;
    startX.current = touch.pageX - containerRef.current.offsetLeft;
    startY.current = touch.pageY - containerRef.current.offsetTop;
    scrollLeft.current = containerRef.current.scrollLeft;
    scrollTop.current = containerRef.current.scrollTop;
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current || !containerRef.current || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const x = touch.pageX - containerRef.current.offsetLeft;
    const y = touch.pageY - containerRef.current.offsetTop;
    const walkX = (x - startX.current) * speed;
    const walkY = (y - startY.current) * speed;
    
    containerRef.current.scrollLeft = scrollLeft.current - walkX;
    containerRef.current.scrollTop = scrollTop.current - walkY;
  }, [speed]);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    // Set initial cursor
    container.style.cursor = "grab";

    // Mouse events
    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    
    // Touch events
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("touchend", handleTouchEnd);

    // Cleanup
    return () => {
      container.style.cursor = "";
      container.style.userSelect = "";
      
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return containerRef;
}
