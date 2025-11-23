import { useState } from "react";
import { Play, Share2, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Link, useLoaderData } from "react-router";
import { motion } from "framer-motion";
import type { Route } from "./+types/tv";
import { videoService, type Video } from "../services/videoService";
import { categoriesService, type Category } from "../services/categoriesService";
import { cache, CacheTTL } from "../lib/cache";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "../components/ScrollAnimation";
import { generateMetaTags } from "~/utils/seo";

export function meta({}: Route.MetaArgs) {
  return generateMetaTags({
    title: "البث المباشر - تلفزيون الثورة",
    description: "شاهد البث المباشر لتلفزيون الثورة. تغطية حية للأحداث والأخبار العاجلة على مدار الساعة",
    url: "/tv",
    type: "website",
  });
}

// Loader function for server-side data fetching
export async function loader() {
  try {
    // Load slider and related videos in parallel
    const [sliderVideos, relatedVideos] = await Promise.all([
      cache.getOrFetch(
        "videos:slider:15",
        () => videoService.getSliderVideos(15),
        CacheTTL.SHORT
      ).catch(() => []),
      cache.getOrFetch(
        "videos:recommended:15",
        () => videoService.getRecommendedVideos(15),
        CacheTTL.SHORT
      ).catch(() => []),
    ]);

    // Load TV categories (reuse homepage categories for now)
    const tvCategories: Category[] = await cache
      .getOrFetch(
        "categories:tv:Arabic",
        () => categoriesService.getHomepageCategories("Arabic"),
        CacheTTL.LONG
      )
      .catch(() => []);

    // For each category, load its video posts
    const categoryVideos: { category: Category; videos: Video[] }[] = [];

    for (const category of tvCategories) {
      try {
        const videos = await cache.getOrFetch(
          `videos:category:${category.slug}:15`,
          async () => {
            const response = await videoService.getVideosByCategory(category.slug, {
              pageSize: 15,
            });
            return response.items;
          },
          CacheTTL.SHORT
        );

        if (videos.length > 0) {
          categoryVideos.push({ category, videos });
        }
      } catch (error) {
        console.error(`Error fetching videos for category ${category.slug}:`, error);
      }
    }

    return {
      sliderVideos,
      relatedVideos,
      categoryVideos,
    };
  } catch (error: any) {
    console.error('Error loading videos:', error.response?.data || error.message);
    // Return empty data on error
    return {
      sliderVideos: [],
      relatedVideos: [],
      categoryVideos: [],
    };
  }
}

