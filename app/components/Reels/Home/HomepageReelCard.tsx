import { Link } from "react-router";
import { Play } from "lucide-react";

// ---------- Data Interface ----------

export interface HomepageReel {
  id: string;
  thumbnailUrl: string | null;
  title: string;
  category?: string;
  author?: string;
  isLoading: boolean;
}

// ---------- Component ----------

interface HomepageReelCardProps {
  reel: HomepageReel;
}

export function HomepageReelCard({ reel }: HomepageReelCardProps) {
  return (
    <Link
      to={`/reels?reelId=${reel.id}`}
      className="homepage-reel-card"
      aria-label={`تشغيل الفيديو: ${reel.title}`}
    >
      {/* Thumbnail */}
      <div className="homepage-reel-thumbnail-wrap">
        {reel.thumbnailUrl ? (
          <img
            src={reel.thumbnailUrl}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            style={{ width: "100%", height: "100%", background: "#ccc" }}
            aria-hidden="true"
          />
        )}

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

        {/* Author overlay */}
        {reel.author && (
          <div className="homepage-reel-author">
            {reel.author}
          </div>
        )}
      </div>

      {/* Text content */}
      <div className="homepage-reel-text">
        {reel.category && (
          <span className="homepage-reel-category">{reel.category}</span>
        )}
        <h3 className="homepage-reel-card-title">{reel.title}</h3>
      </div>
    </Link>
  );
}
