import { useEffect, useState, useCallback } from 'react';
import { supportsPiP } from '../utils/videoHelpers';

export function usePictureInPicture(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [isPiP, setIsPiP] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleEnterPiP = () => {
      setIsPiP(true);
    };

    const handleLeavePiP = () => {
      setIsPiP(false);
    };

    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('enterpictureinpicture', handleEnterPiP);
    video.addEventListener('leavepictureinpicture', handleLeavePiP);

    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnterPiP);
      video.removeEventListener('leavepictureinpicture', handleLeavePiP);
    };
  }, [videoRef, isClient]);

  const togglePiP = useCallback(async () => {
    if (!isClient) return;

    const video = videoRef.current;
    if (!video) return;

    try {
      if (!isPiP && document.pictureInPictureElement !== video) {
        await video.requestPictureInPicture();
      } else if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
    } catch (err) {
      console.error('PiP error:', err);
    }
  }, [isPiP, videoRef, isClient]);

  const isSupported = isClient ? supportsPiP() : false;

  return {
    isPiP,
    togglePiP,
    isSupported,
  };
}
