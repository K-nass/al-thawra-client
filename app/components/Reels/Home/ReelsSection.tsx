import { Link } from "react-router";
import { ReelsList } from "./ReelsList";
import type { HomepageReel } from "./HomepageReelCard";
import "./homepage-reels.css";

interface ReelsSectionProps {
  reels: HomepageReel[];
}

export function ReelsSection({ reels }: ReelsSectionProps) {
  // Don't render the section if there are no reels
  if (!reels || reels.length === 0) return null;

  return (
    <section
      className="homepage-reels-section"
      aria-label="شاهد فيديوهات اليوم"
    >
      <div className="homepage-reels-header">
        <Link to="/reels" className="homepage-reels-title hover:text-blue-700 transition-colors">
          شاهد فيديوهات اليوم
        </Link>
      </div>

      <ReelsList reels={reels} />
    </section>
  );
}
