import { useEffect, useRef, useState } from 'react';
import { X, Play, Pause, CornerUpLeft } from 'lucide-react';
import { useMiniViewStore } from '~/stores/miniViewStore';
import './miniView.css';

export function MiniViewiPhoneFrame() {
  const { videoElement, videoData, deactivate, activationCount } = useMiniViewStore();
  const miniVideoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const hasInitializedRef = useRef(false);

  // Debug logging
  useEffect(() => {
    console.log('MiniViewiPhoneFrame - videoData:', videoData, 'videoElement:', videoElement, 'hasInitialized:', hasInitializedRef.current);
  }, [videoData, videoElement]);

  // Initialize Mini View video
  // - First activation: try to resume from original video element
  // - Subsequent activations: restart from 0 using videoData.src
  // In all cases: show video immediately (no waiting for loadeddata)
  useEffect(() => {
    if (!miniVideoRef.current || !videoData || hasInitializedRef.current) {
      return;
    }

    const miniVideo = miniVideoRef.current;
    const originalVideo = videoElement;
    const isFirstActivation = activationCount <= 1;

    console.log('Initializing Mini View video (simplified)');
    console.log('Activation count:', activationCount, 'hasOriginal:', !!originalVideo);

    if (isFirstActivation && originalVideo) {
      console.log('Mini View - first activation, resuming from original video');
      miniVideo.src = originalVideo.src;
      miniVideo.currentTime = originalVideo.currentTime;
    } else {
      console.log('Mini View - activation using videoData at t=0');
      miniVideo.src = videoData.src;
      miniVideo.currentTime = 0;
    }

    // Copy audio/playback settings from original when available
    if (originalVideo) {
      miniVideo.volume = originalVideo.volume;
      miniVideo.muted = originalVideo.muted;
      miniVideo.playbackRate = originalVideo.playbackRate;
    }

    // For second and subsequent activations, immediately pause the original video
    // so that both players cannot play together, even if mini autoplay is blocked.
    if (!isFirstActivation && originalVideo && !originalVideo.paused) {
      originalVideo.pause();
      console.log('Original video paused immediately for subsequent Mini View activation');
    }

    hasInitializedRef.current = true;
    setIsVideoReady(true);
    setDuration(isNaN(miniVideo.duration) ? 0 : miniVideo.duration || 0);
    setCurrentTime(miniVideo.currentTime || 0);

    const shouldAutoPlay = isFirstActivation
      ? !!originalVideo && !originalVideo.paused
      : true; // always try autoplay on reopen

    if (!shouldAutoPlay) {
      return;
    }

    miniVideo
      .play()
      .then(() => {
        console.log('Mini video playing');
        setIsPlaying(true);

        // Pause original to prevent double audio when it exists
        if (originalVideo && !originalVideo.paused) {
          originalVideo.pause();
          console.log('Original video paused to prevent double audio');
        }
      })
      .catch(err => {
        console.error('Mini View play error:', err);
      });
  }, [videoElement, videoData, activationCount]);

  useEffect(() => {
    const video = miniVideoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(isNaN(video.duration) ? 0 : video.duration || 0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  // Cleanup: reset when Mini View closes completely
  useEffect(() => {
    return () => {
      console.log('Mini View unmounting - cleaning up');
      hasInitializedRef.current = false;
      setIsVideoReady(false);
      
      // Try to restore original video if it still exists
      if (videoElement && miniVideoRef.current && !miniVideoRef.current.paused) {
        videoElement.currentTime = miniVideoRef.current.currentTime;
        videoElement.play().catch(() => {
          console.log('Could not restore original video playback');
        });
      }
    };
  }, []); // Empty deps - only run on unmount

  const handleClose = () => {
    deactivate();
  };

  const handleBackToMain = () => {
    deactivate();
  };

  const handleTogglePlay = () => {
    const video = miniVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Mini View manual play error:', err);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const video = miniVideoRef.current;
    if (!video) return;

    const value = Number(event.target.value);
    video.currentTime = value;
    setCurrentTime(value);
  };

  if (!videoData) return null;

  return (
    <div
      className="mini-view-iphone-frame mini-view-enter"
      style={{
        pointerEvents: 'auto',
        position: 'relative',
      }}
    >
      <div className="mini-view-notch" />

      <button
        className="mini-view-back-button"
        onClick={handleBackToMain}
        aria-label="العودة إلى العرض الرئيسي"
        title="العودة إلى العرض الرئيسي"
        style={{
          position: 'absolute',
          top: '28px',
          left: '16px',
          zIndex: 20,
        }}
      >
        <CornerUpLeft />
      </button>

      <button
        className="mini-view-close-button"
        onClick={handleClose}
        aria-label="إغلاق العرض المصغر"
        title="إغلاق العرض المصغر"
        style={{
          position: 'absolute',
          top: '28px',
          right: '16px',
          zIndex: 20,
        }}
      >
        <X />
      </button>

      <div 
        className="mini-view-video-container"
        style={{ backgroundColor: isVideoReady ? 'transparent' : '#333' }}
      >
        <video
          ref={miniVideoRef}
          className="w-full h-full object-contain"
          poster={videoData.poster}
          playsInline
          controls={false}
          style={{ display: isVideoReady ? 'block' : 'none' }}
        />
        {!isVideoReady && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            color: 'white',
            fontSize: '14px'
          }}>
            Loading video...
          </div>
        )}

        {isVideoReady && (
          <div className="mini-view-controls">
            <button
              type="button"
              className="mini-view-play-button"
              onClick={handleTogglePlay}
              aria-label={isPlaying ? 'إيقاف الفيديو' : 'تشغيل الفيديو'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={duration ? Math.min(currentTime, duration) : 0}
              onChange={handleSeek}
              className="mini-view-progress"
            />
          </div>
        )}
      </div>

      <div className="mini-view-title">
        <h3>{videoData.title}</h3>
      </div>
    </div>
  );
}
