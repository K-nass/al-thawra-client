import { useEffect, useRef, useState, useCallback } from "react";
import type { Route } from "./+types/kitabat.$categorySlug.$slug";
import { PostHeader } from "../components/Post/PostHeader";
import { PostMeta } from "../components/Post/PostHeader";
import { PostImage } from "../components/Post/PostImage";
import { PostContent } from "../components/Post/PostContent";
import { AuthorDetailsMini, KitabatAuthorCard } from "../components/Post/AuthorCard";
import { CommentsSection, PostDetails } from "../components/Post";
import { cache, CacheTTL } from "~/lib/cache";
import { generateMetaTags, generateArticleSchema, generateBreadcrumbSchema } from "~/utils/seo";
import { postsService, type Post } from "~/services/postsService";
import { writersService, type Writer } from "~/services/writersService";
import { Link } from "react-router";
import { cleanPlainText } from "~/utils/arabicTextUtils";
import { buildAuthorArticlesPath } from "~/lib/authorRoutes";

interface ArticleResponse {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string;
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
  ownerIsChiefEditor?: boolean;
  writerId?: string;
  hasWriter?: boolean;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  tags: string[];
  likedByUsers?: string[];
}

function pickFirstString(...values: Array<string | null | undefined>) {
  const value = values.find((item) => typeof item === "string" && item.trim().length > 0);
  return typeof value === "string" ? value : undefined;
}

function getWriterSocialLinks(writer: Writer | null | undefined) {
  const social = writer?.socialAccounts;

  return {
    facebookUrl: pickFirstString(writer?.facebookUrl, writer?.facebook, social?.facebook, social?.Facebook),
    twitterUrl: pickFirstString(writer?.twitterUrl, writer?.twitter, social?.twitter, social?.Twitter),
    instagramUrl: pickFirstString(writer?.instagramUrl, writer?.instagram, social?.instagram, social?.Instagram),
    linkedinUrl: pickFirstString(writer?.linkedInUrl, writer?.linkedIn, writer?.linkedin, social?.linkedin, social?.LinkedIn),
    telegramUrl: pickFirstString(writer?.telegramUrl, writer?.telegram, social?.telegram, social?.Telegram),
    whatsAppUrl: pickFirstString(writer?.whatsAppUrl, writer?.whatsApp, social?.whatsApp, social?.WhatsApp),
    youtubeUrl: pickFirstString(writer?.youtubeUrl, writer?.youtube, social?.youtube, social?.YouTube),
  };
}

function getArticleSummary(article: ArticleResponse) {
  return cleanPlainText(article.summary || article.description || article.content.substring(0, 155));
}

function toArticleResponse(post: Post): ArticleResponse {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    summary: post.summary || post.description || "",
    description: post.description,
    content: post.content || "",
    image: post.image,
    imageDescription: post.imageDescription || "",
    additionalImages: post.additionalImages || [],
    status: post.status,
    language: post.language,
    isFeatured: post.isFeatured,
    isBreaking: post.isBreaking,
    isSlider: post.isSlider,
    isRecommended: post.isRecommended,
    viewsCount: post.viewsCount,
    likesCount: post.likesCount,
    createdAt: post.createdAt,
    createdBy: post.createdBy,
    publishedAt: post.publishedAt,
    authorId: post.authorId,
    authorName: post.authorName,
    authorSlug: post.authorSlug,
    authorImage: post.authorImage,
    ownerIsAuthor: post.ownerIsAuthor,
    ownerIsChiefEditor: post.ownerIsChiefEditor,
    writerId: post.writerId,
    hasWriter: post.hasWriter,
    categoryId: post.categoryId,
    categoryName: post.categoryName,
    categorySlug: post.categorySlug,
    tags: post.tags,
    likedByUsers: [],
  };
}

