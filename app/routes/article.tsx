import { useEffect, useRef, useState, useCallback } from "react";
import type { Route } from "./+types/article";
import { PostHeader } from "../components/Post/PostHeader";
import { PostMeta } from "../components/Post/PostHeader";
import { PostImage } from "../components/Post/PostImage";
import { PostContent } from "../components/Post/PostContent";
import { AuthorCard } from "../components/Post/AuthorCard";
import { CommentsSection, PostDetails } from "../components/Post";
import axiosInstance from "~/lib/axios";
import { cache, CacheTTL } from "~/lib/cache";
import { generateMetaTags, generateArticleSchema, generateBreadcrumbSchema } from "~/utils/seo";
import { postsService, type Post, type PaginatedPostsResponse } from "~/services/postsService";
import { Link } from "react-router";

interface ArticleResponse {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string;
  imageDescription: string;
  additionalImages: string[];
  status: string;
  language: string;
  isFeatured: boolean;
  isBreaking: boolean;
  isSlider: boolean;
  isRecommended: boolean;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  createdBy: string;
  publishedAt: string;
  authorId: string;
  authorName: string;
  authorSlug: string;
  authorImage: string;
  ownerIsAuthor: boolean;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  tags: string[];
  likedByUsers: string[];
}

// Hook: fetch related posts lazily when sentinel enters viewport
function useInfiniteArticles(
  categorySlug: string,
  currentSlug: string,
  currentCategorySlug: string
) {
  // Queue of post stubs fetched from the listing endpoint
  const [queue, setQueue] = useState<Post[]>([]);
  // Full article details loaded so far
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [queueFetched, setQueueFetched] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const queueIndex = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Fetch the list of related posts once
  useEffect(() => {
    if (queueFetched) return;
    setQueueFetched(true);
    axiosInstance
      .get<PaginatedPostsResponse>("/posts/categories/articles", {
        params: {
          CategorySlug: categorySlug,
          PageNumber: 1,
          PageSize: 15,
          HasAuthor: false,
          IsArgent: false,
          IsChiefEditorPost: false,
        },
      })
      .then((res) => {
        const filtered = res.data.items.filter((p) => p.slug !== currentSlug);
        setQueue(filtered);
      })
      .catch(() => { });
  }, [categorySlug, currentSlug, queueFetched]);

  // Fetch next article details when sentinel enters viewport
  const fetchNext = useCallback(() => {
    const next = queue[queueIndex.current];
    if (!next || loadingNext) return;

    setLoadingNext(true);
    axiosInstance
      .get<ArticleResponse>(
        `/posts/categories/${next.categorySlug}/articles/${next.slug}`
      )
      .then((res) => {
        queueIndex.current += 1;
        setArticles((prev) => [...prev, res.data]);
      })
      .catch(() => { })
      .finally(() => setLoadingNext(false));
  }, [queue, loadingNext]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || queue.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNext();
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [queue, fetchNext]);

  return { articles, loadingNext, sentinelRef };
}

// A single lazily-loaded article rendered inline
function InlineArticle({ article }: { article: ArticleResponse }) {
  const ref = useRef<HTMLElement>(null);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Update URL as article scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.history.replaceState(
            null,
            "",
            `/posts/categories/${article.categorySlug}/articles/${article.slug}`
          );
          document.title = article.title;
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [article]);

  return (
    <article ref={ref} className="border-t border-dashed border-black/10 mt-8">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <PostHeader
          category={article.categoryName}
          categoryHref={`/category/${article.categorySlug}`}
          title={article.title}
        />
        <PostMeta
          date={formattedDate}
          commentsCount={0}
          authorName={article.authorName}
          authorHref={article.authorId ? `/author/${article.authorId}` : undefined}
          title={article.title}
        />
        {article.image && article.image !== "null" && article.image !== "undefined" && (
          <PostImage src={article.image} alt={article.imageDescription} />
        )}
        <PostContent content={article.content} />
      </div>
    </article>
  );
}

