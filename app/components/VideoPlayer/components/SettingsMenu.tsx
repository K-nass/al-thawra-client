import { Settings, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { SettingsMenuProps } from '../types';
import { ControlButton } from './ControlButton';

export function SettingsMenu({
  playbackRate,
  availableRates,
  currentQuality,
  availableQualities,
  onPlaybackRateChange,
  onQualityChange,
  isOpen,
  onClose,
}: SettingsMenuProps) {
  const [activePanel, setActivePanel] = useState<'main' | 'speed' | 'quality'>('main');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setActivePanel('main');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSpeedChange = (rate: number) => {
    onPlaybackRateChange(rate);
    onClose();
  };

  const handleQualityChange = (quality: string) => {
    onQualityChange(quality);
    onClose();
  };

  return (
    <div 
      ref={menuRef}
      className="absolute bottom-full left-0 mb-2 w-56 bg-black/95 backdrop-blur-lg rounded-lg shadow-2xl overflow-hidden border border-white/10"
    >
      {/* Main Menu */}
      {activePanel === 'main' && (
        <div className="p-1">
          {availableRates.length > 1 && (
            <button
              type="button"
              onClick={() => setActivePanel('speed')}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded transition-colors"
            >
              <span>سرعة التشغيل</span>
              <span className="text-white/60">{playbackRate}x</span>
            </button>
          )}

          {availableQualities.length > 1 && (
            <button
              type="button"
              onClick={() => setActivePanel('quality')}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded transition-colors"
            >
              <span>الجودة</span>
              <span className="text-white/60">{currentQuality}</span>
            </button>
          )}
        </div>
      )}

      {/* Speed Panel */}
      {activePanel === 'speed' && (
        <div className="p-1">
          <button
            type="button"
            onClick={() => setActivePanel('main')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/10 rounded transition-colors mb-1"
          >
            <span className="text-lg">←</span>
            <span>سرعة التشغيل</span>
          </button>

          <div className="border-t border-white/10 my-1" />

          {availableRates.map(rate => (
            <button
              key={rate}
              type="button"
              onClick={() => handleSpeedChange(rate)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded transition-colors"
            >
              <span>{rate === 1 ? 'عادي' : `${rate}x`}</span>
              {playbackRate === rate && (
                <Check size={16} className="text-[var(--color-primary)]" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Quality Panel */}
      {activePanel === 'quality' && (
        <div className="p-1">
          <button
            type="button"
            onClick={() => setActivePanel('main')}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/10 rounded transition-colors mb-1"
          >
            <span className="text-lg">←</span>
            <span>الجودة</span>
          </button>

          <div className="border-t border-white/10 my-1" />

          {availableQualities.map(quality => (
            <button
              key={quality}
              type="button"
              onClick={() => handleQualityChange(quality)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded transition-colors"
            >
              <span>{quality}</span>
              {currentQuality === quality && (
                <Check size={16} className="text-[var(--color-primary)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface SettingsButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function SettingsButton({ onClick, isOpen }: SettingsButtonProps) {
  return (
    <ControlButton
      icon={<Settings size={20} className={isOpen ? 'animate-spin-slow' : ''} />}
      label="الإعدادات"
      onClick={onClick}
      active={isOpen}
    />
  );
}
