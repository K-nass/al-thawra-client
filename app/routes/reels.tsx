import { useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Virtual } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ArrowRight, ChevronUp, ChevronDown, Film, WifiOff } from "lucide-react";
import { reelsService, type ReelsResponse, type Reel } from "../services/reelsService";
import { ReelCard, ReelSkeleton, useReelsFeed } from "../components/Reels";
import "../components/Reels/reels.css";
import "swiper/css";

// ---------- Route Handle ----------
export const handle = { disableSidebar: true };

// ---------- Loader ----------
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor") || undefined;
  const reelId = url.searchParams.get("reelId");

  try {
    const data = await reelsService.getReels(cursor, 5);

    if (reelId && !cursor) {
      try {
        const specificReel = await reelsService.getReelById(reelId);
        const filteredReels = data.reels.filter((r) => r.id !== reelId);
        return { ...data, reels: [specificReel, ...filteredReels] };
      } catch {
        const found = data.reels.find((r) => r.id === reelId);
        if (found) {
          const filtered = data.reels.filter((r) => r.id !== reelId);
          return { ...data, reels: [found, ...filtered] };
        }
      }
    }

    return data;
  } catch {
    return { reels: [], nextCursor: null, hasMore: false } as ReelsResponse;
  }
}

// ---------- Meta ----------
export function meta({ data }: { data: ReelsResponse }) {
  const firstReel = data?.reels?.[0];
  const title = firstReel?.caption
    ? `${firstReel.caption.substring(0, 60)}${firstReel.caption.length > 60 ? "..." : ""} | الثورة`
    : "ريلز | الثورة";

  return [
    { title },
    { name: "description", content: "شاهد أحدث الفيديوهات والريلز على صحيفة الثورة" },
    { name: "theme-color", content: "#000000" },
  ];
}

