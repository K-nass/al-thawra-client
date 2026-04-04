import { NewsTicker } from "./NewsTicker";
import { AudioBrief } from "./AudioBrief";
import type { Post } from "../../services/postsService";

interface SecondaryTopBarProps {
  breakingNews?: Post[];
}

export function SecondaryTopBar({ breakingNews = [] }: SecondaryTopBarProps) {
  if (!breakingNews.length) return null;

  return (
    <div
      dir="rtl"
      className="md:flex items-center justify-between w-full px-4 sm:px-6 lg:px-8 py-2 max-w-7xl mx-auto mb-4 border border-dashed border-black/10"
    >
      {/* Right side in RTL: News Ticker */}
      <NewsTicker headlines={breakingNews} />

      {/* Left side in RTL: Audio Brief */}
      <AudioBrief />
    </div>
  );
}
