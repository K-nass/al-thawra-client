import { useEffect, useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import { useMiniViewStore } from '~/stores/miniViewStore';

interface UseMiniViewDragOptions {
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function useMiniViewDrag(options: UseMiniViewDragOptions = {}) {
  const { position, setPosition, setIsDragging } = useMiniViewStore();
  const { onDragStart, onDragEnd } = options;
  
  // Store the current position in a ref to avoid stale closures
  const positionRef = useRef(position);
  
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const bind = useDrag(
    ({ offset: [x, y], dragging, first, last }) => {
      if (first) {
        setIsDragging(true);
        onDragStart?.();
      }

      if (last) {
        setIsDragging(false);
        onDragEnd?.();
      }

      // Viewport boundaries with padding
      const padding = 20;
      const miniViewWidth = 320;
      const miniViewHeight = 600;
      
      const maxX = window.innerWidth - miniViewWidth - padding;
      const maxY = window.innerHeight - miniViewHeight - padding;
      
      // Clamp position within viewport boundaries
      const clampedX = Math.max(padding, Math.min(x, maxX));
      const clampedY = Math.max(padding, Math.min(y, maxY));

      setPosition({ x: clampedX, y: clampedY });
    },
    {
      from: () => [positionRef.current.x, positionRef.current.y],
      bounds: () => {
        const padding = 20;
        const miniViewWidth = 320;
        const miniViewHeight = 600;
        
        return {
          left: padding,
          right: window.innerWidth - miniViewWidth - padding,
          top: padding,
          bottom: window.innerHeight - miniViewHeight - padding,
        };
      },
      rubberband: true, // Elastic bounce effect at edges
    }
  );

  // Generate transform style with optional tilt
  const isDragging = useMiniViewStore((state) => state.isDragging);
  
  const style = {
    transform: isDragging 
      ? `translate(${position.x}px, ${position.y}px) rotate(-2deg) scale(1.02)`
      : `translate(${position.x}px, ${position.y}px)`,
    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    cursor: isDragging ? 'grabbing' : 'grab',
    willChange: 'transform', // GPU acceleration hint
  };

  return { bind, style, isDragging };
}
