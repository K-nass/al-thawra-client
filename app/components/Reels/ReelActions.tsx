import { useState, useCallback } from "react";
import { Heart, MessageCircle, Share2, Eye, Volume2, VolumeX } from "lucide-react";
import type { Reel } from "~/services/reelsService";
import { reelsService } from "~/services/reelsService";
import { formatCount } from "./utils/videoUtils";
import { showToast } from "~/components/Toast";

interface ReelActionsProps {
    reel: Reel;
    isMuted: boolean;
    onToggleMute: () => void;
    onReelUpdate: (id: string, partial: Partial<Reel>) => void;
}

export function ReelActions({
    reel,
    isMuted,
    onToggleMute,
    onReelUpdate,
}: ReelActionsProps) {
    const [isLiking, setIsLiking] = useState(false);

    const handleLike = useCallback(async () => {
        if (isLiking) return;
        setIsLiking(true);

        const wasLiked = reel.isLikedByCurrentUser;
        const newLikesCount = wasLiked
            ? Math.max(0, reel.likesCount - 1)
            : reel.likesCount + 1;

        // Optimistic update
        onReelUpdate(reel.id, {
            isLikedByCurrentUser: !wasLiked,
            likesCount: newLikesCount,
        });

        try {
            if (wasLiked) {
                await reelsService.unlikeReel(reel.id);
            } else {
                await reelsService.likeReel(reel.id);
            }
        } catch (error) {
            // Revert on failure
            onReelUpdate(reel.id, {
                isLikedByCurrentUser: wasLiked,
                likesCount: reel.likesCount,
            });
            showToast("فشل تحديث الإعجاب", "error");
        } finally {
            setIsLiking(false);
        }
    }, [reel, isLiking, onReelUpdate]);

    const handleShare = useCallback(async () => {
        try {
            const url = `${window.location.origin}/reels?reelId=${reel.id}`;

            if (navigator.share) {
                await navigator.share({
                    title: reel.caption || "ريلز | الثورة",
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                showToast("تم نسخ الرابط بنجاح", "success");
            }
        } catch (err: any) {
            // User cancelled share dialog
            if (err?.name !== "AbortError") {
                showToast("فشل مشاركة الرابط", "error");
            }
        }
    }, [reel]);

    const handleComment = useCallback(() => {
        showToast("قسم التعليقات قيد التطوير", "info");
    }, []);

    return (
        <div className="reel-actions">
            {/* Like */}
            <button
                className="reel-action-btn"
                onClick={handleLike}
                aria-label={reel.isLikedByCurrentUser ? "إلغاء الإعجاب" : "إعجاب"}
                disabled={isLiking}
            >
                <div className={`reel-action-icon ${reel.isLikedByCurrentUser ? "liked" : ""}`}>
                    <Heart />
                </div>
                <span className="reel-action-count">{formatCount(reel.likesCount)}</span>
            </button>

            {/* Comment */}
            <button
                className="reel-action-btn"
                onClick={handleComment}
                aria-label="تعليق"
            >
                <div className="reel-action-icon">
                    <MessageCircle />
                </div>
                <span className="reel-action-count">{formatCount(reel.commentsCount)}</span>
            </button>

            {/* Share */}
            <button
                className="reel-action-btn"
                onClick={handleShare}
                aria-label="مشاركة"
            >
                <div className="reel-action-icon">
                    <Share2 />
                </div>
                <span className="reel-action-count">{formatCount(reel.sharesCount)}</span>
            </button>

            {/* Views */}
            <div className="reel-action-btn" role="status" aria-label={`${reel.viewsCount} مشاهدة`}>
                <div className="reel-action-icon">
                    <Eye />
                </div>
                <span className="reel-action-count">{formatCount(reel.viewsCount)}</span>
            </div>

            {/* Mute Toggle */}
            <button
                className="reel-action-btn"
                onClick={onToggleMute}
                aria-label={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
            >
                <div className="reel-action-icon">
                    {isMuted ? <VolumeX /> : <Volume2 />}
                </div>
            </button>
        </div>
    );
}
