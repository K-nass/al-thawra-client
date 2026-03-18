interface ViewerLoadingStateProps {
  message?: string;
}

export function ViewerLoadingState({
  message = "جاري تحميل المجلة...",
}: ViewerLoadingStateProps) {
  return (
    <div className="viewer-loading-root">
      {/* Skeleton page shape */}
      <div className="viewer-loading-skeleton">
        <div className="viewer-loading-skeleton-page">
          {/* Fake text lines */}
          <div className="viewer-loading-lines">
            <div className="viewer-loading-line w-3/4" />
            <div className="viewer-loading-line w-full" />
            <div className="viewer-loading-line w-5/6" />
            <div className="viewer-loading-line w-2/3" />
            <div className="viewer-loading-line w-full" />
            <div className="viewer-loading-line w-4/5" />
            <div className="viewer-loading-line w-1/2" />
          </div>
        </div>
      </div>

      {/* Logo spinner */}
      {/* <div className="viewer-loading-spinner-container">
        <div className="viewer-loading-glow" />
        <div className="viewer-loading-spinner">
          <img
            src="/logo.png"
            alt="Loading"
            loading="eager"
            className="viewer-loading-logo"
          />
        </div>
      </div> */}

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
