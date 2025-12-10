import { memo, useMemo } from 'react';
import { formatTime } from '../utils/formatTime';

interface TimeDisplayProps {
  currentTime: number;
  duration: number;
}

function TimeDisplayComponent({ currentTime, duration }: TimeDisplayProps) {
  // Memoize formatted time strings to avoid recalculating on every render
  const formattedCurrent = useMemo(() => formatTime(currentTime), [currentTime]);
  const formattedDuration = useMemo(() => {
    // Handle invalid duration values
    if (!duration || !isFinite(duration) || isNaN(duration)) {
      return '0:00';
    }
    return formatTime(duration);
  }, [duration]);

  return (
    <div 
      className="flex items-center gap-1 text-white text-sm font-medium tabular-nums select-none"
      suppressHydrationWarning
    >
      <span className="text-white">{formattedCurrent}</span>
      <span className="text-white/70">/</span>
      <span className="text-white/90">{formattedDuration}</span>
    </div>
  );
}

export const TimeDisplay = memo(TimeDisplayComponent);
