import { useEffect } from 'react';
import { KEYBOARD_SHORTCUTS, SEEK_STEP, VOLUME_STEP } from '../utils/constants';
import type { VideoPlayerControls, VideoPlayerState } from '../types';

interface UseKeyboardShortcutsOptions {
  enabled: boolean;
  controls: VideoPlayerControls;
  state: VideoPlayerState;
  containerRef: React.RefObject<HTMLElement | null>;
}

export function useKeyboardShortcuts({
  enabled,
  controls,
  state,
  containerRef,
}: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      const container = containerRef.current;
      if (!container || !container.contains(target)) {
        return;
      }

      const key = e.key;

      if (KEYBOARD_SHORTCUTS.PLAY_PAUSE.includes(key as any)) {
        e.preventDefault();
        controls.togglePlayPause();
      } else if (KEYBOARD_SHORTCUTS.MUTE.includes(key as any)) {
        e.preventDefault();
        controls.toggleMute();
      } else if (KEYBOARD_SHORTCUTS.FULLSCREEN.includes(key as any)) {
        e.preventDefault();
        controls.toggleFullscreen();
      } else if (KEYBOARD_SHORTCUTS.THEATER_MODE.includes(key as any)) {
        e.preventDefault();
        controls.toggleTheaterMode();
      } else if (KEYBOARD_SHORTCUTS.PICTURE_IN_PICTURE.includes(key as any)) {
        e.preventDefault();
        controls.togglePiP();
      } else if (KEYBOARD_SHORTCUTS.SEEK_FORWARD.includes(key as any)) {
        e.preventDefault();
        controls.seek(state.currentTime + SEEK_STEP);
        controls.showControlsTemporarily();
      } else if (KEYBOARD_SHORTCUTS.SEEK_BACKWARD.includes(key as any)) {
        e.preventDefault();
        controls.seek(state.currentTime - SEEK_STEP);
        controls.showControlsTemporarily();
      } else if (KEYBOARD_SHORTCUTS.VOLUME_UP.includes(key as any)) {
        e.preventDefault();
        controls.setVolume(Math.min(1, state.volume + VOLUME_STEP));
        controls.showControlsTemporarily();
      } else if (KEYBOARD_SHORTCUTS.VOLUME_DOWN.includes(key as any)) {
        e.preventDefault();
        controls.setVolume(Math.max(0, state.volume - VOLUME_STEP));
        controls.showControlsTemporarily();
      } else if (KEYBOARD_SHORTCUTS.SPEED_UP.includes(key as any)) {
        e.preventDefault();
        const newRate = Math.min(2, state.playbackRate + 0.25);
        controls.setPlaybackRate(newRate);
      } else if (KEYBOARD_SHORTCUTS.SPEED_DOWN.includes(key as any)) {
        e.preventDefault();
        const newRate = Math.max(0.25, state.playbackRate - 0.25);
        controls.setPlaybackRate(newRate);
      } else if (KEYBOARD_SHORTCUTS.RESTART.includes(key as any)) {
        e.preventDefault();
        controls.seek(0);
      } else if (key >= '1' && key <= '9') {
        e.preventDefault();
        const percentage = parseInt(key) / 10;
        controls.seek(state.duration * percentage);
        controls.showControlsTemporarily();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, controls, state, containerRef]);
}
