import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { useState, useRef, memo } from 'react';
import type { VolumeControlProps } from '../types';
import { ControlButton } from './ControlButton';

function VolumeControlComponent({ 
  volume, 
  isMuted, 
  onVolumeChange, 
  onToggleMute 
}: VolumeControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX size={20} />;
    }
    if (volume < 0.5) {
      return <Volume1 size={20} />;
    }
    return <Volume2 size={20} />;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
  };

  const displayVolume = isMuted ? 0 : volume;
  const volumePercent = displayVolume * 100;

  return (
    <div 
      className="group/volume flex items-center gap-2"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <ControlButton
        icon={getVolumeIcon()}
        label={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
        onClick={onToggleMute}
      />

      <div
        ref={volumeRef}
        className={`
          relative overflow-hidden transition-all duration-300 ease-out
          ${isExpanded ? 'w-28 opacity-100' : 'w-0 opacity-0'}
        `}
        dir="ltr"
      >
        {/* Custom slider container */}
        <div className="relative h-1 bg-white/10 rounded-full group/slider">
          {/* Filled portion with gradient */}
          <div 
            className="absolute left-0 top-0 h-full rounded-full 
                       bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]
                       shadow-[0_0_6px_rgba(var(--color-primary-rgb),0.4)]
                       transition-all duration-150"
            style={{ width: `${volumePercent}%` }}
          />
          
          {/* Slider thumb */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 -ml-1.5
                       bg-white rounded-full shadow-lg
                       opacity-0 group-hover/slider:opacity-100
                       scale-0 group-hover/slider:scale-100
                       transition-all duration-200
                       ring-2 ring-[var(--color-primary)]/30
                       pointer-events-none"
            style={{ left: `${volumePercent}%` }}
          >
            {/* Inner glow */}
            <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white to-gray-200" />
          </div>

          {/* Native input overlay */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={displayVolume}
            onChange={handleVolumeChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="مستوى الصوت"
            aria-valuemin={0}
            aria-valuemax={1}
            aria-valuenow={volume}
            aria-valuetext={`${Math.round(volume * 100)}%`}
          />
        </div>

        {/* Volume percentage tooltip (on hover) */}
        <div 
          className="absolute -top-8 left-1/2 -translate-x-1/2
                     px-2 py-1 bg-gradient-to-b from-gray-900 to-black
                     text-white text-xs font-semibold rounded
                     opacity-0 group-hover/slider:opacity-100
                     transition-opacity duration-200
                     pointer-events-none whitespace-nowrap
                     shadow-lg border border-white/10"
        >
          {Math.round(volumePercent)}%
        </div>
      </div>
    </div>
  );
}

export const VolumeControl = memo(VolumeControlComponent);
