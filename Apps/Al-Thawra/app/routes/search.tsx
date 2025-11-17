import type { Route } from "./+types/search";
import { useLoaderData, useSearchParams, Form } from "react-router";
import { useState } from "react";
import { PostsGrid } from "../components/PostsGrid";
import { EmptyState } from "../components/EmptyState";
import { postsService } from "../services/postsService";
import { Search, X } from "lucide-react";
import { cache, CacheTTL } from "../lib/cache";

// Loader function for server-side data fetching
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";

  if (!query) {
    return {
      query: "",
      posts: [],
      totalPosts: 0,
      currentPage: 1,
      totalPages: 0,
    };
  }

  try {
    // Cache search results
    const cacheKey = cache.generateKey("search", { q: query, pageSize: 15 });
    const postsResponse = await cache.getOrFetch(
      cacheKey,
      () => postsService.getPosts({
        searchPhrase: query,
        pageSize: 15,
        language: "Arabic",
      }),
      CacheTTL.SHORT
    );

    return {
      query,
      posts: postsResponse.items,
      totalPosts: postsResponse.totalCount,
      currentPage: postsResponse.pageNumber,
      totalPages: postsResponse.totalPages,
    };
  } catch (error: any) {
    console.error("Error searching posts:", error.response?.data || error.message);
    return {
      query,
      posts: [],
      totalPosts: 0,
      currentPage: 1,
      totalPages: 0,
    };
  }
}

export function meta({ data }: Route.MetaArgs) {
  const query = data?.query || "";
  return [
    { title: query ? `نتائج البحث عن: ${query} - الثورة` : "البحث - الثورة" },
    { name: "description", content: `نتائج البحث في صحيفة الثورة` },
  ];
}

export default function SearchPage() {
  const { query: initialQuery, posts: initialPosts, totalPosts, currentPage: initialPage } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState(initialPosts);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayCount, setDisplayCount] = useState(6); // Show 6 posts initially

  // Load more posts function
  const handleLoadMore = async () => {
    if (!initialQuery) return;
    
    setIsLoadingMore(true);
    
    // If we have more posts in the current loaded batch, just show more
    if (displayCount < posts.length) {
      setTimeout(() => {
        setDisplayCount(prev => Math.min(prev + 6, posts.length));
        setIsLoadingMore(false);
      }, 300);
      return;
    }
    
    // Otherwise, fetch the next page
    try {
      const nextPage = currentPage + 1;
      const response = await postsService.getPosts({
        searchPhrase: initialQuery,
        pageNumber: nextPage,
        pageSize: 15,
        language: "Arabic",
      });

      setPosts((prevPosts) => [...prevPosts, ...response.items]);
      setCurrentPage(nextPage);
      setDisplayCount(prev => prev + 6);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
          البحث في الثورة
        </h1>

        {/* Search Form */}
        <Form method="get" className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="search"
              name="q"
              defaultValue={initialQuery}
              placeholder="ابحث عن مقالات، أخبار، كتاب..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              dir="rtl"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium shadow-md hover:shadow-lg"
          >
            بحث
          </button>
        </Form>

        {/* Search Results Info */}
        {initialQuery && (
          <div className="mt-4 flex items-center gap-2 text-gray-600">
            <span>نتائج البحث عن:</span>
            <span className="font-bold text-[var(--color-primary)]">"{initialQuery}"</span>
            <span className="text-sm">({totalPosts} نتيجة)</span>
          </div>
        )}
      </div>

      {/* Search Results */}
      {!initialQuery ? (
        <EmptyState
          title="ابدأ البحث"
          description="استخدم مربع البحث أعلاه للعثور على المقالات والأخبار"
        />
      ) : posts.length > 0 ? (
        <div>
          <PostsGrid posts={posts.slice(0, displayCount)} showCategoryHeader={false} postsPerPage={displayCount} />

          {/* Load More Button - Always show if there are more results */}
          {displayCount < totalPosts && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    جاري التحميل...
                  </span>
                ) : (
                  `تحميل المزيد (${totalPosts - displayCount} مقالة متبقية)`
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="لا توجد نتائج"
          description={`لم نتمكن من العثور على أي نتائج لـ "${initialQuery}". حاول استخدام كلمات مختلفة.`}
        />
      )}
    </div>
  );
}
