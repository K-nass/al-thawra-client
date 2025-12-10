import { memo } from 'react';

function LoadingSpinnerComponent() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-20 h-20">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-primary)] border-r-[var(--color-primary)]/50 animate-spin" />
        
        {/* Middle pulsing ring */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-white/40 border-l-white/40 animate-spin" 
             style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        
        {/* Inner glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[var(--color-primary)]/20 to-transparent animate-pulse" />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white shadow-lg shadow-[var(--color-primary)]/50 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export const LoadingSpinner = memo(LoadingSpinnerComponent);
