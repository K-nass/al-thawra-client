import { useLoaderData } from "react-router";
import { PostDetails } from "../components/Post";
import axiosInstance from "~/lib/axios";
import { cache, CacheTTL } from "~/lib/cache";
import { generateMetaTags, generateArticleSchema } from "~/utils/seo";

interface LoaderArgs {
  params: {
    slug: string;
  };
}

interface LoaderData {
  article: ArticleResponse;
}

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
  authorImage: string;
  ownerIsAuthor: boolean;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  authorSlug: string;
  tags: string[];
  likedByUsers: string[];
}

interface MetaArgs {
  data?: LoaderData;
}

// Loader function for SSR with caching
export const loader = async ({ params }: LoaderArgs) => {
  // Decode the slug in case it's URL-encoded (for Arabic slugs)
  const slug = decodeURIComponent(params.slug || "");

  try {
    const cacheKey = `writers-opinion:${slug}`;

    const article = await cache.getOrFetch(
      cacheKey,
      async () => {
        // Step 1: Search for the post with HasAuthor=true to get the categorySlug
        const searchResponse = await axiosInstance.get<{
          items: Array<{ categorySlug: string; slug: string }>;
          totalCount: number;
        }>(`/posts`, {
          params: {
            HasAuthor: true,
            PageSize: 90, // Get more posts to search through (max allowed: 15, 30, 60, 90)
          },
        });

        // Find the post with matching slug
        const matchingPost = searchResponse.data.items.find(
          (post) => post.slug === slug
        );

        if (!matchingPost) {
          throw new Error("Article not found");
        }

        // Step 2: Get full article details using the correct API endpoint
        // /api/v1/posts/categories/{CategorySlug}/articles/{Slug}
        const articleUrl = `/posts/categories/${matchingPost.categorySlug}/articles/${slug}`;

        const articleResponse = await axiosInstance.get<ArticleResponse>(articleUrl);

        return articleResponse.data;
      },
      CacheTTL.MEDIUM
    );

    return {
      article,
    };
  } catch (error: any) {
    throw new Response("Article not found", { status: 404 });
  }
};

export function meta({ data }: MetaArgs) {
  if (!data?.article) {
    return [
      { title: "مقال غير موجود | الثورة" },
      { name: "robots", content: "noindex" },
    ];
  }

  const article = data.article;

  return [
    ...generateMetaTags({
      title: `${article.title} - كتاب وآراء`,
      description: article.summary || article.content?.substring(0, 160) || "",
      url: `/writers-opinions/${article.slug}`,
      type: "article",
      image: article.image,
    }),
    {
      "script:ld+json": generateArticleSchema({
        title: article.title,
        description: article.summary || article.content?.substring(0, 160) || "",
        image: article.image,
        publishedAt: article.publishedAt,
        updatedAt: article.publishedAt,
        authorName: article.authorName,
        authorSlug: article.authorName,
        categoryName: "كتاب وآراء",
        content: article.content,
        url: `/writers-opinions/${article.slug}`,
      }),
    },
  ];
}

export default function WritersOpinionDetailPage() {
  const { article } = useLoaderData<LoaderData>();

  // Format date
  const formattedDate = new Date(article.publishedAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* Breadcrumb */}
      <div>
        <a href="/">
          الرئيسية
        </a>
        <span>/</span>
        <a href="/writers-opinions">
          كتاب وآراء
        </a>
        <span>/</span>
        <span>
          {article.title}
        </span>
      </div>

      {/* Author Header Card */}
      <div>
        <div>
          {article.authorImage ? (
            <img
              src={article.authorImage}
              alt={article.authorName}
            />
          ) : (
            <div>
              <span>
                {article.authorName?.charAt(0) || "ك"}
              </span>
            </div>
          )}
          <div>
            <div>بقلم</div>
            <h2>{article.authorName}</h2>
            <div>
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{article.categoryName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <PostDetails
        category="كتاب وآراء"
        categoryHref="/writers-opinions"
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
        relatedPostsTitle="مقالات ذات صلة من نفس الكاتب"
        relatedPosts={null}
      />
    </div>
  );
}
