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
    console.log("Loader: Processing reelId:", reelId);
    try {
      const specificReel = await reelsService.getReelById(reelId);
      console.log("Loader: Specific reel fetched successfully:", specificReel?.id);

      // Prepend specific reel and remove duplicate if exists in main feed
      const filteredReels = data.reels.filter(r => r.id !== reelId);
      const newReels = [specificReel, ...filteredReels];

      console.log("Loader: returning reordered reels. First ID:", newReels[0].id);
      return {
        ...data,
        reels: newReels
      };
    } catch (e) {
      console.error("Loader: Error fetching specific reel:", e);
      // Fallback: Check if the reel happens to be in the main feed
      const foundInFeed = data.reels.find(r => r.id === reelId);
      if (foundInFeed) {
        console.log("Loader: specific reel found in main feed (fallback).");
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const swiperRef = useRef<SwiperType>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

      // Update URL with reelId without reloading or adding to history stack
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("reelId", currentReel.id);
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, [activeIndex, reels]);

  // Handle Full Screen
  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullScreen(true);
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    } else {
      await document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Listener for ESC key exit
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
    if (hasMore && !isLoadingMore && swiper.activeIndex >= reels.length - 3) {
      if (nextCursor) {
        fetcher.load(`/reels?cursor=${nextCursor}&index`);
      }
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-[#09090b] flex justify-center overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent pointer-events-none" />

      {/* Back Button (Only if not fullscreen) */}
      {!isFullScreen && (
        <a href="/" className="absolute top-6 right-8 z-50 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </a>
      )}

      {/* Main Content Area */}
      <div className={`relative flex items-center h-full w-full z-10 ${isFullScreen ? 'justify-center p-0 m-0 max-w-none' : 'max-w-6xl mx-auto px-4 justify-center gap-6'}`}>

        {/* Swiper Container */}
        <div className={`relative h-full transition-all duration-300 flex flex-col justify-center ${isFullScreen ? 'w-full' : 'w-full md:w-[700px]'}`}>
          <Swiper
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            direction="vertical"
            // Start video container transparent/black only for video area
            className={`w-full ${isFullScreen ? 'h-full' : 'h-[85vh] rounded-2xl'} overflow-hidden shadow-2xl`}
            modules={[Mousewheel, Keyboard, Virtual, Navigation]}
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
              <SwiperSlide key={reel.id} virtualIndex={index} className="w-full h-full flex items-center justify-center">
                <ReelItem
                  reel={reel}
                  isActive={index === activeIndex}
                  isFullScreen={isFullScreen}
                  toggleFullScreen={toggleFullScreen}
                />
              </SwiperSlide>
            ))}

            {hasMore && (
              <SwiperSlide>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-white/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                </div>
              </SwiperSlide>
            )}
          </Swiper>

          {/* External Navigation Arrows (Desktop Style) */}
          {!isFullScreen && (
            <div className="absolute right-[-60px] top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className={`p-3 rounded-full bg-[#272727] text-white hover:bg-[#3f3f3f] transition-all disabled:opacity-30 ${activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                disabled={activeIndex === 0}
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className={`p-3 rounded-full bg-[#272727] text-white hover:bg-[#3f3f3f] transition-all disabled:opacity-30 ${!hasMore && activeIndex === reels.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                disabled={!hasMore && activeIndex === reels.length - 1}
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReelItem({ reel, isActive, isFullScreen, toggleFullScreen }: { reel: Reel; isActive: boolean; isFullScreen: boolean; toggleFullScreen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null); // To prevent jitter while dragging

  const handleShare = async () => {
    try {
      // For a reel, you might want to share the specific reel's URL
      // For now, it shares the current page URL as per the instruction's provided code.
      await navigator.clipboard.writeText(window.location.href);
      showToast("تم نسخ الرابط بنجاح", "success");
    } catch (err) {
      console.error("Failed to copy link", err);
      showToast("فشل نسخ الرابط", "error");
    }
  };

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log("Autoplay blocked/failed", e));
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
  }


  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeekInteraction = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width)); // Clamp between 0 and 1
    const newTime = percentage * duration;

    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="relative w-full h-full flex flex-row group gap-4">
      {/* Video Container */}
      <div className={`relative ${isFullScreen ? 'w-full h-full' : 'w-full h-full rounded-xl'} bg-black overflow-hidden shadow-lg border border-white/5`}>
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className={`w-full h-full ${isFullScreen ? 'object-cover' : 'object-cover'}`}
          loop
          playsInline
          onClick={togglePlay}
          poster={reel.tags?.[0] || ""}
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          autoPlay
        />

        {/* Play/Pause Overlay Indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10">
            <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
            </div>
          </div>
        )}

        {/* Video Overlays (Caption, etc) - Inside video area */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 pointer-events-none" />

        {/* Info Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 flex flex-col justify-end pointer-events-auto text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-gray-700">
              <img src={reel.userAvatarUrl || ""} alt={reel.userName || ""} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[15px] drop-shadow-md hover:underline cursor-pointer">@{reel.userName || "Unknown"}</span>
              {/* Subscribe/Follow if needed */}
            </div>
            <button className="bg-white text-black text-xs font-bold px-4 py-1.5 rounded-full hover:bg-gray-200 transition-colors mr-2">
              اشتراك
            </button>
          </div>

          <p className="text-[15px] mb-2 dir-rtl leading-relaxed drop-shadow-sm line-clamp-2">
            {reel.caption}
          </p>

          <div className="flex items-center gap-2 text-sm font-medium opacity-90">
            <Music className="w-4 h-4" />
            <div className="overflow-hidden w-40">
              <span className="whitespace-nowrap">الصوت الأصلي - {reel.userName}</span>
            </div>
          </div>

          {/* Progress Bar & Duration */}
          <div className="w-full flex items-center gap-4 mt-6 pointer-events-auto px-1">
            <span className="text-sm font-bold text-white shadow-black/50 drop-shadow-md tabular-nums tracking-wider min-w-[3.5rem]">
              {formatTime(currentTime)} / {formatTime(duration || 0)}
            </span>

            {/* Interactive Area - Custom Pointer Events */}
            <div
              className="relative flex-1 h-8 group cursor-pointer flex items-center select-none touch-none"
              ref={progressBarRef}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                setIsDragging(true);
                handleSeekInteraction(e);
              }}
              onPointerMove={(e) => {
                if (isDragging) handleSeekInteraction(e);
              }}
              onPointerUp={(e) => {
                setIsDragging(false);
                e.currentTarget.releasePointerCapture(e.pointerId);
              }}
              onPointerLeave={() => {
                // Fallback if capture is lost or not supported
                if (isDragging) setIsDragging(false);
              }}
            >

              {/* Visual Background Track */}
              <div className="absolute inset-x-0 h-3 bg-white/30 rounded-full backdrop-blur-sm overflow-hidden pointer-events-none">
                {/* Progress Fill */}
                <div
                  className="absolute inset-y-0 left-0 bg-[var(--color-primary)] rounded-full z-10"
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                ></div>
              </div>

              {/* Drag Thumb */}
              <div
                className="absolute h-6 w-6 bg-white border-4 border-[var(--color-primary)] rounded-full shadow-lg z-20 pointer-events-none transition-transform group-hover:scale-110"
                style={{
                  left: `calc(${(currentTime / (duration || 1)) * 100}% - 12px)`
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Full Screen Toggle (Overlay top right) */}
        {!isFullScreen && (
          <button
            onClick={toggleFullScreen}
            className="absolute top-4 left-4 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-colors"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        )}
        {isFullScreen && (
          <button
            onClick={toggleFullScreen}
            className="absolute top-4 left-4 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white/80 hover:text-white transition-colors"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        )}

      </div>

      {/* Side Actions (Outside Video) - Only visible if layout allows, or absolute usage? 
          YouTube Shorts DESKTOP has a side column. MOBILE overlays it.
          We are building a responsive view but the request specifically mentioned "like the picture" which was desktop-ish.
          Let's put them on the SIDE for this layout.
      */}
      {!isFullScreen && (
        <div className="flex flex-col gap-6 items-center justify-end h-full pb-4 min-w-[100px] p-2">
          <ActionItem
            icon={<Share2 className="w-7 h-7" />}
            label="مشاركة"
            count={reel.sharesCount}
            onClick={handleShare}
          />

          {/* Sound Thumb */}
          <div className="mt-4 w-10 h-10 rounded-lg overflow-hidden border-2 border-white/20">
            <img src={reel.userAvatarUrl || ""} className="w-full h-full object-cover animate-spin-slow" />
          </div>
        </div>
      )}

      {/* In FullScreen, we likely want overlay actions like mobile */}
      {isFullScreen && (
        <div className="absolute bottom-20 left-4 flex flex-col gap-6 z-20 pointer-events-auto">
          <ActionItem
            icon={<Share2 className="w-8 h-8 drop-shadow-md" />}
            count={reel.sharesCount}
            isOverlay
            onClick={handleShare}
          />
        </div>
      )}

    </div>
  );
}

function ActionItem({
  icon,
  label,
  count,
  filled = false,
  isOverlay = false,
  onClick
}: {
  icon: React.ReactNode;
  label?: string;
  count?: number;
  filled?: boolean;
  isOverlay?: boolean;
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick} className="flex flex-col items-center gap-1 group cursor-pointer">
      <div className={`
        ${isOverlay
          ? 'p-0 text-white hover:scale-110 transition-transform'
          : 'p-3.5 bg-[#272727] hover:bg-[#3f3f3f] rounded-full text-white transition-colors'
        }
        flex items-center justify-center
      `}>
        {icon}
      </div>
      {count !== undefined && (
        <span className={`text-xs font-medium ${isOverlay ? 'text-white drop-shadow-md' : 'text-[#aaa] group-hover:text-white'}`}>
          {formatCount(count)}
        </span>
      )}
      {label && !isOverlay && (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}

function formatCount(num: number): string {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
