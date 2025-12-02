import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { CONTROLS_HIDE_DELAY, MOUSEMOVE_THROTTLE } from '../utils/constants';
import { throttle } from '../utils/performanceUtils';
import { useIsClient } from './useIsClient';

export function useVideoControls() {
  const [showControls, setShowControls] = useState(true);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClient = useIsClient();

  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const scheduleHideControls = useCallback(() => {
    if (!isClient) return;
    
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, CONTROLS_HIDE_DELAY);
  }, [clearHideTimeout, isClient]);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    scheduleHideControls();
  }, [scheduleHideControls]);

  // Throttle mouse move to reduce re-renders during mouse movement
  const handleMouseMove = useMemo(
    () =>
      throttle(() => {
        if (!showControls) {
          setShowControls(true);
        }
        scheduleHideControls();
      }, MOUSEMOVE_THROTTLE),
    [showControls, scheduleHideControls]
  );

  const handleMouseLeave = useCallback(() => {
    scheduleHideControls();
  }, [scheduleHideControls]);

  const handleMouseEnter = useCallback(() => {
    clearHideTimeout();
    setShowControls(true);
  }, [clearHideTimeout]);

  const toggleTheaterMode = useCallback(() => {
    setIsTheaterMode(prev => !prev);
  }, []);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  useEffect(() => {
    return () => {
      clearHideTimeout();
    };
  }, [clearHideTimeout]);

  return {
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
  };
}
