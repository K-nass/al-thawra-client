import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useMiniViewStore } from '~/stores/miniViewStore';
import { useMiniViewPiP } from './hooks/useMiniViewPiP';
import { useMiniViewDrag } from './hooks/useMiniViewDrag';
import { MiniViewiPhoneFrame } from './MiniViewiPhoneFrame';

export function MiniViewContainer() {
  const isActive = useMiniViewStore((state) => state.isActive);
  const videoData = useMiniViewStore((state) => state.videoData);
  const [mounted, setMounted] = useState(false);

  // Enable dragging for the Mini View frame
  const { bind, style } = useMiniViewDrag();

  // Enable auto-PiP functionality
  useMiniViewPiP();

  // Ensure we're on the client before creating portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('MiniViewContainer - isActive:', isActive, 'mounted:', mounted, 'videoData:', videoData);
  }, [isActive, mounted, videoData]);

  if (!mounted) {
    console.log('MiniViewContainer - not mounted yet');
    return null;
  }

  if (!isActive) {
    console.log('MiniViewContainer - not active');
    return null;
  }

  console.log('MiniViewContainer - RENDERING PORTAL');

  return createPortal(
    <div 
      className="mini-view-container" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        {...bind()}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'auto',
          ...style,
        }}
      >
        <MiniViewiPhoneFrame />
      </div>
    </div>,
    document.body
  );
}
