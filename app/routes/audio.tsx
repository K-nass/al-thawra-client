import { PostDetails } from "../components/Post";
import axiosInstance from "../lib/axios";
import { cache, CacheTTL } from "../lib/cache";

interface AudioResponse {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  audioUrl: string;
  imageUrl: string | null;
  duration: string | null;
  fileSize: string | null;
  format: string | null;
  status: string;
  language: string;
  isFeatured: boolean;
  isBreaking: boolean;
  isSlider: boolean;
  isRecommended: boolean;
  viewsCount: number;
  likesCount: number;
  isLikedByCurrentUser: boolean | null;
  createdAt: string;
  createdBy: string | null;
  publishedAt: string | null;
  authorId: string | null;
  authorName: string | null;
  authorImage: string | null;
  ownerIsAuthor: boolean;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  tags: string[];
  likedByUsers: Array<{
    userName: string;
    imageUrl: string | null;
  }>;
}

// Loader for audio details using /posts/categories/{CategorySlug}/audios/{Slug}
export async function loader({ params }: { params: { slug?: string; categorySlug?: string } }) {
  const { slug, categorySlug } = params;

  try {
    const cacheKey = `audio:${categorySlug}:${slug}`;

    const response = await cache.getOrFetch(
      cacheKey,
      () =>
        axiosInstance.get<AudioResponse>(
          `/posts/categories/${categorySlug}/audios/${slug}`
        ),
      CacheTTL.MEDIUM
    );

    return {
      audio: response.data,
    };
  } catch (error) {
    throw new Response("Audio not found", { status: 404 });
  }
}

export function meta({ loaderData }: { loaderData: { audio: AudioResponse } }) {
  const audio = loaderData?.audio;

  return [
    { title: audio?.title || "بودكاست - الثورة" },
    {
      name: "description",
      content:
        audio?.summary ||
        audio?.content.substring(0, 160) ||
        "استمع إلى المزيد على الثورة",
    },
  ];
}

export default function AudioPage({ loaderData }: { loaderData: { audio: AudioResponse } }) {
  const { audio } = loaderData;

  const dateSource = audio.publishedAt || audio.createdAt;
  const formattedDate = new Date(dateSource).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="lg:col-span-2">
      <PostDetails
        category={audio.categoryName || ""}
        categoryHref={audio.categorySlug ? `/category/${audio.categorySlug}` : undefined}
        title={audio.title}
        date={formattedDate}
        commentsCount={0}
        authorName={audio.authorName || undefined}
        authorHref={audio.authorId ? `/author/${audio.authorId}` : undefined}
        imageSrc=""
        imageAlt={audio.title}
        content={audio.content}
        registerHref="/register"
        loginHref="/login"
        relatedPostsTitle="بودكاست ذات صلة"
        relatedPosts={null}
        extraContentBeforeComments={
          <div className="mt-6 modern-audio-player">
            {audio.imageUrl && (
              <div
                className="modern-audio-player__thumbnail"
                style={{ backgroundImage: `url(${audio.imageUrl})` }}
              />
            )}
            <audio
              src={audio.audioUrl}
              controls
              controlsList="nodownload noplaybackrate noremoteplayback"
            />
          </div>
        }
      />
    </div>
  );
}
