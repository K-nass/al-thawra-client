import { useRef, useState, useCallback, memo, useMemo } from 'react';
import type { ProgressBarProps } from '../types';
import { formatTime } from '../utils/formatTime';
import { debounce, rafThrottle } from '../utils/performanceUtils';
import { HOVER_DEBOUNCE } from '../utils/constants';

function ProgressBarComponent({ 
  currentTime, 
  duration, 
  buffered, 
  onSeek,
  isLive = false,
}: ProgressBarProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);

  const progressPercent = useMemo(
    () => (duration > 0 ? (currentTime / duration) * 100 : 0),
    [currentTime, duration]
  );

  const handleSeek = useCallback((clientX: number) => {
    if (!progressRef.current || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const position = (clientX - rect.left) / rect.width;
    const time = Math.max(0, Math.min(duration, position * duration));
    onSeek(time);
  }, [duration, onSeek]);

  // Use RAF throttling for smooth drag performance
  const handleSeekThrottled = useMemo(() => rafThrottle(handleSeek), [handleSeek]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeek(e.clientX);
  }, [handleSeek]);

  // Debounce hover preview updates for better performance
  const updateHoverPreview = useMemo(
    () =>
      debounce((time: number, position: number) => {
        setHoverTime(time);
        setHoverPosition(position);
      }, HOVER_DEBOUNCE),
    []
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const time = position * duration;

    updateHoverPreview(time, position * 100);

    if (isDragging) {
      handleSeekThrottled(e.clientX);
    }
  }, [duration, isDragging, handleSeekThrottled, updateHoverPreview]);

  const handleMouseLeave = useCallback(() => {
    setHoverTime(null);
    setHoverPosition(null);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches[0]) {
      handleSeek(e.touches[0].clientX);
    }
  }, [handleSeek]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleSeekThrottled(e.touches[0].clientX);
    }
  }, [isDragging, handleSeekThrottled]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (isLive) {
    return (
      <div className="w-full h-1 bg-red-500/20 rounded-full overflow-hidden relative">
        <div className="h-full bg-gradient-to-r from-red-500 to-red-600 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="w-full group/progress">
      {/* Container with stacked bars */}
      <div className="relative w-full space-y-0.5">
        {/* Main Progress Bar */}
        <div
          ref={progressRef}
          className="relative w-full h-1 bg-white/10 rounded-full cursor-pointer overflow-visible
                     group-hover/progress:h-1.5 transition-all duration-200 ease-out"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="slider"
          aria-label="مؤشر التقدم"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          aria-valuetext={`${formatTime(currentTime)} من ${formatTime(duration)}`}
          tabIndex={0}
        >
          {/* Played Progress - Gradient with glow */}
          <div
            className="absolute left-0 top-0 h-full rounded-full transition-all duration-150
                       bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]
                       shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.4)]
                       group-hover/progress:shadow-[0_0_12px_rgba(var(--color-primary-rgb),0.6)]"
            style={{ width: `${progressPercent}%` }}
          >
            {/* Shimmer effect on progress */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/progress:opacity-100 transition-opacity" />
          </div>

          {/* Scrubber Handle - Modern circular handle */}
          <div
            className="absolute top-1/2 w-3.5 h-3.5 -translate-y-1/2 -translate-x-1/2
                       bg-white rounded-full shadow-lg
                       opacity-0 group-hover/progress:opacity-100 
                       scale-0 group-hover/progress:scale-100
                       transition-all duration-200 ease-out
                       ring-2 ring-[var(--color-primary)]/30 ring-offset-1 ring-offset-black/20
                       hover:scale-110"
            style={{ left: `${progressPercent}%` }}
          >
            {/* Inner glow */}
            <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white to-gray-200" />
          </div>

          {/* Hover Preview Tooltip */}
          {hoverTime !== null && hoverPosition !== null && (
            <div
              className="absolute -top-11 transform -translate-x-1/2 
                         px-3 py-1.5 
                         bg-gradient-to-b from-gray-900 to-black
                         text-white text-xs font-semibold rounded-lg
                         pointer-events-none whitespace-nowrap
                         opacity-0 group-hover/progress:opacity-100 
                         transition-opacity duration-200
                         shadow-xl shadow-black/50
                         border border-white/10"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
              {/* Tooltip arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full 
                            w-0 h-0 
                            border-l-[6px] border-l-transparent 
                            border-r-[6px] border-r-transparent 
                            border-t-[6px] border-t-black" />
            </div>
          )}
        </div>

        {/* Buffer/Download Bar - Shown underneath */}
        <div className="relative w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-white/20 to-white/30 rounded-full transition-all duration-300"
            style={{ width: `${buffered}%` }}
          >
            {/* Subtle shimmer on buffer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const ProgressBar = memo(ProgressBarComponent);
