import { useRef, useEffect, useState, useCallback } from "react";
import { Play } from "lucide-react";
import type { Reel } from "~/services/reelsService";
import { getVideoPoster } from "./utils/videoUtils";
import { reelsService } from "~/services/reelsService";

interface ReelVideoPlayerProps {
    reel: Reel;
    isActive: boolean;
    isMuted: boolean;
    onToggleMute: () => void;
    nextVideoUrl?: string;
    onReelUpdate: (id: string, partial: Partial<Reel>) => void;
}

interface HeartPosition {
    x: number;
    y: number;
    id: number;
}

export function ReelVideoPlayer({
    reel,
    isActive,
    isMuted,
    onToggleMute,
    nextVideoUrl,
    onReelUpdate,
}: ReelVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const preloadRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [hasError, setHasError] = useState(false);
    const [showPauseIcon, setShowPauseIcon] = useState(false);
    const [hearts, setHearts] = useState<HeartPosition[]>([]);
    const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);

    const pauseIconTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const lastTapRef = useRef<number>(0);
    const heartIdRef = useRef(0);
    const rippleIdRef = useRef(0);

    // Autoplay / pause based on active state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isActive) {
            setHasError(false);
            const timer = setTimeout(() => {
                video.currentTime = 0;
                video
                    .play()
                    .then(() => setIsPlaying(true))
                    .catch(() => setIsPlaying(false));
            }, 200);
            return () => clearTimeout(timer);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    }, [isActive]);

    // Sync muted state
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // Track progress
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (video.duration) {
                setProgress((video.currentTime / video.duration) * 100);
            }
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        return () => video.removeEventListener("timeupdate", handleTimeUpdate);
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => clearTimeout(pauseIconTimeoutRef.current);
    }, []);

    // ------ Tap handler: single tap = play/pause, double tap = like ------
    const handleTap = useCallback(
        (e: React.MouseEvent<HTMLVideoElement>) => {
            const now = Date.now();
            const delta = now - lastTapRef.current;
            lastTapRef.current = now;

            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (delta < 300) {
                // --- Double tap: like + floating heart ---
                if (!reel.isLikedByCurrentUser) {
                    onReelUpdate(reel.id, {
                        isLikedByCurrentUser: true,
                        likesCount: reel.likesCount + 1,
                    });
                    reelsService.likeReel(reel.id).catch(() => {
                        onReelUpdate(reel.id, {
                            isLikedByCurrentUser: false,
                            likesCount: reel.likesCount,
                        });
                    });
                }

                const heartId = ++heartIdRef.current;
                setHearts((prev) => [...prev, { x, y, id: heartId }]);
                setTimeout(() => {
                    setHearts((prev) => prev.filter((h) => h.id !== heartId));
                }, 900);
            } else {
                // --- Single tap: play / pause with ripple ---
                const video = videoRef.current;
                if (!video) return;

                // Show ripple
                const rippleId = ++rippleIdRef.current;
                setRipple({ x, y, id: rippleId });
                setTimeout(() => setRipple(null), 600);

                if (isPlaying) {
                    video.pause();
                    setIsPlaying(false);
                    setShowPauseIcon(false);
                } else {
                    video.play().then(() => setIsPlaying(true)).catch(() => { });
                    setShowPauseIcon(true);
                    clearTimeout(pauseIconTimeoutRef.current);
                    pauseIconTimeoutRef.current = setTimeout(() => setShowPauseIcon(false), 700);
                }
            }
        },
        [isPlaying, reel, onReelUpdate]
    );

    const handleError = () => {
        setHasError(true);
        setIsPlaying(false);
    };

    const handleRetry = () => {
        const video = videoRef.current;
        if (!video) return;
        setHasError(false);
        video.load();
        video.play().then(() => setIsPlaying(true)).catch(() => { });
    };

    const poster = getVideoPoster(reel);

    return (
        <>
            {/* Main Video */}
            <video
                ref={videoRef}
                src={reel.videoUrl}
                poster={poster}
                className="reel-video"
                loop
                playsInline
                muted={isMuted}
                preload={isActive ? "auto" : "metadata"}
                onClick={handleTap}
                onError={handleError}
                aria-label={reel.caption || "فيديو ريل"}
            />

            {/* Preload next video */}
            {nextVideoUrl && (
                <video
                    ref={preloadRef}
                    src={nextVideoUrl}
                    preload="metadata"
                    muted
                    style={{ display: "none" }}
                    aria-hidden="true"
                />
            )}

            {/* Tap ripple */}
            {ripple && (
                <span
                    key={ripple.id}
                    className="reel-tap-ripple"
                    style={{ left: ripple.x, top: ripple.y }}
                    aria-hidden="true"
                />
            )}

            {/* Double-tap hearts */}
            {hearts.map((h) => (
                <span
                    key={h.id}
                    className="reel-double-tap-heart"
                    style={{ left: h.x - 45, top: h.y - 45 }}
                    aria-hidden="true"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </span>
            ))}

            {/* Play icon when paused (and not just tapped) */}
            {!isPlaying && !hasError && !showPauseIcon && (
                <div className="reel-play-overlay" aria-hidden="true">
                    <div className="reel-play-icon">
                        <Play />
                    </div>
                </div>
            )}

            {/* Video error overlay */}
            {hasError && (
                <div className="reel-video-error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p>تعذّر تشغيل الفيديو</p>
                    <button className="reels-retry-btn" onClick={handleRetry}>
                        إعادة المحاولة
                    </button>
                </div>
            )}

            {/* Progress bar — positioned via CSS (top, below header) */}
            <div className="reel-progress-bar" aria-hidden="true">
                <div
                    className="reel-progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </>
    );
}
