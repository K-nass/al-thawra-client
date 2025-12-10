import { ERROR_MESSAGES } from './constants';

export function getErrorMessage(error: MediaError | null): string {
  if (!error) return ERROR_MESSAGES.UNKNOWN;

  switch (error.code) {
    case MediaError.MEDIA_ERR_ABORTED:
      return ERROR_MESSAGES.ABORTED;
    case MediaError.MEDIA_ERR_NETWORK:
      return ERROR_MESSAGES.NETWORK;
    case MediaError.MEDIA_ERR_DECODE:
      return ERROR_MESSAGES.DECODE;
    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
      return ERROR_MESSAGES.SRC_NOT_SUPPORTED;
    default:
      return error.message || ERROR_MESSAGES.UNKNOWN;
  }
}

export function getBufferedPercentage(video: HTMLVideoElement): number {
  if (!video.buffered.length || !video.duration) return 0;

  const bufferedEnd = video.buffered.end(video.buffered.length - 1);
  return (bufferedEnd / video.duration) * 100;
}

export function getBufferedRanges(video: HTMLVideoElement): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = [];
  
  for (let i = 0; i < video.buffered.length; i++) {
    ranges.push({
      start: video.buffered.start(i),
      end: video.buffered.end(i),
    });
  }
  
  return ranges;
}

export function isVideoPlaying(video: HTMLVideoElement): boolean {
  return !video.paused && !video.ended && video.readyState > 2;
}

export function canAutoPlay(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  const canPlay = document.createElement('video').play();
  
  if (canPlay instanceof Promise) {
    return true;
  }
  
  return false;
}

export function supportsFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  
  return !!(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  );
}

export function supportsPiP(): boolean {
  if (typeof document === 'undefined') return false;
  
  return 'pictureInPictureEnabled' in document;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
