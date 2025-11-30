import type { Route } from "./+types/video";
import axiosInstance from "~/lib/axios";
import { cache, CacheTTL } from "~/lib/cache";
import type { Video } from "../services/videoService";
import { VideoPlayer } from '../components/VideoPlayer/VideoPlayer'
// Loader for video details with caching
export const loader = async ({ params }: Route.LoaderArgs) => {
  const { slug, categorySlug } = params;

  if (!slug || !categorySlug) {
    throw new Response("Video not found", { status: 404 });
  }

  try {
    const cacheKey = `video:${categorySlug}:${slug}`;

    const response = await cache.getOrFetch(
      cacheKey,
      () =>
        axiosInstance.get<Video>(
          `/posts/categories/${categorySlug}/videos/${slug}`
        ),
      CacheTTL.MEDIUM
    );

    return { video: response.data };
  } catch (error) {
    throw new Response("Video not found", { status: 404 });
  }
};

export function meta({ loaderData }: Route.MetaArgs) {
  const video = loaderData?.video as Video | undefined;

  return [
    { title: video?.title || "فيديو - الثورة" },
    {
      name: "description",
      content:
        video?.summary ||
        video?.content?.substring(0, 160) ||
        "شاهد الفيديو عبر منصة الثورة",
    },
  ];
}

export default function VideoPage({ loaderData }: Route.ComponentProps) {
  const { video } = loaderData as unknown as { video: Video };

  const formattedDate = video.publishedAt
    ? new Date(video.publishedAt).toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  // Extract video source - prioritize direct video URL
  const videoSource = 
    video.videoUrl || 
    (video.videoFiles && video.videoFiles.length > 0 ? video.videoFiles[0] : "") || 
    "";

  return (
    <div className="w-full px-4 md:px-6 lg:px-10 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Category, Title & Meta */}
        <div className="space-y-3">
          {video.categoryName && (
            <span className="inline-block px-3 py-1 bg-[var(--color-primary)] text-white text-xs font-medium rounded-full">
              {video.categoryName}
            </span>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] leading-snug">
            {video.title}
          </h1>

          {/* Meta row: date, language, views, likes */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[var(--color-text-secondary)]">
            {formattedDate && <span>{formattedDate}</span>}
            {video.language && (
              <span className="px-2 py-1 rounded-full bg-[var(--color-background-dark)]/80 text-[var(--color-text-light)]">
                اللغة: {video.language}
              </span>
            )}
            <span className="px-2 py-1 rounded-full bg-[var(--color-background-dark)]/80 text-[var(--color-text-light)]">
              المشاهدات: {video.viewsCount?.toLocaleString("en-US")}
            </span>
            <span className="px-2 py-1 rounded-full bg-[var(--color-background-dark)]/80 text-[var(--color-text-light)]">
              الإعجابات: {video.likesCount?.toLocaleString("en-US")}
            </span>
          </div>

          {/* Author */}
          {video.authorName && (
            <div className="flex items-center gap-3 pt-1">
              {video.authorImage && (
                <img
                  src={video.authorImage}
                  alt={video.authorName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {video.authorName}
                </span>
                {video.createdBy && (
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    تم النشر بواسطة {video.createdBy}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Video Player */}
        <div className="w-full">
          {videoSource ? (
            <VideoPlayer
              src={videoSource}
              poster={video.videoThumbnailUrl || undefined}
              title={video.title}
              autoPlay={false}
              muted={false}
              loop={false}
              initialVolume={0.8}
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center text-white bg-gray-800 rounded-xl">
              <div className="text-center">
                <p className="text-lg mb-2">لا يوجد مصدر فيديو متاح</p>
                <p className="text-sm text-gray-400">
                  الرجاء التحقق من رابط الفيديو
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {video.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-[var(--color-secondary-light)]/40 text-[var(--color-text-secondary)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Description / Content */}
        {video.summary && (
          <div className="prose prose-sm max-w-none">
            <p className="text-[var(--color-text-secondary)] text-base leading-relaxed">
              {video.summary}
            </p>
          </div>
        )}

        {video.content && !video.summary && !video.content.toLowerCase().includes('video content') && (
          <div className="prose prose-sm max-w-none">
            <p className="text-[var(--color-text-secondary)] text-base leading-relaxed">
              {video.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}