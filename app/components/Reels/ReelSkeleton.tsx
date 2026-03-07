export function ReelSkeleton() {
    return (
        <div className="reel-skeleton" role="status" aria-label="جاري التحميل">
            {/* Bottom-right area mimicking user info */}
            <div
                style={{
                    position: "absolute",
                    bottom: 24,
                    right: 16,
                    left: 72,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    zIndex: 2,
                }}
            >
                {/* Avatar + Name row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="reel-skeleton-avatar" />
                    <div className="reel-skeleton-text" style={{ width: 100 }} />
                </div>
                {/* Caption lines */}
                <div className="reel-skeleton-text" style={{ width: "90%" }} />
                <div className="reel-skeleton-text" style={{ width: "60%" }} />
            </div>

            {/* Left side mimicking action buttons */}
            <div
                style={{
                    position: "absolute",
                    bottom: 100,
                    left: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    zIndex: 2,
                }}
            >
                <div className="reel-skeleton-action" />
                <div className="reel-skeleton-action" />
                <div className="reel-skeleton-action" />
                <div className="reel-skeleton-action" />
            </div>
        </div>
    );
}
