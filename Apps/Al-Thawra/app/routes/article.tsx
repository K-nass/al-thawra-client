import { useParams, useNavigation } from "react-router";
import type { Route } from "./+types/article";
import {
  PostDetails,
  PostHeader,
  PostImage,
  PostContent,
  CommentsSection,
  RelatedPosts,
} from "../components/Post";
import { PostCard, type Post } from "../components/PostCard";
import { ArticlePageSkeleton } from "../components/skeletons";

// Mock data - replace with actual API calls
const mockArticles: Record<
  string,
  {
    category: string;
    categoryHref: string;
    title: string;
    date: string;
    commentsCount: number;
    imageSrc: string;
    imageAlt: string;
    content: string;
    relatedPosts?: Post[];
  }
> = {
  "1": {
    category: "محليات",
    categoryHref: "/category/local",
    title: "مساعد وزير الخارجية لشؤون أوروبا: تطوير علاقاتنا مع السويد",
    date: "13 نوفمبر 2025",
    commentsCount: 0,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDiLt-4_ERB89RMxttTNfhimylfqIc2GzNQlJHIGpe3O3zYfXT7wU8at0z7zIN3jK3eJ3a9AYf0S9vuPpfaH6HVeGoFNdFXKL5PW9EUWpzyzGh_wkuq0eY0-1H1h6hC5jcNNLyuAAK5jQuq1Asn0i4nuD_YpxZpjEu9fT3n-TE1OQ0yT1dQ-oYIxPvSdln9gUfbBpXtZeSBOtTQe2-w0q4yHlcWI-fsuED8I9nKzlmSZbZSmPJWUoUkwuxJcoHyG637uZ63PDiHtXBF",
    imageAlt: "Two diplomats shaking hands in a formal setting",
    content: `مساعد وزير الخارجية لشؤون أوروبا يؤكد على أهمية تطوير العلاقات الثنائية مع السويد في مختلف المجالات.

وأشار المسؤول إلى أن العلاقات بين البلدين تشهد تطورا ملحوظا على الصعيد الاقتصادي والثقافي والسياسي.

وأضاف أن هناك فرصا كبيرة للتعاون المشترك في مجالات التكنولوجيا والطاقة والتعليم.`,
    relatedPosts: [
      {
        id: "2",
        title: "اتفاقية تعاون اقتصادي جديدة بين دول الخليج",
        slug: "economic-cooperation-agreement",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDiLt-4_ERB89RMxttTNfhimylfqIc2GzNQlJHIGpe3O3zYfXT7wU8at0z7zIN3jK3eJ3a9AYf0S9vuPpfaH6HVeGoFNdFXKL5PW9EUWpzyzGh_wkuq0eY0-1H1h6hC5jcNNLyuAAK5jQuq1Asn0i4nuD_YpxZpjEu9fT3n-TE1OQ0yT1dQ-oYIxPvSdln9gUfbBpXtZeSBOtTQe2-w0q4yHlcWI-fsuED8I9nKzlmSZbZSmPJWUoUkwuxJcoHyG637uZ63PDiHtXBF",
        categoryName: "اقتصاد",
        categorySlug: "economy",
        publishedAt: "2025-11-14T10:00:00Z",
        createdAt: "2025-11-14T10:00:00Z",
      },
      {
        id: "3",
        title: "مبادرات حكومية لدعم الشركات الناشئة",
        slug: "government-startup-initiatives",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDiLt-4_ERB89RMxttTNfhimylfqIc2GzNQlJHIGpe3O3zYfXT7wU8at0z7zIN3jK3eJ3a9AYf0S9vuPpfaH6HVeGoFNdFXKL5PW9EUWpzyzGh_wkuq0eY0-1H1h6hC5jcNNLyuAAK5jQuq1Asn0i4nuD_YpxZpjEu9fT3n-TE1OQ0yT1dQ-oYIxPvSdln9gUfbBpXtZeSBOtTQe2-w0q4yHlcWI-fsuED8I9nKzlmSZbZSmPJWUoUkwuxJcoHyG637uZ63PDiHtXBF",
        categoryName: "محليات",
        categorySlug: "local",
        publishedAt: "2025-11-13T15:30:00Z",
        createdAt: "2025-11-13T15:30:00Z",
      },
      {
        id: "4",
        title: "العلاقات الدبلوماسية تشهد تطورات إيجابية",
        slug: "diplomatic-relations-developments",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDiLt-4_ERB89RMxttTNfhimylfqIc2GzNQlJHIGpe3O3zYfXT7wU8at0z7zIN3jK3eJ3a9AYf0S9vuPpfaH6HVeGoFNdFXKL5PW9EUWpzyzGh_wkuq0eY0-1H1h6hC5jcNNLyuAAK5jQuq1Asn0i4nuD_YpxZpjEu9fT3n-TE1OQ0yT1dQ-oYIxPvSdln9gUfbBpXtZeSBOtTQe2-w0q4yHlcWI-fsuED8I9nKzlmSZbZSmPJWUoUkwuxJcoHyG637uZ63PDiHtXBF",
        categoryName: "سياسة",
        categorySlug: "politics",
        publishedAt: "2025-11-12T09:15:00Z",
        createdAt: "2025-11-12T09:15:00Z",
      },
    ],
  },
};

export function meta({ params }: Route.MetaArgs) {
  const article = mockArticles[params.id];

  return [
    { title: article?.title || "مقالة - القبس" },
    {
      name: "description",
      content: article?.content.substring(0, 160) || "اقرأ المزيد على القبس",
    },
  ];
}

// Loading fallback
export function HydrateFallback() {
  return <ArticlePageSkeleton />;
}

export default function ArticlePage({ params }: Route.ComponentProps) {
  const navigation = useNavigation();
  const article = mockArticles[params.id];
  
  // Show loading skeleton during navigation
  if (navigation.state === "loading") {
    return <ArticlePageSkeleton />;
  }
  
  return (
    <PostDetails
      category={article.category}
      categoryHref={article.categoryHref}
      title={article.title}
      date={article.date}
      commentsCount={article.commentsCount}
      imageSrc={article.imageSrc}
      imageAlt={article.imageAlt}
      content={article.content}
      registerHref="/register"
      loginHref="/login"
      relatedPostsTitle="مقالات ذات صلة"
      relatedPosts={
        article.relatedPosts && article.relatedPosts.length > 0 && (
          <>
            {article.relatedPosts.slice(0, 3).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </>
        )
      }
    />
  );
}
