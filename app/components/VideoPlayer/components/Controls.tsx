import { memo, useMemo, useCallback } from 'react';
import { Maximize, Minimize, Maximize2, PictureInPicture, SkipBack, SkipForward } from 'lucide-react';
import { PlayButton } from './PlayButton';
import { VolumeControl } from './VolumeControl';
import { TimeDisplay } from './TimeDisplay';
import { ProgressBar } from './ProgressBar';
import { SettingsMenu, SettingsButton } from './SettingsMenu';
import { ControlButton } from './ControlButton';
import type { VideoPlayerState, VideoPlayerControls } from '../types';
import { PLAYBACK_RATES, SEEK_STEP } from '../utils/constants';
import { MiniViewToggle } from '../MiniView/MiniViewToggle';

interface ControlsProps {
  state: VideoPlayerState;
  controls: VideoPlayerControls;
  showSettings: boolean;
  onToggleSettings: () => void;
  availableQualities?: string[];
  isPiPSupported: boolean;
  isFullscreenSupported: boolean;
  videoSrc: string;
  videoPoster?: string;
  videoTitle: string;
}

function ControlsComponent({
  state,
  controls,
  showSettings,
  onToggleSettings,
  availableQualities = ['auto'],
  isPiPSupported,
  isFullscreenSupported,
  videoSrc,
  videoPoster,
  videoTitle,
}: ControlsProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    buffered,
    volume,
    isMuted,
    playbackRate,
    isFullscreen,
    isPiP,
    isTheaterMode,
    currentQuality,
  } = state;

  // Memoize skip button callbacks to prevent recreation on every render
  const handleSkipBackward = useCallback(() => {
    controls.seek(currentTime - SEEK_STEP);
  }, [controls, currentTime]);

  const handleSkipForward = useCallback(() => {
    controls.seek(currentTime + SEEK_STEP);
  }, [controls, currentTime]);

  return (
    <div 
      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pt-8 pb-4"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Progress Bar */}
      <div className="mb-4">
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          buffered={buffered}
          onSeek={controls.seek}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between gap-4">
        {/* Left Section: Play, Skip, Volume, Time */}
        <div className="flex items-center gap-3">
          <PlayButton
            isPlaying={isPlaying}
            onToggle={controls.togglePlayPause}
          />

          <ControlButton
            icon={<SkipBack size={20} />}
            label="الرجوع 10 ثوانٍ"
            onClick={handleSkipBackward}
          />

          <ControlButton
            icon={<SkipForward size={20} />}
            label="التقدم 10 ثوانٍ"
            onClick={handleSkipForward}
          />

          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={controls.setVolume}
            onToggleMute={controls.toggleMute}
          />

          <TimeDisplay
            currentTime={currentTime}
            duration={duration}
          />
        </div>

        {/* Right Section: Settings, Theater, PiP, Fullscreen */}
        <div className="flex items-center gap-2 relative">
          {/* Settings Menu */}
          <div className="relative">
            <SettingsButton
              onClick={onToggleSettings}
              isOpen={showSettings}
            />
            <SettingsMenu
              playbackRate={playbackRate}
              availableRates={PLAYBACK_RATES}
              currentQuality={currentQuality}
              availableQualities={availableQualities}
              onPlaybackRateChange={controls.setPlaybackRate}
              onQualityChange={controls.changeQuality}
              isOpen={showSettings}
              onClose={onToggleSettings}
            />
          </div>

          {/* Theater Mode */}
          <ControlButton
            icon={isTheaterMode ? <Minimize size={20} /> : <Maximize2 size={20} />}
            label={isTheaterMode ? 'الخروج من وضع المسرح' : 'وضع المسرح'}
            onClick={controls.toggleTheaterMode}
            active={isTheaterMode}
          />

          {/* Picture-in-Picture */}
          {isPiPSupported && (
            <ControlButton
              icon={<PictureInPicture size={20} />}
              label={isPiP ? 'إغلاق صورة في صورة' : 'صورة في صورة'}
              onClick={controls.togglePiP}
              active={isPiP}
            />
          )}

          {/* Mini View Toggle */}
          <MiniViewToggle
            videoSrc={videoSrc}
            videoPoster={videoPoster}
            videoTitle={videoTitle}
          />

          {/* Fullscreen */}
          {isFullscreenSupported && (
            <ControlButton
              icon={isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              label={isFullscreen ? 'الخروج من ملء الشاشة' : 'ملء الشاشة'}
              onClick={controls.toggleFullscreen}
              active={isFullscreen}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export const Controls = memo(ControlsComponent);
