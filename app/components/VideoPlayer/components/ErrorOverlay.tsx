import { AlertCircle, RefreshCw } from 'lucide-react';
import { memo } from 'react';

interface ErrorOverlayProps {
  message: string;
  onRetry?: () => void;
}

function ErrorOverlayComponent({ message, onRetry }: ErrorOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-sm">
      <div className="max-w-md px-6 py-8 mx-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-500/20 text-red-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-2">
          حدث خطأ في التشغيل
        </h3>
        
        <p className="text-white/70 text-sm mb-6 leading-relaxed">
          {message}
        </p>
        
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg
                     bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)]
                     text-white font-medium
                     transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-black"
          >
            <RefreshCw className="w-4 h-4" />
            <span>إعادة المحاولة</span>
          </button>
        )}
      </div>
    </div>
  );
}

export const ErrorOverlay = memo(ErrorOverlayComponent);
