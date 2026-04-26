export function ReelSkeleton() {
    return (
        <div className="reel-skeleton" role="status" aria-label="جاري التحميل" aria-busy="true">
            {/* Central pulsing circle — simulates video bg */}
            <div className="reel-skeleton-video-pulse" aria-hidden="true" />

            {/* Progress bar placeholder */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: 64,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "rgba(255,255,255,0.07)",
                    zIndex: 2,
                }}
            />

            {/* Header area — back btn + title */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: 14,
                    right: 16,
                    left: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    zIndex: 2,
                    direction: "rtl",
                }}
            >
                <div className="reel-skeleton-action" style={{ width: 38, height: 38 }} />
                <div className="reel-skeleton-text" style={{ width: 48, height: 14 }} />
                <div style={{ width: 38 }} />
            </div>

            {/* Bottom-right area — user info */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    bottom: 28,
                    right: 16,
                    left: 76,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    zIndex: 2,
                    direction: "rtl",
                }}
            >
                {/* Avatar + username */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="reel-skeleton-avatar" />
                    <div className="reel-skeleton-text" style={{ width: 90, height: 14 }} />
                </div>
                {/* Caption lines */}
                <div className="reel-skeleton-text" style={{ width: "92%" }} />
                <div className="reel-skeleton-text" style={{ width: "68%" }} />
                {/* Tag pills */}
                <div style={{ display: "flex", gap: 6 }}>
                    <div className="reel-skeleton-text" style={{ width: 52, height: 22, borderRadius: 20 }} />
                    <div className="reel-skeleton-text" style={{ width: 64, height: 22, borderRadius: 20 }} />
                </div>
            </div>

            {/* Left side — action buttons */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    bottom: 28,
                    left: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 22,
                    zIndex: 2,
                }}
            >
                <div className="reel-skeleton-action" />
                <div className="reel-skeleton-action" />
                <div className="reel-skeleton-action" />
                <div className="reel-skeleton-action" />
            </div>

            {/* Top-left — mute pill placeholder */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: 78,
                    left: 16,
                    width: 72,
                    height: 28,
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.06)",
                    zIndex: 2,
                }}
            />
        </div>
    );
}
