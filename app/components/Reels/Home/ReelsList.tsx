import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { HomepageReelCard, type HomepageReel } from "./HomepageReelCard";

interface ReelsListProps {
  reels: HomepageReel[];
}

export function ReelsList({ reels }: ReelsListProps) {
  return (
    <Swiper
      className="homepage-reels-list"
      tag="ul"
      role="list"
      spaceBetween={16}
      slidesPerView={6}
      breakpoints={{
        0: { slidesPerView: 2 },
        480: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
        1280: { slidesPerView: 6 },
      }}
    >
      {reels.map((reel) => (
        <SwiperSlide key={reel.id} tag="li">
          <HomepageReelCard reel={reel} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
