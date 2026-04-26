import { Link } from "react-router";
import { Play, Film } from "lucide-react";
import { useMemo, useState } from "react";

// ---------- Data Interface ----------

export interface HomepageReel {
  id: string;
  thumbnailUrl: string | null;
  title: string;
  category?: string;
  author?: string;
  isLoading: boolean;
}

// ---------- Helpers ----------

function getAuthorInitial(name?: string): string {
  if (!name) return "ر";
  return [...name.trim()][0]?.toUpperCase() || "ر";
}

// ---------- Component ----------

interface HomepageReelCardProps {
  reel: HomepageReel;
}

export function HomepageReelCard({ reel }: HomepageReelCardProps) {
  const initial = useMemo(() => getAuthorInitial(reel.author), [reel.author]);
  const [imgError, setImgError] = useState(false);

  const showImage = reel.thumbnailUrl && !imgError;

  return (
    <Link
      to={`/reels?reelId=${reel.id}`}
      className="homepage-reel-card"
      aria-label={`تشغيل الفيديو: ${reel.title}`}
    >
      <div className="homepage-reel-thumbnail-wrap">

        {/* Thumbnail image */}
        {showImage ? (
          <img
            src={reel.thumbnailUrl!}
            alt={reel.title}
            width="100%"
            height="100%"
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback — branded dark gradient */
          <div className="homepage-reel-thumbnail-fallback" aria-hidden="true">
            <Film />
          </div>
        )}

        {/* Bottom gradient for text readability */}
        <div className="homepage-reel-gradient" aria-hidden="true" />

        {/* Category badge (top-right in RTL) */}
        {reel.category && (
          <span className="homepage-reel-badge">{reel.category}</span>
        )}

        {/* Duration from reel (if available on the type) */}

        {/* Play or Loading overlay */}
        {reel.isLoading ? (
          <div className="homepage-reel-spinner-overlay" aria-hidden="true">
            <div className="homepage-reel-spinner" />
          </div>
        ) : (
          <div className="homepage-reel-play-overlay" aria-hidden="true">
            <div className="homepage-reel-play-btn">
              <Play fill="white" strokeWidth={0} />
            </div>
          </div>
        )}

        {/* Bottom info: author avatar + title */}
        <div className="homepage-reel-info">
          {reel.author && (
            <div className="homepage-reel-author">
              <div className="homepage-reel-author-avatar" aria-hidden="true">
                {initial}
              </div>
              <span className="homepage-reel-author-name">{reel.author}</span>
            </div>
          )}
          <h3 className="homepage-reel-card-title">{reel.title}</h3>
        </div>

      </div>
    </Link>
  );
}
