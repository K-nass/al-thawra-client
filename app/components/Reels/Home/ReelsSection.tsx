import { Link } from "react-router";
import { ReelsList } from "./ReelsList";
import type { HomepageReel } from "./HomepageReelCard";
import "./homepage-reels.css";

interface ReelsSectionProps {
  reels: HomepageReel[];
}

export function ReelsSection({ reels }: ReelsSectionProps) {
  if (!reels || reels.length === 0) return null;

  return (
    <section
      className="homepage-reels-section border-b-2 border-black py-6"
      aria-label="شاهد فيديوهات اليوم"
    >
      <div className="homepage-reels-header">
        <Link to="/reels" className="homepage-reels-title">
          شاهد فيديوهات اليوم
        </Link>
        <Link to="/reels" className="homepage-reels-see-all" aria-label="عرض كل الريلز">
          عرض الكل
        </Link>
      </div>

      <ReelsList reels={reels} />
    </section>
  );
}
