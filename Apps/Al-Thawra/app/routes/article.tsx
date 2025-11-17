import { useParams, useNavigation } from "react-router";
import type { Route } from "./+types/article";
import {
  PostDetails,
} from "../components/Post";
import { PostCard, type Post } from "../components/PostCard";
import { ArticlePageSkeleton } from "../components/skeletons";
import axiosInstance from "~/lib/axios";
import { cache, CacheTTL } from "~/lib/cache";

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
  tags: string[];
  likedByUsers: string[];
}

// Loader function for SSR with caching
export const loader = async ({ params }: Route.LoaderArgs) => {
  const { slug, categorySlug } = params;

  try {
    const cacheKey = `article:${categorySlug}:${slug}`;
    
    const response = await cache.getOrFetch(
      cacheKey,
      () => axiosInstance.get<ArticleResponse>(
        `/posts/categories/${categorySlug}/articles/${slug}`
      ),
      CacheTTL.MEDIUM
    );
    
    return {
      article: response.data,
    };
  } catch (error) {
    console.log(slug);
    throw new Response("Article not found", { status: 404 });
  }
};

export function meta({ loaderData }: Route.MetaArgs) {
  const article = loaderData?.article;

  return [
    { title: article?.title || "مقالة - الثورة" },
    {
      name: "description",
      content: article?.summary || article?.content.substring(0, 160) || "اقرأ المزيد على الثورة",
    },
  ];
}

export default function ArticlePage({
  loaderData,
}: Route.ComponentProps) {
  const { article } = loaderData;

  // Format date
  const formattedDate = new Date(article.publishedAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PostDetails
      category={article.categoryName}
      categoryHref={`/category/${article.categorySlug}`}
      title={article.title}
      date={formattedDate}
      commentsCount={0}
      imageSrc={article.image}
      imageAlt={article.imageDescription}
      content={article.content}
      registerHref="/register"
      loginHref="/login"
      relatedPostsTitle="مقالات ذات صلة"
      relatedPosts={null}
    />
  );
}
