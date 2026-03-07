import { useRef, useEffect, useState, useCallback } from "react";
import { Play } from "lucide-react";
import type { Reel } from "~/services/reelsService";
import { getVideoPoster } from "./utils/videoUtils";

interface ReelVideoPlayerProps {
    reel: Reel;
    isActive: boolean;
    isMuted: boolean;
    onToggleMute: () => void;
    nextVideoUrl?: string;
}

export function ReelVideoPlayer({
    reel,
    isActive,
    isMuted,
    onToggleMute,
    nextVideoUrl,
}: ReelVideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const preloadRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [hasError, setHasError] = useState(false);
    const [showPauseIcon, setShowPauseIcon] = useState(false);
    const pauseIconTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
                    .catch(() => {
                        // Autoplay blocked — keep paused state
                        setIsPlaying(false);
                    });
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

    // Toggle play/pause on tap
    const handleTap = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
            setIsPlaying(false);
            setShowPauseIcon(false);
        } else {
            video.play().then(() => setIsPlaying(true)).catch(() => { });
            // Show brief pause-icon feedback then hide
            setShowPauseIcon(true);
            clearTimeout(pauseIconTimeoutRef.current);
            pauseIconTimeoutRef.current = setTimeout(() => setShowPauseIcon(false), 600);
        }
    }, [isPlaying]);

    // Cleanup timeout
    useEffect(() => {
        return () => clearTimeout(pauseIconTimeoutRef.current);
    }, []);

    const handleError = () => {
        setHasError(true);
        setIsPlaying(false);
    };

    const handleRetry = () => {
        const video = videoRef.current;
        if (!video) return;
        setHasError(false);
        video.load();
        video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => { });
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
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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

            {/* Play icon when paused */}
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

            {/* Progress bar */}
            <div className="reel-progress-bar" aria-hidden="true">
                <div
                    className="reel-progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </>
    );
}
