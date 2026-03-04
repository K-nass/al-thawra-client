import { useState, useRef, useEffect } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard, Virtual, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Share2, ArrowLeft, ChevronUp, ChevronDown, Maximize2, Minimize2, Music } from "lucide-react";
import { reelsService, type ReelsResponse, type Reel } from "../services/reelsService";
import { showToast } from "../components/Toast";
import "swiper/css";
import "swiper/css/mousewheel";

import "swiper/css/keyboard";
import "swiper/css/navigation";

// Initial loader
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor") || undefined;
  const reelId = url.searchParams.get("reelId");

  const data = await reelsService.getReels(cursor);

  if (reelId && !cursor) {
    try {
      const specificReel = await reelsService.getReelById(reelId);

      // Prepend specific reel and remove duplicate if exists in main feed
      const filteredReels = data.reels.filter(r => r.id !== reelId);
      const newReels = [specificReel, ...filteredReels];

      return {
        ...data,
        reels: newReels
      };
    } catch (e) {
      // Fallback: Check if the reel happens to be in the main feed
      const foundInFeed = data.reels.find(r => r.id === reelId);
      if (foundInFeed) {
        const filteredReels = data.reels.filter(r => r.id !== reelId);
        return { ...data, reels: [foundInFeed, ...filteredReels] };
      }
      return data;
    }
  }

  return data;
}

export function meta({ data }: { data: ReelsResponse }) {
  const firstReel = data?.reels?.[0];
  const title = firstReel?.caption
    ? `${firstReel.caption.substring(0, 60)}${firstReel.caption.length > 60 ? "..." : ""} | الثورة`
    : "ريلز | الثورة";

  return [
    { title },
    { name: "description", content: "شاهد أحدث الفيديوهات والريلز على صحيفة الثورة" },
  ];
}

export default function ReelsPage() {
  const initialData = useLoaderData<ReelsResponse>();
  const [reels, setReels] = useState<Reel[]>(initialData.reels || []);
  const [nextCursor, setNextCursor] = useState<string | undefined>(initialData.nextCursor);
  const [hasMore, setHasMore] = useState<boolean>(initialData.hasMore);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType>(null);

  // Use fetcher for infinite scroll
  const fetcher = useFetcher<ReelsResponse>();
  const isLoadingMore = fetcher.state === "loading";

  // Append new reels
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.reels && fetcher.data.reels.length > 0) {
        setReels((prev) => [...prev, ...fetcher.data!.reels]);
        setNextCursor(fetcher.data.nextCursor);
        setHasMore(fetcher.data.hasMore);
      } else {
        setHasMore(false);
      }
    }
  }, [fetcher.data]);

  // Update title on slide change
  useEffect(() => {
    if (reels[activeIndex]) {
      const currentReel = reels[activeIndex];
      const title = currentReel.caption
        ? `${currentReel.caption.substring(0, 60)}${currentReel.caption.length > 60 ? "..." : ""} | الثورة`
        : "ريلز | الثورة";
      document.title = title;

      // Update URL with reelId
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("reelId", currentReel.id);
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [activeIndex, reels]);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
    if (hasMore && !isLoadingMore && swiper.activeIndex >= reels.length - 3) {
      if (nextCursor) {
        fetcher.load(`/reels?cursor=${nextCursor}&index`);
      }
    }
  };

  if (reels.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 border border-dashed border-black/10 rounded-lg mb-4">
            <Music className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg">لا توجد ريلز متاحة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Swiper Container - With consistent padding */}
      <div className="relative h-screen max-w-7xl mx-auto px-4 flex items-center justify-center">
        <div className="w-full max-w-[500px] h-[85vh] border border-dashed border-black/10 rounded-lg p-8">
          <Swiper
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            direction="vertical"
            className="w-full h-full rounded-lg overflow-hidden"
            modules={[Mousewheel, Keyboard, Virtual]}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 0.8,
              thresholdDelta: 50,
              thresholdTime: 300
            }}
            keyboard={{ enabled: true }}
            onSlideChange={handleSlideChange}
            virtual={{
              enabled: true,
              addSlidesBefore: 1,
              addSlidesAfter: 2
            }}
            spaceBetween={0}
            slidesPerView={1}
            speed={500}
          >
            {reels.map((reel, index) => (
              <SwiperSlide key={reel.id} virtualIndex={index} className="w-full h-full">
                <ReelItem
                  reel={reel}
                  isActive={index === activeIndex}
                />
              </SwiperSlide>
            ))}

            {hasMore && (
              <SwiperSlide>
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
          

          {/* Navigation Arrows */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 flex gap-3 z-50">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className={`p-2 rounded-lg border border-dashed border-black/20 bg-transparent hover:bg-black/5 transition-all ${activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
              disabled={activeIndex === 0}
            >
              <ChevronUp className="w-5 h-5 text-gray-900" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className={`p-2 rounded-lg border border-dashed border-black/20 bg-transparent hover:bg-black/5 transition-all ${!hasMore && activeIndex === reels.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
              disabled={!hasMore && activeIndex === reels.length - 1}
            >
              <ChevronDown className="w-5 h-5 text-gray-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReelItem({ reel, isActive }: { reel: Reel; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/reels?reelId=${reel.id}`;
      await navigator.clipboard.writeText(url);
      showToast("تم نسخ الرابط بنجاح", "success");
    } catch (err) {
      showToast("فشل نسخ الرابط", "error");
    }
  };

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Video */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.tags?.[0] || ""}
        className="w-full h-full object-cover"
        loop
        playsInline
        onClick={togglePlay}
        muted={false}
      />

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
          </div>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none" />

      {/* Info Overlay - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 text-white">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 overflow-hidden bg-gray-700">
            <img
              src={reel.userAvatarUrl || ""}
              alt={reel.userName || ""}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col flex-1">
            <span className="font-bold text-sm drop-shadow-md">
              @{reel.userName || "Unknown"}
            </span>
          </div>
          <button className="bg-white text-black text-xs font-bold px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
            اشتراك
          </button>
        </div>

        {/* Caption */}
        <p className="text-sm leading-relaxed drop-shadow-md mb-3 line-clamp-3">
          {reel.caption}
        </p>

        {/* Music Info */}
        <div className="flex items-center gap-2 text-xs opacity-90">
          <Music className="w-4 h-4" />
          <span className="truncate">الصوت الأصلي - {reel.userName}</span>
        </div>
      </div>

      {/* Side Actions - Right Side */}
      <div className="absolute left-4 bottom-24 flex flex-col gap-4 z-20">
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          {reel.sharesCount > 0 && (
            <span className="text-xs text-white drop-shadow-md">
              {formatCount(reel.sharesCount)}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function formatCount(num: number): string {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
