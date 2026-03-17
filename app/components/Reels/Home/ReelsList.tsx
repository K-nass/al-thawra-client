import { HomepageReelCard, type HomepageReel } from "./HomepageReelCard";

interface ReelsListProps {
  reels: HomepageReel[];
}

export function ReelsList({ reels }: ReelsListProps) {
  return (
    <ul className="homepage-reels-list" role="list">
      {reels.map((reel) => (
        <li key={reel.id}>
          <HomepageReelCard reel={reel} />
        </li>
      ))}
    </ul>
  );
}
