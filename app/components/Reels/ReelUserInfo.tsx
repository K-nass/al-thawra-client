import { useState, useMemo } from "react";
import type { Reel } from "~/services/reelsService";
import { getAvatarInitial, getAvatarGradient } from "./utils/videoUtils";

interface ReelUserInfoProps {
    reel: Reel;
}

export function ReelUserInfo({ reel }: ReelUserInfoProps) {
    const [captionExpanded, setCaptionExpanded] = useState(false);
    const initial = useMemo(() => getAvatarInitial(reel.userName), [reel.userName]);
    const gradient = useMemo(() => getAvatarGradient(reel.userId), [reel.userId]);

    const hasLongCaption = reel.caption && reel.caption.length > 80;

    return (
        <div className="reel-user-info">
            {/* User row — avatar + name */}
            <div className="reel-user-row">
                <div
                    className="reel-avatar"
                    style={{ background: reel.userAvatarUrl ? undefined : gradient }}
                    aria-hidden="true"
                >
                    {reel.userAvatarUrl ? (
                        <img
                            src={reel.userAvatarUrl}
                            alt={reel.userName || ""}
                            loading="lazy"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                                const parent = (e.target as HTMLImageElement).parentElement;
                                if (parent) {
                                    parent.style.background = gradient;
                                    // Only add fallback once
                                    if (!parent.querySelector(".reel-avatar-fallback")) {
                                        const fallback = document.createElement("span");
                                        fallback.className = "reel-avatar-fallback";
                                        fallback.textContent = initial;
                                        parent.appendChild(fallback);
                                    }
                                }
                            }}
                        />
                    ) : (
                        <span className="reel-avatar-fallback">{initial}</span>
                    )}
                </div>

                <span className="reel-username">
                    {reel.userName || "مستخدم"}
                </span>
            </div>

            {/* Caption */}
            {reel.caption && (
                <>
                    <div
                        className={`reel-caption ${captionExpanded ? "expanded" : "collapsed"}`}
                        lang="ar"
                    >
                        {reel.caption}
                    </div>
                    {hasLongCaption && (
                        <button
                            className="reel-caption-toggle"
                            onClick={() => setCaptionExpanded((p) => !p)}
                            aria-expanded={captionExpanded}
                            aria-label={captionExpanded ? "إظهار أقل" : "إظهار المزيد"}
                        >
                            {captionExpanded ? "▲ أقل" : "▼ المزيد"}
                        </button>
                    )}
                </>
            )}

            {/* Tags */}
            {reel.tags && reel.tags.length > 0 && (
                <div className="reel-tags" aria-label="الوسوم">
                    {reel.tags.map((tag, i) => (
                        <span key={i} className="reel-tag">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
