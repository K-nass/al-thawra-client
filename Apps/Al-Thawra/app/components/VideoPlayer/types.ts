export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  initialVolume?: number;
  initialPlaybackRate?: number;
  sources?: VideoSource[];
  tracks?: VideoTrack[];
  className?: string;
  videoClassName?: string;
  showControls?: boolean;
  showSettings?: boolean;
  enablePiP?: boolean;
  enableKeyboard?: boolean;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onProgress?: (buffered: number) => void;
  onError?: (error: MediaError | null) => void;
  onVolumeChange?: (volume: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onQualityChange?: (quality: string) => void;
}

export interface VideoSource {
  src: string;
  quality: string;
  type?: string;
}

export interface VideoTrack {
  src: string;
  kind: 'subtitles' | 'captions' | 'descriptions';
  srcLang: string;
  label: string;
  default?: boolean;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isPiP: boolean;
  isTheaterMode: boolean;
  isBuffering: boolean;
  isLoading: boolean;
  error: string | null;
  currentQuality: string;
  showControls: boolean;
  showSettings: boolean;
}

export interface VideoPlayerControls {
  play: () => Promise<void>;
  pause: () => void;
  togglePlayPause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleFullscreen: () => void;
  togglePiP: () => Promise<void>;
  toggleTheaterMode: () => void;
  changeQuality: (quality: string) => void;
  showControlsTemporarily: () => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered: number;
  onSeek: (time: number) => void;
  isLive?: boolean;
}

export interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

export interface SettingsMenuProps {
  playbackRate: number;
  availableRates: number[];
  currentQuality: string;
  availableQualities: string[];
  onPlaybackRateChange: (rate: number) => void;
  onQualityChange: (quality: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export interface ControlButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  className?: string;
}
