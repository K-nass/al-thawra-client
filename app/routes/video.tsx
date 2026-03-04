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
    <div>
      <div>
        {/* Category, Title & Meta */}
        <div>
          {video.categoryName && (
            <span>
              {video.categoryName}
            </span>
          )}
          <h1>
            {video.title}
          </h1>

          {/* Meta row: date, language, views, likes */}
          <div>
            {formattedDate && <span>{formattedDate}</span>}
            {video.language && (
              <span>
                اللغة: {video.language}
              </span>
            )}
            <span>
              المشاهدات: {video.viewsCount?.toLocaleString("en-US")}
            </span>
            <span>
              الإعجابات: {video.likesCount?.toLocaleString("en-US")}
            </span>
          </div>

          {/* Author */}
          {video.authorName && (
            <div>
              {video.authorImage && (
                <img
                  src={video.authorImage}
                  alt={video.authorName}
                />
              )}
              <div>
                <span>
                  {video.authorName}
                </span>
                {video.createdBy && (
                  <span>
                    تم النشر بواسطة {video.createdBy}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Video Player */}
        <div>
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
            <div>
              <div>
                <p>لا يوجد مصدر فيديو متاح</p>
                <p>
                  الرجاء التحقق من رابط الفيديو
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div>
            {video.tags.map((tag) => (
              <span
                key={tag}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Description / Content */}
        {video.summary && (
          <div>
            <p>
              {video.summary}
            </p>
          </div>
        )}

        {video.content && !video.summary && !video.content.toLowerCase().includes('video content') && (
          <div>
            <p>
              {video.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}