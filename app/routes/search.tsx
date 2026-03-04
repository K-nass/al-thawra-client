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
    return {
      query,
      posts: [],
      totalPosts: 0,
      currentPage: 1,
      totalPages: 0,
    };
  }
}

import { generateMetaTags } from "~/utils/seo";

export function meta({ data }: Route.MetaArgs) {
  const query = data?.query || "";
  const totalPosts = data?.totalPosts || 0;
  
  return generateMetaTags({
    title: query ? `نتائج البحث: "${query}"` : "البحث",
    description: query 
      ? `عثرنا على ${totalPosts} نتيجة للبحث عن "${query}" في الثورة`
      : "ابحث في آلاف المقالات والأخبار على موقع الثورة",
    url: `/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
    noindex: true, // Don't index search results
  });
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
      // Error loading more posts
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div>
      {/* Search Header */}
      <div>
        <h1>
          البحث في الثورة
        </h1>

        {/* Search Form */}
        <Form method="get">
          <div>
            <input
              type="search"
              name="q"
              defaultValue={initialQuery}
              placeholder="ابحث عن مقالات، أخبار، كتاب..."
              dir="rtl"
            />
            <Search />
          </div>
          <button
            type="submit"
          >
            بحث
          </button>
        </Form>

        {/* Search Results Info */}
        {initialQuery && (
          <div>
            <span>نتائج البحث عن:</span>
            <span>"{initialQuery}"</span>
            <span>({totalPosts} نتيجة)</span>
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
            <div>
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <span>
                    <span></span>
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
