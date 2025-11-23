import { useParams, useNavigation } from "react-router";
import type { Route } from "./+types/article";
import {
  PostDetails,
} from "../components/Post";
import { PostCard, type Post } from "../components/PostCard";
import { ArticlePageSkeleton } from "../components/skeletons";
import axiosInstance from "~/lib/axios";
import { cache, CacheTTL } from "~/lib/cache";
import { generateMetaTags, generateArticleSchema, generateBreadcrumbSchema } from "~/utils/seo";

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
        updatedAt: article.publishedAt, // Add updatedAt field if available in API
        authorName: article.authorName,
        authorSlug: article.authorId, // Use authorId as slug for now
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
