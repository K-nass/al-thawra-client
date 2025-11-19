import { useLoaderData } from "react-router";
import { PostDetails } from "../components/Post";
import axiosInstance from "~/lib/axios";
import { cache, CacheTTL } from "~/lib/cache";

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

  console.log("🔍 Writers Opinion Loader - Slug:", slug);
  console.log("🔍 Original param:", params.slug);

  try {
    const cacheKey = `writers-opinion:${slug}`;
    
    const article = await cache.getOrFetch(
      cacheKey,
      async () => {
        console.log("📡 Step 1: Fetching posts with HasAuthor=true");
        
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

        console.log("📊 Total posts with authors:", searchResponse.data.totalCount);
        console.log("📋 Posts found:", searchResponse.data.items.length);

        // Find the post with matching slug
        const matchingPost = searchResponse.data.items.find(
          (post) => post.slug === slug
        );

        console.log("🎯 Matching post:", matchingPost ? "Found" : "Not found");

        if (!matchingPost) {
          console.error("❌ Article not found with slug:", slug);
          console.log("Available slugs:", searchResponse.data.items.map(p => p.slug).slice(0, 10));
          throw new Error("Article not found");
        }

        console.log("✅ Found post with categorySlug:", matchingPost.categorySlug);

        // Step 2: Get full article details using the correct API endpoint
        // /api/v1/posts/categories/{CategorySlug}/articles/{Slug}
        const articleUrl = `/posts/categories/${matchingPost.categorySlug}/articles/${slug}`;
        console.log("📡 Step 2: Fetching article from:", articleUrl);
        
        const articleResponse = await axiosInstance.get<ArticleResponse>(articleUrl);
        
        console.log("✅ Article loaded successfully:", articleResponse.data.title);
        
        return articleResponse.data;
      },
      CacheTTL.MEDIUM
    );
    
    return {
      article,
    };
  } catch (error: any) {
    console.error("❌ Error loading writers opinion article:", error);
    console.error("Error details:", error.response?.data || error.message);
    throw new Response("Article not found", { status: 404 });
  }
};

export function meta({ data }: MetaArgs) {
  const article = data?.article;

  return [
    { title: article?.title ? `${article.title} - كتاب وآراء` : "كتاب وآراء - الثورة" },
    {
      name: "description",
      content: article?.summary || article?.content?.substring(0, 160) || "اقرأ المزيد على الثورة",
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
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <a href="/" className="hover:text-[var(--color-primary)] transition-colors">
          الرئيسية
        </a>
        <span>/</span>
        <a href="/writers-opinions" className="hover:text-[var(--color-primary)] transition-colors">
          كتاب وآراء
        </a>
        <span>/</span>
        <span className="text-[var(--color-text-primary)] font-medium">
          {article.title}
        </span>
      </div>

      {/* Author Header Card */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-secondary)] rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          {article.authorImage ? (
            <img
              src={article.authorImage}
              alt={article.authorName}
              className="w-20 h-20 rounded-xl object-cover border-4 border-white/30"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
              <span className="text-3xl font-bold">
                {article.authorName?.charAt(0) || "ك"}
              </span>
            </div>
          )}
          <div className="flex-1">
            <div className="text-sm text-white/80 mb-1">بقلم</div>
            <h2 className="text-2xl font-bold mb-2">{article.authorName}</h2>
            <div className="flex items-center gap-4 text-sm text-white/90">
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
