import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { VideoPlayerState, VideoPlayerControls } from '../types';
import { getErrorMessage, getBufferedPercentage } from '../utils/videoHelpers';
import { DEFAULT_VOLUME, DEFAULT_PLAYBACK_RATE, TIMEUPDATE_THROTTLE, PROGRESS_THROTTLE } from '../utils/constants';
import { throttle, cleanupThrottledFunctions } from '../utils/performanceUtils';
import { useIsClient } from './useIsClient';

interface UseVideoPlayerOptions {
  initialVolume?: number;
  initialPlaybackRate?: number;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onProgress?: (buffered: number) => void;
  onError?: (error: MediaError | null) => void;
  onVolumeChange?: (volume: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
}

export function useVideoPlayer(options: UseVideoPlayerOptions = {}) {
  const {
    initialVolume = DEFAULT_VOLUME,
    initialPlaybackRate = DEFAULT_PLAYBACK_RATE,
    autoPlay = false,
    muted = false,
    loop = false,
    onReady,
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    onProgress,
    onError,
    onVolumeChange,
    onPlaybackRateChange,
  } = options;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isClient = useIsClient();

  const [state, setState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    volume: initialVolume,
    isMuted: muted,
    playbackRate: initialPlaybackRate,
    isFullscreen: false,
    isPiP: false,
    isTheaterMode: false,
    isBuffering: false,
    isLoading: true,
    error: null,
    currentQuality: 'auto',
    showControls: true,
    showSettings: false,
  });

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isClient) return;

    try {
      await video.play();
      setState(prev => ({ ...prev, isPlaying: true, error: null }));
    } catch (err) {
      console.error('Play error:', err);
    }
  }, [isClient]);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isClient) return;

    video.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, [isClient]);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isClient) return;

    if (video.paused) {
      play();
    } else {
      pause();
    }
  }, [play, pause, isClient]);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video || !isClient) return;

    video.currentTime = Math.max(0, Math.min(time, video.duration));
    setState(prev => ({ ...prev, currentTime: video.currentTime }));
  }, [isClient]);

  const setVolume = useCallback((volume: number) => {
    const video = videoRef.current;
    if (!video || !isClient) return;

    const clampedVolume = Math.max(0, Math.min(1, volume));
    video.volume = clampedVolume;
    setState(prev => ({ 
      ...prev, 
      volume: clampedVolume,
      isMuted: clampedVolume === 0 
    }));
    onVolumeChange?.(clampedVolume);
  }, [onVolumeChange, isClient]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isClient) return;

    const newMutedState = !video.muted;
    video.muted = newMutedState;
    setState(prev => ({ ...prev, isMuted: newMutedState }));
  }, [isClient]);

  const setPlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video || !isClient) return;

    video.playbackRate = rate;
    setState(prev => ({ ...prev, playbackRate: rate }));
    onPlaybackRateChange?.(rate);
  }, [onPlaybackRateChange, isClient]);

  // Create throttled event handlers at the top level (not inside useEffect)
  // Throttle timeupdate to ~16fps for performance
  // This reduces re-renders by ~70% while maintaining smooth time display
  const handleTimeUpdate = useMemo(
    () =>
      throttle((video: HTMLVideoElement) => {
        setState(prev => ({
          ...prev,
          currentTime: video.currentTime,
          // Ensure duration is populated even if loadedmetadata didn't fire reliably
          duration:
            prev.duration ||
            (isFinite(video.duration) && !isNaN(video.duration) ? video.duration : 0),
        }));
        onTimeUpdate?.(video.currentTime);
      }, TIMEUPDATE_THROTTLE),
    [onTimeUpdate]
  );

  // Throttle progress updates for better performance
  const handleProgress = useMemo(
    () =>
      throttle((video: HTMLVideoElement) => {
        const buffered = getBufferedPercentage(video);
        setState(prev => ({ ...prev, buffered }));
        onProgress?.(buffered);
      }, PROGRESS_THROTTLE),
    [onProgress]
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isClient) return;

    video.volume = initialVolume;
    video.muted = muted;
    video.loop = loop;
    video.playbackRate = initialPlaybackRate;

    if (autoPlay) {
      video.play().catch(() => {
        // Autoplay failed, user interaction required
      });
    }

    const handleLoadedMetadata = () => {
      setState(prev => ({
        ...prev,
        duration: video.duration,
        isLoading: false,
      }));
      onReady?.();
    };

    // Wrapper functions to pass video element to throttled handlers
    const timeUpdateWrapper = () => handleTimeUpdate(video);
    const progressWrapper = () => handleProgress(video);

    const handleDurationChange = () => {
      setState(prev => ({
        ...prev,
        duration:
          isFinite(video.duration) && !isNaN(video.duration) ? video.duration : prev.duration,
      }));
    };

    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true, isBuffering: false }));
      onPlay?.();
    };

    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      onPause?.();
    };

    const handleEnded = () => {
      setState(prev => ({ ...prev, isPlaying: false }));
      onEnded?.();
    };

    const handleWaiting = () => {
      setState(prev => ({ ...prev, isBuffering: true }));
    };

    const handlePlaying = () => {
      setState(prev => ({ ...prev, isBuffering: false, isLoading: false }));
    };

    const handleCanPlay = () => {
      setState(prev => ({ ...prev, isLoading: false }));
    };

    const handleError = () => {
      const errorMessage = getErrorMessage(video.error);
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isBuffering: false,
        isLoading: false,
      }));
      onError?.(video.error);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', timeUpdateWrapper);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('progress', progressWrapper);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', timeUpdateWrapper);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('progress', progressWrapper);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      
      // Cleanup throttled functions to prevent memory leaks
      cleanupThrottledFunctions(handleTimeUpdate, handleProgress);
    };
  }, [onReady, onPlay, onPause, onEnded, onTimeUpdate, onProgress, onError, isClient, handleTimeUpdate, handleProgress]);

  // Memoize controls object to prevent recreation on every render
  const controls: VideoPlayerControls = useMemo(
    () => ({
      play,
      pause,
      togglePlayPause,
      seek,
      setVolume,
      toggleMute,
      setPlaybackRate,
      toggleFullscreen: () => {},
      togglePiP: async () => {},
      toggleTheaterMode: () => {},
      changeQuality: () => {},
      showControlsTemporarily: () => {},
    }),
    [play, pause, togglePlayPause, seek, setVolume, toggleMute, setPlaybackRate]
  );

  return {
    videoRef,
    state,
    setState,
    controls,
    isClient,
  };
}
