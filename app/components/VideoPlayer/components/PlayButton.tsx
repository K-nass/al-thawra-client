import { Play, Pause } from 'lucide-react';
import { ControlButton } from './ControlButton';
import { memo } from 'react';

interface PlayButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
}

function PlayButtonComponent({ isPlaying, onToggle, size = 'md' }: PlayButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <ControlButton
      icon={isPlaying ? <Pause size={iconSizes[size]} /> : <Play size={iconSizes[size]} className="mr-0.5" />}
      label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
      onClick={onToggle}
      className={sizeClasses[size]}
    />
  );
}

export const PlayButton = memo(PlayButtonComponent);