// ---------- Page Component ----------
export default function ReelsPage() {
  const {
    reels,
    activeIndex,
    setActiveIndex,
    hasMore,
    isLoadingMore,
    error,
    isMuted,
    toggleMute,
    updateReel,
    retry,
  } = useReelsFeed();

  const swiperRef = useRef<SwiperType>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      setActiveIndex(swiper.activeIndex);
    },
    [setActiveIndex]
  );

  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          swiperRef.current?.slidePrev();
          break;
        case "ArrowDown":
          e.preventDefault();
          swiperRef.current?.slideNext();
          break;
        case "m":
        case "M":
          toggleMute();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleMute]);

  // Wheel-to-swipe (for desktop mouse/trackpad, even when viewport is "mobile sized")
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (typeof window === "undefined") return;

    let lastTriggerAt = 0;
    let deltaAccumulator = 0;

    const onWheel = (e: WheelEvent) => {
      // Handle only when the event originates from inside the reels container.
      // Some emulations dispatch `wheel` on `window` with a non-element target,
      // so we also check the element under the pointer.
      const targetNode = (e.target ?? null) as Node | null;
      const insideByTarget = !!(targetNode && container.contains(targetNode));
      const elUnderPointer =
        typeof document !== "undefined" && "elementFromPoint" in document
          ? document.elementFromPoint(e.clientX, e.clientY)
          : null;
      const insideByPointer = !!(elUnderPointer && container.contains(elUnderPointer));
      if (!insideByTarget && !insideByPointer) return;

      // Only consider vertical intent
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      // Prevent the page from scrolling while we use the wheel to navigate reels
      e.preventDefault();

      // Accumulate smaller trackpad deltas
      deltaAccumulator += e.deltaY;

      const now = Date.now();
      const cooldownMs = 360;
      if (now - lastTriggerAt < cooldownMs) return;

      const threshold = 40;
      if (Math.abs(deltaAccumulator) < threshold) return;

      lastTriggerAt = now;
      const direction = deltaAccumulator > 0 ? 1 : -1;
      deltaAccumulator = 0;

      if (direction > 0) swiperRef.current?.slideNext();
      else swiperRef.current?.slidePrev();
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    // Fallback: in some "mobile view" emulations, wheel events can be dispatched on window.
    window.addEventListener("wheel", onWheel, { passive: false, capture: true } as any);
    return () => {
      container.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("wheel", onWheel as any, true);
    };
  }, []);

  // ---- Empty / Error State ----
  if (reels.length === 0 && !isLoadingMore) {
    return (
      <div className="reels-page">
        <div className="reels-rail-bg" aria-hidden="true" />
        <div className="reels-container">
          <div className="reels-state-screen">
            <button
              className="reels-back-btn"
              onClick={handleGoBack}
              aria-label="رجوع"
              style={{ position: "absolute", top: 16, right: 16 }}
            >
              <ArrowRight size={18} />
            </button>

            <div className="reels-state-icon">
              {error ? <WifiOff /> : <Film />}
            </div>
            <h1 className="reels-state-title">
              {error ? "حدث خطأ" : "لا توجد ريلز"}
            </h1>
            <p className="reels-state-desc">
              {error
                ? "تعذّر تحميل الريلز. تحقق من اتصالك بالإنترنت وحاول مرة أخرى."
                : "لم يتم العثور على أي ريلز متاحة حالياً. تحقق مرة أخرى لاحقاً."}
            </p>
            {error && (
              <button className="reels-retry-btn" onClick={retry}>
                إعادة المحاولة
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- Initial Loading State ----
  if (reels.length === 0 && isLoadingMore) {
    return (
      <div className="reels-page">
        <div className="reels-rail-bg" aria-hidden="true" />
        <div className="reels-container">
          <ReelSkeleton />
        </div>
      </div>
    );
  }

  // ---- Main Feed ----
  return (
    <div className="reels-page">
      {/* Ambient dark rail (desktop) */}
      <div className="reels-rail-bg" aria-hidden="true" />

      <div className="reels-container" ref={containerRef}>
        {/* Header */}
        <div className="reels-header">
          <button
            className="reels-back-btn"
            onClick={handleGoBack}
            aria-label="رجوع"
          >
            <ArrowRight size={18} />
          </button>
          <span className="reels-title">ريلز</span>
          {/* Spacer for centering */}
          <div style={{ width: 38 }} aria-hidden="true" />
        </div>

        {/* Navigation arrows (mobile + desktop; positioned by CSS) */}
        <nav className="reels-nav-arrows" aria-label="التنقل بين الريلز">
          <button
            className="reels-nav-btn"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={activeIndex === 0}
            aria-label="الريل السابق"
          >
            <ChevronUp />
          </button>
          <button
            className="reels-nav-btn"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={!hasMore && activeIndex === reels.length - 1}
            aria-label="الريل التالي"
          >
            <ChevronDown />
          </button>
        </nav>

        {/* Swiper Feed */}
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          direction="vertical"
          style={{ width: "100%", height: "100%" }}
          modules={[Keyboard, Virtual]}
          touchStartPreventDefault={false}
          touchMoveStopPropagation={false}
          preventClicks={false}
          preventClicksPropagation={false}
          keyboard={{ enabled: true }}
          onSlideChange={handleSlideChange}
          virtual={{
            enabled: true,
            addSlidesBefore: 1,
            addSlidesAfter: 2,
          }}
          spaceBetween={0}
          slidesPerView={1}
          speed={420}
          cssMode={false}
          resistance
          resistanceRatio={0.85}
          touchReleaseOnEdges
        >
          {reels.map((reel, index) => (
            <SwiperSlide
              key={reel.id}
              virtualIndex={index}
              style={{ width: "100%", height: "100%" }}
            >
              <ReelCard
                reel={reel}
                isActive={index === activeIndex}
                isMuted={isMuted}
                onToggleMute={toggleMute}
                onReelUpdate={updateReel}
                nextVideoUrl={reels[index + 1]?.videoUrl}
              />
            </SwiperSlide>
          ))}

          {/* Loading indicator slide */}
          {hasMore && (
            <SwiperSlide style={{ width: "100%", height: "100%" }}>
              <div className="reel-loading-more">
                <div className="reel-spinner" />
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>

      {/* Desktop: reel counter */}
      {reels.length > 0 && (
        <div className="reels-counter" aria-live="polite" aria-atomic="true">
          <span className="reels-counter-text" aria-label={`الريل ${activeIndex + 1} من ${reels.length}`}>
            {activeIndex + 1} / {reels.length}
          </span>
        </div>
      )}
    </div>
  );
}
