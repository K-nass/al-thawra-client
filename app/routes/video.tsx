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
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Category, Title & Meta */}
        <div className="mb-6">
          {video.categoryName && (
            <span className="inline-block text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors mb-3">
              {video.categoryName}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {video.title}
          </h1>

          {/* Meta row: date, language, views, likes */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 pb-4 mb-4 border-b border-dashed border-black/10">
            {formattedDate && <span>{formattedDate}</span>}
            {video.language && (
              <>
                <span className="text-gray-400">•</span>
                <span>اللغة: {video.language}</span>
              </>
            )}
            <span className="text-gray-400">•</span>
            <span>المشاهدات: {video.viewsCount?.toLocaleString("en-US")}</span>
            <span className="text-gray-400">•</span>
            <span>الإعجابات: {video.likesCount?.toLocaleString("en-US")}</span>
          </div>

          {/* Author */}
          {video.authorName && (
            <div className="flex items-center gap-3 mb-6">
              {video.authorImage && (
                <img
                  src={video.authorImage}
                  alt={video.authorName}
                  className="w-12 h-12 rounded-full object-cover border border-dashed border-black/10"
                />
              )}
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">
                  {video.authorName}
                </span>
                {video.createdBy && (
                  <span className="text-xs text-gray-600">
                    تم النشر بواسطة {video.createdBy}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Video Player */}
        <div className="mb-6">
          {videoSource ? (
            <div className="border border-dashed border-black/10 rounded-lg overflow-hidden">
              <VideoPlayer
                src={videoSource}
                poster={video.videoThumbnailUrl || undefined}
                title={video.title}
                autoPlay={false}
                muted={false}
                loop={false}
                initialVolume={0.8}
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-100 border border-dashed border-black/10 rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <p className="text-gray-900 font-medium mb-2">لا يوجد مصدر فيديو متاح</p>
                <p className="text-gray-600 text-sm">
                  الرجاء التحقق من رابط الفيديو
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-dashed border-black/10">
            {video.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium text-gray-700 border border-dashed border-black/10 rounded-lg hover:bg-black/5 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Description / Content */}
        {video.summary && (
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed">
              {video.summary}
            </p>
          </div>
        )}

        {video.content && !video.summary && !video.content.toLowerCase().includes('video content') && (
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-800 leading-relaxed">
              {video.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}