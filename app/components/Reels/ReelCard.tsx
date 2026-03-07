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
    return (
        <div className="reel-card" role="article" aria-label={reel.caption || "ريل"}>
            {/* Video Player */}
            <ReelVideoPlayer
                reel={reel}
                isActive={isActive}
                isMuted={isMuted}
                onToggleMute={onToggleMute}
                nextVideoUrl={nextVideoUrl}
            />

            {/* Gradient overlays */}
            <div className="reel-gradient-top" aria-hidden="true" />
            <div className="reel-gradient-bottom" aria-hidden="true" />

            {/* User info (bottom) */}
            <ReelUserInfo reel={reel} />

            {/* Action stack (left side in RTL) */}
            <ReelActions
                reel={reel}
                isMuted={isMuted}
                onToggleMute={onToggleMute}
                onReelUpdate={onReelUpdate}
            />
        </div>
    );
}
