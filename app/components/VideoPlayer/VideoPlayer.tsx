import { useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import type { VideoPlayerProps } from './types';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import { useVideoControls } from './hooks/useVideoControls';
import { useFullscreen } from './hooks/useFullscreen';
import { usePictureInPicture } from './hooks/usePictureInPicture';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Controls } from './components/Controls';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorOverlay } from './components/ErrorOverlay';
import { useMiniViewStore } from '~/stores/miniViewStore';

export function VideoPlayer({
  src,
  poster,
  title = 'Video',
  autoPlay = false,
  muted = false,
  loop = false,
  preload = 'metadata',
  initialVolume = 0.8,
  initialPlaybackRate = 1,
  sources = [],
  tracks = [],
  className = '',
  videoClassName = '',
  showControls: showControlsProp = true,
  showSettings: showSettingsProp = true,
  enablePiP = true,
  enableKeyboard = true,
  onReady,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onProgress,
  onError,
  onVolumeChange,
  onPlaybackRateChange,
  onQualityChange,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { videoRef, state, setState, controls: baseControls, isClient } = useVideoPlayer({
    initialVolume,
    initialPlaybackRate,
    autoPlay,
    muted,
    loop,
    onReady,
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    onProgress,
    onError,
    onVolumeChange,
    onPlaybackRateChange,
  });

  const {
    showControls,
    isTheaterMode,
    showSettings,
    showControlsTemporarily,
    handleMouseMove,
    handleMouseLeave,
    handleMouseEnter,
    toggleTheaterMode,
    toggleSettings,
    setShowSettings,
  } = useVideoControls();

  const { isFullscreen, toggleFullscreen, isSupported: isFullscreenSupported } = useFullscreen(containerRef);
  const { isPiP, togglePiP, isSupported: isPiPSupported } = usePictureInPicture(videoRef);

  // Mini View integration
  const {
    isActive: isMiniViewActive,
    setVideoElement,
    deactivate: deactivateMiniView,
    activationCount,
  } = useMiniViewStore();

  // Sync video element to Mini View store when active OR when video ref changes
  useEffect(() => {
    if (videoRef.current) {
      console.log('VideoPlayer - Setting video element in store:', videoRef.current);
      setVideoElement(videoRef.current);
    }
  }, [videoRef.current, setVideoElement]);

  // Clear video element from store when component unmounts (only if Mini View is not active)
  useEffect(() => {
    return () => {
      // Don't clear if Mini View is active - let Mini View manage its own lifecycle
      if (!isMiniViewActive) {
        console.log('VideoPlayer - Clearing video element from store');
        setVideoElement(null);
      } else {
        console.log('VideoPlayer - Not clearing video element (Mini View is active)');
      }
    };
  }, [setVideoElement, isMiniViewActive]);

  // Additional safety: on second and subsequent Mini View activations, ensure the
  // main video element is paused so both cannot play together.
  useEffect(() => {
    const isSubsequentActivation = activationCount > 1;

    if (isMiniViewActive && isSubsequentActivation && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      console.log('VideoPlayer - main video paused because Mini View is active');
    }
  }, [isMiniViewActive, activationCount, videoRef]);

  const changeQuality = (quality: string) => {
    setState(prev => ({ ...prev, currentQuality: quality }));
    onQualityChange?.(quality);
  };

  // Ensure only one player is active: if Mini View is active, toggling play from the main
  // player should first deactivate Mini View (its cleanup will restore playback to main).
  const guardedTogglePlayPause = () => {
    if (isMiniViewActive) {
      deactivateMiniView();
      return;
    }

    baseControls.togglePlayPause();
  };

  const enhancedControls = {
    ...baseControls,
    togglePlayPause: guardedTogglePlayPause,
    toggleFullscreen,
    togglePiP,
    toggleTheaterMode,
    changeQuality,
    showControlsTemporarily,
  };

  const enhancedState = {
    ...state,
    isFullscreen,
    isPiP,
    isTheaterMode,
    showControls,
    showSettings,
  };

  useKeyboardShortcuts({
    enabled: enableKeyboard,
    controls: enhancedControls,
    state: enhancedState,
    containerRef,
  });

  const handleContainerClick = () => {
    enhancedControls.togglePlayPause();
  };

  const handleRetry = () => {
    if (videoRef.current) {
      setState(prev => ({ ...prev, error: null, isLoading: true }));
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  const availableQualities = sources.length > 0 
    ? sources.map(s => s.quality) 
    : ['auto'];

  return (
    <div
      ref={containerRef}
      className={`
        video-player-container
        relative w-full overflow-hidden bg-black rounded-xl
        ${isTheaterMode ? 'aspect-[21/9]' : 'aspect-video'}
        ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}
        ${className}
      `}
      onMouseMove={state.isPlaying ? handleMouseMove : undefined}
      onMouseLeave={state.isPlaying ? handleMouseLeave : undefined}
      onMouseEnter={handleMouseEnter}
      role="region"
      aria-label={title}
      tabIndex={0}
    >
      {/* Mini View Placeholder */}
      {isMiniViewActive && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-center text-white/60">
            <p className="text-lg mb-2">الفيديو يعمل في وضع العرض المصغر</p>
            <p className="text-sm">يمكنك سحب النافذة المصغرة إلى أي مكان</p>
          </div>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        className={`w-full h-full object-contain cursor-pointer ${isMiniViewActive ? 'hidden' : ''} ${videoClassName}`}
        src={src}
        poster={poster}
        loop={loop}
        playsInline
        preload={preload}
        controls={false}
        aria-label={title}
        onClick={handleContainerClick}
      >
        {tracks.map((track, index) => (
          <track
            key={index}
            kind={track.kind}
            src={track.src}
            srcLang={track.srcLang}
            label={track.label}
            default={track.default}
          />
        ))}
        متصفحك لا يدعم تشغيل الفيديو.
      </video>

      {/* Center Play Button (when paused) */}
      {!state.isPlaying && !state.error && !state.isLoading && isClient && (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer group/play"
          onClick={handleContainerClick}
        >
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 w-24 h-24 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2
                          rounded-full bg-[var(--color-primary)]/20 blur-2xl 
                          group-hover/play:bg-[var(--color-primary)]/30 transition-all duration-500" />
            
            {/* Main button */}
            <div className="relative w-20 h-20 rounded-full 
                          bg-gradient-to-br from-white/10 to-white/5
                          backdrop-blur-md
                          border border-white/20
                          flex items-center justify-center 
                          shadow-2xl shadow-black/50
                          transition-all duration-300 
                          group-hover/play:scale-110 
                          group-hover/play:border-white/30
                          group-hover/play:shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.6)]">
              {/* Inner gradient circle */}
              <div className="absolute inset-2 rounded-full 
                            bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)]
                            opacity-90 group-hover/play:opacity-100
                            transition-opacity duration-300" />
              
              {/* Play icon */}
              <Play size={32} className="relative z-10 text-white fill-white ml-1 
                                       drop-shadow-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {state.isLoading && !state.error && <LoadingSpinner />}

      {/* Buffering Indicator */}
      {state.isBuffering && !state.error && !state.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Error Overlay */}
      {state.error && <ErrorOverlay message={state.error} onRetry={handleRetry} />}

      {/* Controls */}
      {showControlsProp && isClient && !state.error && (
        <div 
          className={`
            transition-opacity duration-300
            ${showControls || !state.isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
        >
          <Controls
            state={enhancedState}
            controls={enhancedControls}
            showSettings={showSettings}
            onToggleSettings={toggleSettings}
            availableQualities={availableQualities}
            isPiPSupported={enablePiP && isPiPSupported}
            isFullscreenSupported={isFullscreenSupported}
            videoSrc={src}
            videoPoster={poster}
            videoTitle={title}
          />
        </div>
      )}

      {/* Loading Overlay (Initial) */}
      {!isClient && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
