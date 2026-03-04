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
import { showToast } from "~/components/Toast";

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
        // Error fetching videos for category
      }
    }

    return {
      sliderVideos,
      relatedVideos,
      categoryVideos,
    };
  } catch (error: any) {
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
      <div>
        <div>
          <p>لا توجد فيديوهات متاحة</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
      {/* Featured Episode - Video on Right, Details on Left */}
      <ScrollAnimation animation="scale" duration={0.6} once={false}>
      <div>
        {/* Details - Left Side (1/3 width) */}
        <motion.div
          key={`details-${featuredVideo.id}`}
          initial={{ opacity: 0.3, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          <div>
            {/* Category Badge */}
            <span>
              {featuredVideo.categoryName || 'برامج'}
            </span>

            {/* Title */}
            <h1>
              {featuredVideo.title}
            </h1>

            {/* Subtitle */}
            <p>
              {featuredVideo.summary || featuredVideo.content?.substring(0, 100)}
            </p>

            {/* Meta Info */}
            <div>
              <span>{new Date(featuredVideo.publishedAt || featuredVideo.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span></span>
              <span>{featuredVideo.duration || '00:00'}</span>
            </div>

            {/* Action Buttons */}
            <div>
              <Link 
                to={
                  featuredVideo.categorySlug && featuredVideo.slug
                    ? `/posts/categories/${featuredVideo.categorySlug}/videos/${featuredVideo.slug}`
                    : "#"
                }
              >
                <Play />
                <span>مشاهدة الآن</span>
              </Link>
              <button 
                onClick={() => {
                  const url = `${window.location.origin}/posts/categories/${featuredVideo.categorySlug}/videos/${featuredVideo.slug}`;
                  navigator.clipboard.writeText(url).then(() => {
                    showToast('تم نسخ الرابط بنجاح ✓', 'success');
                  });
                }}
              >
                <Share2 />
                <span>مشاركة</span>
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div>
            <button 
              onClick={prevVideo}
              disabled={currentVideoIndex === 0}
            >
              <ChevronRight />
            </button>
            <span>
              {currentVideoIndex + 1} / {sliderVideos.length}
            </span>
            <button 
              onClick={nextVideo}
              disabled={currentVideoIndex === sliderVideos.length - 1}
            >
              <ChevronLeft />
            </button>
          </div>
        </motion.div>

        {/* Video Player - Right Side (2/3 width) */}
        <div>
          <div>
            <motion.img
              key={featuredVideo.id}
              src={featuredVideo.image || ''}
              alt={featuredVideo.imageDescription || featuredVideo.title}
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
            >
              <div>
                <div>
                  <Play />
                </div>
                <div />
              </div>
              {featuredVideo.imageDescription && (
                <span>
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
      <div>
        <div>
          {categorySlug && (
            <Link 
              to={`/tv/category/${categorySlug}`}
            >
              <ArrowLeft />
            </Link>
          )}
          <h2>
            {title}
          </h2>
          {subtitle && (
            <p>
              {subtitle}
            </p>
          )}
        </div>

        {videos.length > visibleCount && (
          <div>
            <button
              type="button"
              onClick={showPrev}
              aria-label="السابق"
              disabled={currentIndex === 0}
            >
              <ChevronRight />
            </button>
            <span>
              {currentIndex + 1} / {videos.length}
            </span>
            <button
              type="button"
              onClick={showNext}
              aria-label="التالي"
              disabled={currentIndex >= maxIndex}
            >
              <ChevronLeft />
            </button>
          </div>
        )}
      </div>

      <StaggerContainer 
        key={`tv-category-${categorySlug || title}-${currentIndex}`} 
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
    <div>
      {/* Thumbnail */}
      <div>
        <img
          src={
            video.videoThumbnailUrl ||
            video.image ||
            'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=250&fit=crop'
          }
          alt={video.imageDescription || video.title}
        />
        {/* Overlay */}
        <Link
          to={detailsHref}
        >
          <div>
            <div>
              <Play />
            </div>
            <div />
          </div>
          {video.imageDescription && (
            <span>
              {video.imageDescription}
            </span>
          )}
        </Link>
        {/* Duration Badge */}
        <div>
          {video.duration || '00:00'}
        </div>
      </div>

      {/* Info */}
      <div>
        <h3>
          {video.title}
        </h3>
        <p>
          {video.summary || video.content?.substring(0, 100)}
        </p>
        <div>
          <span>{new Date(video.publishedAt || video.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}