// Most Read sidebar widget
function MostReadSidebar({ todayPosts, weekPosts }: { todayPosts: Post[]; weekPosts: Post[] }) {
  const [activeTab, setActiveTab] = useState<"today" | "week">("today");
  const posts = activeTab === "today" ? todayPosts : weekPosts;
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="border border-dashed border-black/10 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">الأكثر قراءة</h3>
        <div className="flex border border-black/20 overflow-hidden text-sm">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-3 py-1 transition-colors cursor-pointer ${activeTab === "today"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
          >
            اليوم
          </button>
          <button
            onClick={() => setActiveTab("week")}
            className={`px-3 py-1 transition-colors cursor-pointer ${activeTab === "week"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
          >
            الأسبوع
          </button>
        </div>
      </div>

      {posts.length === 0 ? null : (
        <>
          {/* Featured top post with image */}
          {featured && (
            <Link
              to={`/posts/categories/${featured.categorySlug}/articles/${featured.slug}`}
              className="block mb-4 group"
            >
              {featured.image && featured.image !== "null" && featured.image !== "undefined" ? (
                <img
                  src={featured.image}
                  alt={featured.imageDescription || featured.title}
                  className="w-full aspect-video object-cover mb-2"
                  loading="lazy"
                />
              ) : (
                <div className="w-full aspect-video bg-gray-100 flex items-center justify-center mb-2">
                  <span className="text-gray-400 text-sm">لا توجد صورة</span>
                </div>
              )}
            </Link>
          )}

          {/* Numbered list */}
          <ol className="space-y-0">
            {(featured ? [featured, ...rest] : posts).map((post, index) => (
              <li key={post.id}>
                <Link
                  to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                  className="flex items-start gap-3 py-3 border-b border-dashed border-black/10 last:border-b-0 group"
                >
                  <span className="text-2xl font-bold text-gray-900 leading-none mt-0.5 min-w-6 text-center">
                    {index + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                </Link>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

// Loader function for SSR with caching
export const loader = async ({ params }: Route.LoaderArgs) => {
  const { slug, categorySlug } = params;

  try {
    const cacheKey = `article:${categorySlug}:${slug}`;

    const [response, mostReadToday, mostReadWeek] = await Promise.all([
      cache.getOrFetch(
        cacheKey,
        () => axiosInstance.get<ArticleResponse>(
          `/posts/categories/${categorySlug}/articles/${slug}`
        ),
        CacheTTL.MEDIUM
      ),
      cache.getOrFetch(
        "posts:most-read:today",
        () => postsService.getPosts({ isBreaking: true, pageSize: 15 }),
        CacheTTL.SHORT
      ).catch(() => ({ items: [] } as { items: Post[] })),
      cache.getOrFetch(
        "posts:most-read:week",
        () => postsService.getPosts({ isFeatured: true, pageSize: 15 }),
        CacheTTL.SHORT
      ).catch(() => ({ items: [] } as { items: Post[] })),
    ]);

    return {
      article: response.data,
      mostReadToday: mostReadToday.items.slice(0, 5),
      mostReadWeek: mostReadWeek.items.slice(0, 5),
    };
  } catch (error) {
    throw new Response("Article not found", { status: 404 });
  }
};

export function meta({ loaderData }: Route.MetaArgs) {
  const article = loaderData?.article;

  if (!article) {
    return [
      { title: "مقالة غير موجودة | الثورة" },
      { name: "robots", content: "noindex" },
    ];
  }

  return [
    ...generateMetaTags({
      title: article.title,
      description: article.summary || article.content.substring(0, 155),
      image: article.image,
      url: `/posts/categories/${article.categorySlug}/articles/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.publishedAt,
      author: article.authorName,
      section: article.categoryName,
      tags: article.tags,
    }),
    {
      "script:ld+json": generateArticleSchema({
        title: article.title,
        description: article.summary,
        image: article.image,
        publishedAt: article.publishedAt,
        updatedAt: article.publishedAt,
        authorName: article.authorName,
        authorSlug: article.authorName,
        categoryName: article.categoryName,
        content: article.content,
        url: `/posts/categories/${article.categorySlug}/articles/${article.slug}`,
      }),
    },
    {
      "script:ld+json": generateBreadcrumbSchema([
        { name: "الرئيسية", url: "/" },
        { name: article.categoryName, url: `/category/${article.categorySlug}` },
        { name: article.title, url: `/posts/categories/${article.categorySlug}/articles/${article.slug}` },
      ]),
    },
  ];
}

export default function ArticlePage({
  loaderData,
}: Route.ComponentProps) {
  const { article, mostReadToday, mostReadWeek } = loaderData;
  const { articles, loadingNext, sentinelRef } = useInfiniteArticles(
    article.categorySlug,
    article.slug,
    article.categorySlug
  );

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main article column */}
        <div className="flex-1 min-w-0">
          {/* Primary article via SSR */}
          <PostDetails
            category={article.categoryName}
            categoryHref={`/category/${article.categorySlug}`}
            title={article.title}
            date={formattedDate}
            commentsCount={0}
            authorName={article.authorName}
            authorHref={article.authorId ? `/author/${article.authorId}` : undefined}
            imageSrc={article.image}
            imageAlt={article.imageDescription}
            content={article.content}
            registerHref="/register"
            loginHref="/login"
            authorCard={
              <AuthorCard
                name="سام عٍبَدِ الُِلُِه الُِغبَارٍى"
                image="/images/سام.png"
              />
            }
          />

          {/* Inline articles loaded on scroll */}
          {articles.map((a) => (
            <InlineArticle key={a.id} article={a} />
          ))}

          {/* Sentinel — triggers next fetch when visible */}
          <div ref={sentinelRef} className="h-1" />

          {loadingNext && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Sticky sidebar */}
        <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-4">
          <MostReadSidebar todayPosts={mostReadToday} weekPosts={mostReadWeek} />
        </aside>
      </div>
      {/* Comments Section - Login/Register Prompt */}
      <CommentsSection
        registerHref="/register"
        loginHref="/login"
      />
    </div>
  );
}
