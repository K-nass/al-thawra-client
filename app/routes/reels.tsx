import { useState, useRef, useEffect } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard, Virtual, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Heart, Share2, MessageCircle, ArrowLeft, ChevronUp, ChevronDown, Maximize2, Minimize2, MoreVertical, ThumbsDown, User, Music } from "lucide-react";
import { reelsService, type ReelsResponse, type Reel } from "../services/reelsService";
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/keyboard";
import "swiper/css/navigation";

// Initial loader
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor") || undefined;
  const data = await reelsService.getReels(cursor);
  return data;
}

export function meta() {
  return [
    { title: "ريلز | الثورة" },
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
      <div className={`relative flex items-center h-full w-full max-w-6xl mx-auto px-4 z-10 ${isFullScreen ? 'justify-center' : 'justify-center gap-6'}`}>
        
        {/* Swiper Container */}
        <div className={`relative h-full transition-all duration-300 flex flex-col justify-center ${isFullScreen ? 'w-full' : 'w-[550px]'}`}>
           <Swiper
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            direction="vertical"
            // Start video container transparent/black only for video area
            className={`w-full ${isFullScreen ? 'h-full' : 'h-[calc(100vh-40px)] rounded-2xl'} overflow-hidden shadow-2xl`}
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
  };

  return (
    <div className="relative w-full h-full flex flex-row group">
      {/* Video Container */}
      <div className={`relative ${isFullScreen ? 'w-full h-full' : 'w-full h-full rounded-xl'} bg-black overflow-hidden shadow-lg border border-white/5`}>
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className={`w-full h-full ${isFullScreen ? 'object-contain' : 'object-cover'}`}
          loop
          playsInline
          onClick={togglePlay}
          poster={reel.tags?.[0] || ""} 
          muted={isMuted} // Depending on browser policy, might need initial mute
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
               <img src={reel.userAvatarUrl} alt={reel.userName} className="w-full h-full object-cover" />
             </div>
             <div className="flex flex-col">
               <span className="font-bold text-[15px] drop-shadow-md hover:underline cursor-pointer">@{reel.userName}</span>
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
        <div className="flex flex-col gap-6 items-center justify-end h-full pb-4 pl-4 min-w-[60px]">
          <ActionItem icon={<Heart className="w-7 h-7" />} label="أعجبني" count={reel.likesCount} filled={false} />
          <ActionItem icon={<ThumbsDown className="w-7 h-7" />} label="لم يعجبني" count={0} /> {/* Mock */}
          <ActionItem icon={<MessageCircle className="w-7 h-7" />} label="تعليق" count={reel.commentsCount} />
          <ActionItem icon={<Share2 className="w-7 h-7" />} label="مشاركة" count={reel.sharesCount} />
          <button className="p-3 bg-[#272727] rounded-full hover:bg-[#3f3f3f] text-white transition-colors mt-2">
            <MoreVertical className="w-6 h-6" />
          </button>
          
           {/* Sound Thumb */}
           <div className="mt-4 w-10 h-10 rounded-lg overflow-hidden border-2 border-white/20">
               <img src={reel.userAvatarUrl} className="w-full h-full object-cover animate-spin-slow" />
           </div>
        </div>
      )}

      {/* In FullScreen, we likely want overlay actions like mobile */}
      {isFullScreen && (
         <div className="absolute bottom-20 left-4 flex flex-col gap-6 z-20 pointer-events-auto">
            <ActionItem icon={<Heart className="w-8 h-8 drop-shadow-md" />} count={reel.likesCount} isOverlay />
            <ActionItem icon={<MessageCircle className="w-8 h-8 drop-shadow-md" />} count={reel.commentsCount} isOverlay />
            <ActionItem icon={<Share2 className="w-8 h-8 drop-shadow-md" />} count={reel.sharesCount} isOverlay />
             <button className="p-2 hover:bg-black/20 rounded-full transition-colors text-white">
                <MoreVertical className="w-8 h-8 drop-shadow-md" />
              </button>
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
  isOverlay = false 
}: { 
  icon: React.ReactNode; 
  label?: string; 
  count?: number; 
  filled?: boolean; 
  isOverlay?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 group cursor-pointer">
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
