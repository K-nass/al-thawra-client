/**
 * ViewerLoadingState — Enhanced loading screen with optional progress bar.
 *
 * When `progress` is provided (0-100), renders an animated progress bar
 * for the PDF-to-image conversion phase.
 * When absent, shows the default pulsing skeleton animation.
 */

interface ViewerLoadingStateProps {
  message?: string;
  progress?: number;
}

export function ViewerLoadingState({
  message = 'جاري تحميل المجلة...',
  progress,
}: ViewerLoadingStateProps) {
  return (
    <div className="viewer-loading-root">
      {/* Skeleton page shape */}
      <div className="viewer-loading-skeleton">
        <div className="viewer-loading-skeleton-page">
          <div className="viewer-loading-lines">
            <div className="viewer-loading-line" style={{ width: '75%' }} />
            <div className="viewer-loading-line" style={{ width: '100%' }} />
            <div className="viewer-loading-line" style={{ width: '83%' }} />
            <div className="viewer-loading-line" style={{ width: '66%' }} />
            <div className="viewer-loading-line" style={{ width: '100%' }} />
            <div className="viewer-loading-line" style={{ width: '80%' }} />
            <div className="viewer-loading-line" style={{ width: '50%' }} />
          </div>
        </div>
      </div>

      {/* Progress bar (only shown during PDF processing) */}
      {progress !== undefined && (
        <div className="viewer-loading-progress-wrap">
          <div className="viewer-loading-progress-track">
            <div
              className="viewer-loading-progress-fill"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <span className="viewer-loading-progress-text">
            {Math.round(progress)}%
          </span>
        </div>
      )}

      {/* Message */}
      <p className="viewer-loading-message">{message}</p>

      {/* Animated dots */}
      <div className="viewer-loading-dots">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="viewer-loading-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