function useInfiniteArticles(
  categorySlug: string,
  currentSlug: string
) {
  const [queue, setQueue] = useState<Post[]>([]);
  const [articles, setArticles] = useState<ArticleResponse[]>([]);
  const [queueFetched, setQueueFetched] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const queueIndex = useRef(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (queueFetched) return;
    setQueueFetched(true);
    postsService
      .getPosts({
        hasWriter: true,
        pageNumber: 1,
        pageSize: 90,
      })
      .then((res) => {
        const filtered = res.items.filter(
          (p) => p.categorySlug === categorySlug && p.slug !== currentSlug
        );
        setQueue(filtered);
      })
      .catch(() => {});
  }, [categorySlug, currentSlug, queueFetched]);

  const fetchNext = useCallback(() => {
    const next = queue[queueIndex.current];
    if (!next || loadingNext) return;

    setLoadingNext(true);
    queueIndex.current += 1;
    setArticles((prev) => [...prev, toArticleResponse(next)]);
    setLoadingNext(false);
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

function InlineArticle({ article }: { article: ArticleResponse }) {
  const ref = useRef<HTMLElement>(null);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
          authorHref={buildAuthorArticlesPath(article.writerId || article.authorSlug, article.authorName)}
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

function MostReadSidebar({ todayPosts, weekPosts }: { todayPosts: Post[]; weekPosts: Post[] }) {
  const [activeTab, setActiveTab] = useState<"today" | "week">("today");
  const posts = activeTab === "today" ? todayPosts : weekPosts;
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="border border-dashed border-black/10 p-4">
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

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { slug, categorySlug } = params;

  try {
    const [kitabatPosts, mostReadToday, mostReadWeek] = await Promise.all([
      cache.getOrFetch(
        "posts:kitabat:90",
        () => postsService.getPosts({ hasWriter: true, pageNumber: 1, pageSize: 90 }),
        CacheTTL.SHORT
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

    const articlePost = kitabatPosts.items.find(
      (item) => item.slug === slug && item.categorySlug === categorySlug
    );

    if (!articlePost) {
      throw new Response("Article not found", { status: 404 });
    }

    const article = toArticleResponse(articlePost);

    const writer = article.writerId
      ? await cache.getOrFetch(
        `writer:${article.writerId}`,
        () => writersService.getWriterById(article.writerId as string),
        CacheTTL.MEDIUM
      ).catch(() => null)
      : null;

    return {
      article,
      writer,
      mostReadToday: mostReadToday.items.slice(0, 5),
      mostReadWeek: mostReadWeek.items.slice(0, 5),
    };
  } catch (error) {
    throw new Response("Article not found", { status: 404 });
  }
};

export function meta({ loaderData }: Route.MetaArgs) {
  const article = loaderData?.article;
  const writer = loaderData?.writer;

  if (!article) {
    return [
      { title: "مقالة غير موجودة | الثورة" },
      { name: "robots", content: "noindex" },
    ];
  }

  return [
    ...generateMetaTags({
      title: article.title,
      description: getArticleSummary(article),
      image: article.image,
      url: `/kitabat/${article.categorySlug}/articles/${article.slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.publishedAt,
      author: writer?.name || article.authorName,
      section: article.categoryName,
      tags: article.tags,
    }),
    {
      "script:ld+json": generateArticleSchema({
        title: article.title,
        description: getArticleSummary(article),
        image: article.image,
        publishedAt: article.publishedAt,
        updatedAt: article.publishedAt,
        authorName: writer?.name || article.authorName,
        authorSlug: writer?.name || article.authorName,
        categoryName: article.categoryName,
        content: article.content,
        url: `/kitabat/${article.categorySlug}/articles/${article.slug}`,
      }),
    },
    {
      "script:ld+json": generateBreadcrumbSchema([
        { name: "الرئيسية", url: "/" },
        { name: article.categoryName, url: `/category/${article.categorySlug}` },
        { name: article.title, url: `/kitabat/${article.categorySlug}/articles/${article.slug}` },
      ]),
    },
  ];
}

export default function ArticlePage({
  loaderData,
}: Route.ComponentProps) {
  const { article, writer, mostReadToday, mostReadWeek } = loaderData;
  const { articles, loadingNext, sentinelRef } = useInfiniteArticles(
    article.categorySlug,
    article.slug
  );
  const writerSocialLinks = getWriterSocialLinks(writer);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const authorName = writer?.name || article.authorName || article.createdBy;
  const authorHref = buildAuthorArticlesPath(
    article.writerId || article.authorSlug,
    authorName
  );
  const authorImage = writer?.imageUrl || article.authorImage || undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-0">
      <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
        <aside className="w-full lg:w-72 shrink-0 order-1 lg:order-1">
          <KitabatAuthorCard
            name={writer?.name || article.authorName || article.createdBy}
            bio={writer?.bio || undefined}
            image={writer?.imageUrl || article.authorImage || undefined}
            href={authorHref}
            {...writerSocialLinks}
          />
        </aside>

        <main className="flex-1 min-w-0 order-2 lg:order-2">
          <PostDetails
            category={article.categoryName}
            categoryHref={`/category/${article.categorySlug}`}
            title={article.title}
            date={formattedDate}
            commentsCount={0}
            authorName={article.authorName}
            authorHref={authorHref}
            imageSrc={article.image}
            imageAlt={article.imageDescription}
            content={article.content}
            registerHref="/register"
            loginHref="/login"
            authorCard={
              <AuthorDetailsMini
                name={authorName}
                image={authorImage}
                href={authorHref}
              />
            }
          />
        </main>

        <aside className="w-full lg:w-72 shrink-0 order-3 lg:order-3">
          <MostReadSidebar todayPosts={mostReadToday} weekPosts={mostReadWeek} />
        </aside>
      </div>
    </div>
  );
}