export default function TVPage() {
  // Get data from loader
  const { sliderVideos, relatedVideos, categoryVideos } = useLoaderData<typeof loader>();

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentRelatedIndex, setCurrentRelatedIndex] = useState(0);

  // Current featured video
  const featuredVideo = sliderVideos[currentVideoIndex];

  const nextVideo = () => {
    if (currentVideoIndex < sliderVideos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const prevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const nextRelated = () => {
    if (currentRelatedIndex < relatedVideos.length - 4) {
      setCurrentRelatedIndex(currentRelatedIndex + 1);
    }
  };

  const prevRelated = () => {
    if (currentRelatedIndex > 0) {
      setCurrentRelatedIndex(currentRelatedIndex - 1);
    }
  };

  if (!featuredVideo) {
    return (
      <div className="container mx-auto px-0.5 py-8 max-w-7xl">
        <div className="text-center py-12">
          <p className="text-[var(--color-text-secondary)]">لا توجد فيديوهات متاحة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0.5 py-8 max-w-7xl">
      <div className="space-y-8">
      {/* Featured Episode - Video on Right, Details on Left */}
      <ScrollAnimation animation="scale" duration={0.6} once={false}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Details - Left Side (1/3 width) */}
        <motion.div
          key={`details-${featuredVideo.id}`}
          initial={{ opacity: 0.3, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="lg:col-span-1 bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] rounded-2xl p-6 text-[var(--color-text-light)] flex flex-col justify-between"
        >
          <div>
            {/* Category Badge */}
            <span className="inline-block px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-medium rounded-full mb-4">
              {featuredVideo.categoryName || 'برامج'}
            </span>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-3 leading-tight">
              {featuredVideo.title}
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-[var(--color-secondary-light)] mb-4 leading-relaxed">
              {featuredVideo.summary || featuredVideo.content?.substring(0, 100)}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-3 text-[var(--color-secondary)] text-sm mb-6 pb-6 border-b border-[var(--color-secondary)]/40">
              <span>{new Date(featuredVideo.publishedAt || featuredVideo.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="w-1 h-1 bg-[var(--color-secondary-light)] rounded-full"></span>
              <span>{featuredVideo.duration || '00:00'}</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-xl transition-all duration-300 font-bold shadow-lg">
                <Play className="w-5 h-5 fill-current" />
                <span>مشاهدة الآن</span>
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 backdrop-blur-sm">
                <Share2 className="w-5 h-5" />
                <span>مشاركة</span>
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 pt-6 border-t border-[var(--color-secondary)]/40">
            <button 
              onClick={prevVideo}
              disabled={currentVideoIndex === 0}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-[var(--color-text-light)] transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <span className="text-sm text-[var(--color-secondary-light)]">
              {currentVideoIndex + 1} / {sliderVideos.length}
            </span>
            <button 
              onClick={nextVideo}
              disabled={currentVideoIndex === sliderVideos.length - 1}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-[var(--color-text-light)] transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        </motion.div>

        {/* Video Player - Right Side (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="relative bg-[var(--color-background-dark)] rounded-2xl overflow-hidden aspect-video">
            <motion.img
              key={featuredVideo.id}
              src={featuredVideo.image || ''}
              alt={featuredVideo.imageDescription || featuredVideo.title}
              className="w-full h-full object-cover"
              initial={{ opacity: 0.3, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
            />
            {/* Play Button & Description Overlay */}
            <Link
              to={
                featuredVideo.categorySlug && featuredVideo.slug
                  ? `/posts/categories/${featuredVideo.categorySlug}/videos/${featuredVideo.slug}`
                  : "#"
              }
              className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-background-dark)]/40 hover:bg-[var(--color-background-dark)]/60 transition-colors cursor-pointer group"
            >
              <div className="relative flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-xl shadow-[var(--color-primary)]/50 border border-[var(--color-secondary-light)]/80 group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-white fill-current ml-1" />
                </div>
                <div className="absolute inset-0 rounded-full border border-white/40 group-hover:animate-pulse" />
              </div>
              {featuredVideo.imageDescription && (
                <span className="px-3 py-1 text-xs rounded-full bg-[var(--color-primary-dark)]/85 text-[var(--color-text-light)] max-w-[80%] text-center line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {featuredVideo.imageDescription}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      </ScrollAnimation>

      {/* Related Videos Section */}
      {relatedVideos.length > 0 && (
        <ScrollAnimation animation="slideUp" duration={0.5} once={false}>
          <CategorySection
            title="حلقات ذات صلة"
            subtitle="المزيد من حلقات البرنامج"
            videos={relatedVideos}
            categorySlug="related"
          />
        </ScrollAnimation>
      )}

      {/* Category-based TV Sections */}
      {categoryVideos.map(({ category, videos }) => (
        <ScrollAnimation
          key={category.id}
          animation="slideUp"
          duration={0.5}
          once={false}
        >
          <CategorySection
            title={category.name}
            videos={videos}
            categorySlug={category.slug}
          />
        </ScrollAnimation>
      ))}
      </div>
    </div>
  );
}

function CategorySection({ 
  title, 
  subtitle, 
  videos,
  categorySlug
}: { 
  title: string; 
  subtitle?: string; 
  videos: Video[];
  categorySlug?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleCount = 3;
  const maxIndex = Math.max(videos.length - visibleCount, 0);

  const showPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const showNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const visibleVideos = videos.slice(currentIndex, currentIndex + visibleCount);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          {categorySlug && (
            <Link 
              to={`/tv/category/${categorySlug}`}
              className="p-2 rounded-full hover:bg-[var(--color-secondary-light)] transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors" />
            </Link>
          )}
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mr-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[var(--color-text-secondary)] mr-2">
              {subtitle}
            </p>
          )}
        </div>

        {videos.length > visibleCount && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={showPrev}
              className="p-2 rounded-full bg-[var(--color-secondary-light)] hover:bg-[var(--color-secondary)] text-[var(--color-text-primary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="السابق"
              disabled={currentIndex === 0}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="text-sm text-[var(--color-text-secondary)] min-w-[72px] text-center">
              {currentIndex + 1} / {videos.length}
            </span>
            <button
              type="button"
              onClick={showNext}
              className="p-2 rounded-full bg-[var(--color-secondary-light)] hover:bg-[var(--color-secondary)] text-[var(--color-text-primary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="التالي"
              disabled={currentIndex >= maxIndex}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <StaggerContainer 
        key={`tv-category-${categorySlug || title}-${currentIndex}`}
        className="grid grid-cols-1 md:grid-cols-3 gap-4" 
        staggerDelay={0.15} 
        once={false}
      >
        {visibleVideos.map((video) => (
          <StaggerItem key={video.id}>
            <VideoCard video={video} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}

function VideoCard({ video }: { video: Video }) {
  const detailsHref =
    video.categorySlug && video.slug
      ? `/posts/categories/${video.categorySlug}/videos/${video.slug}`
      : "#";

  return (
    <div className="group cursor-pointer rounded-2xl bg-white shadow-md hover:shadow-xl border border-[var(--color-divider)]/80 overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-[var(--color-secondary-light)]">
        <img
          src={
            video.videoThumbnailUrl ||
            video.image ||
            'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=250&fit=crop'
          }
          alt={video.imageDescription || video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Overlay */}
        <Link
          to={detailsHref}
          className="absolute inset-0 bg-[var(--color-background-dark)]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center"
        >
          <div className="relative flex items-center justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/40 border border-[var(--color-secondary-light)]/70">
              <Play className="w-4 h-4 text-white fill-current ml-0.5" />
            </div>
            <div className="absolute inset-0 rounded-full border border-white/30 animate-pulse" />
          </div>
          {video.imageDescription && (
            <span className="px-2.5 py-1 text-[0.7rem] rounded-full bg-[var(--color-primary-dark)]/85 text-[var(--color-text-light)] max-w-[90%] text-center line-clamp-2">
              {video.imageDescription}
            </span>
          )}
        </Link>
        {/* Duration Badge */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-[var(--color-background-dark)]/90 text-[var(--color-text-light)] text-xs rounded-full">
          {video.duration || '00:00'}
        </div>
      </div>

      {/* Info */}
      <div className="px-3 pb-3 pt-2">
        <h3 className="font-bold text-[var(--color-text-primary)] mb-1 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
          {video.title}
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-2 line-clamp-2">
          {video.summary || video.content?.substring(0, 100)}
        </p>
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
          <span>{new Date(video.publishedAt || video.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}
