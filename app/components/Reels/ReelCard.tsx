import { useRef, useState, useCallback, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { Reel } from "~/services/reelsService";
import { ReelVideoPlayer } from "./ReelVideoPlayer";
import { ReelUserInfo } from "./ReelUserInfo";
import { ReelActions } from "./ReelActions";

interface ReelCardProps {
    reel: Reel;
    isActive: boolean;
    isMuted: boolean;
    onToggleMute: () => void;
    onReelUpdate: (id: string, partial: Partial<Reel>) => void;
    nextVideoUrl?: string;
}

export function ReelCard({
    reel,
    isActive,
    isMuted,
    onToggleMute,
    onReelUpdate,
    nextVideoUrl,
}: ReelCardProps) {
    const [isEntering, setIsEntering] = useState(false);

    // Trigger entrance animation whenever this card becomes active
    useEffect(() => {
        if (isActive) {
            setIsEntering(true);
            const t = setTimeout(() => setIsEntering(false), 500);
            return () => clearTimeout(t);
        }
    }, [isActive]);

    return (
        <div
            className={`reel-card${isEntering ? " reel-card--entering" : ""}`}
            role="article"
            aria-label={reel.caption || "ريل"}
            data-active={isActive}
        >
            {/* Video Player */}
            <ReelVideoPlayer
                reel={reel}
                isActive={isActive}
                isMuted={isMuted}
                onToggleMute={onToggleMute}
                nextVideoUrl={nextVideoUrl}
                onReelUpdate={onReelUpdate}
            />

            {/* Gradient overlays */}
            <div className="reel-gradient-top" aria-hidden="true" />
            <div className="reel-gradient-bottom" aria-hidden="true" />

            {/* Floating mute pill (top-left, below progress bar) */}
            <button
                className="reel-mute-pill"
                onClick={onToggleMute}
                aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
            >
                {isMuted ? <VolumeX /> : <Volume2 />}
                <span>{isMuted ? "صامت" : "صوت"}</span>
            </button>

            {/* User info (bottom) */}
            <ReelUserInfo reel={reel} />

            {/* Action stack */}
            <ReelActions
                reel={reel}
                onReelUpdate={onReelUpdate}
            />
        </div>
    );
}
