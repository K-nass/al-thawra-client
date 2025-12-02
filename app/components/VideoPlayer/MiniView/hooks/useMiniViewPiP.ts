import { useEffect } from 'react';
import { useMiniViewStore } from '~/stores/miniViewStore';

export function useMiniViewPiP() {
  const { isActive, videoElement } = useMiniViewStore();

  useEffect(() => {
    if (!isActive || !videoElement) return;

    // Check if PiP is supported
    if (!document.pictureInPictureEnabled || !videoElement.requestPictureInPicture) {
      console.log('Picture-in-Picture is not supported');
      return;
    }

    const handleVisibilityChange = async () => {
      try {
        // When user switches away from tab
        if (document.hidden) {
          // Try to enable PiP if not already in PiP mode
          if (document.pictureInPictureElement !== videoElement) {
            await videoElement.requestPictureInPicture();
          }
        } else {
          // When user returns to tab
          // Exit PiP to restore Mini View
          if (document.pictureInPictureElement === videoElement) {
            await document.exitPictureInPicture();
          }
        }
      } catch (error) {
        // Silently fail if PiP is not supported or blocked
        console.debug('PiP toggle failed:', error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, videoElement]);
}
