import type { Route } from "./+types/category.$slug";
import { useLoaderData, useSearchParams, useFetcher, Link } from "react-router";
import { useState } from "react";
import { PostsGrid } from "../components/PostsGrid";
import { CategoryPageSkeleton } from "../components/skeletons";
import { EmptyState } from "../components/EmptyState";
import { ButtonSpinner } from "../components/Spinner";
import { postsService } from "../services/postsService";
import { categoriesService } from "../services/categoriesService";
import { cache, CacheTTL } from "../lib/cache";

// Loader function for server-side data fetching
export async function loader({ params, request }: Route.LoaderArgs) {
  const slug = params.slug;
  const url = new URL(request.url);
  const subcategorySlug = url.searchParams.get("sub");
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  try {
    // Fetch category details with subcategories (cached)
    const category = await cache.getOrFetch(
      `category:${slug}:details`,
      () => categoriesService.getCategoryBySlug(slug, true),
      CacheTTL.LONG
    );
    
    // Determine which slug to use for posts (subcategory or main category)
    const targetSlug = subcategorySlug || slug;
    
    // Fetch posts for the target category/subcategory (cached)
    const cacheKey = cache.generateKey(`category:${targetSlug}:posts`, { page, pageSize: 15 });
    const postsResponse = await cache.getOrFetch(
      cacheKey,
      () => postsService.getPostsByCategory(targetSlug, { 
        pageNumber: page,
        pageSize: 15 
      }),
      CacheTTL.SHORT
    );

    return {
      category,
      posts: postsResponse.items,
      totalPosts: postsResponse.totalCount,
      currentPage: postsResponse.pageNumber,
      totalPages: postsResponse.totalPages,
      selectedSubcategory: subcategorySlug,
    };
  } catch (error: any) {
    console.error(`Error loading category ${slug}:`, error.response?.data || error.message);
    throw new Response("Category not found", { status: 404 });
  }
}

// Meta tags for SEO
export function meta({ data }: Route.MetaArgs) {
  if (!data) {
    return [
      { title: "Category Not Found - الثورة" },
      { name: "description", content: "The requested category could not be found." },
    ];
  }

  const { category, selectedSubcategory } = data;
  const subcategory = selectedSubcategory 
    ? category.subCategories?.find((sub: any) => sub.slug === selectedSubcategory)
    : null;
  
  const title = subcategory 
    ? `${subcategory.name} - ${category.name} - الثورة`
    : `${category.name} - الثورة`;
  
  const description = category.description || `تصفح أحدث الأخبار والمقالات في قسم ${category.name}`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
  ];
}

// Loading fallback
export function HydrateFallback() {
  return <CategoryPageSkeleton />;
}

export default function CategoryPage() {
  const { category, posts, totalPosts, currentPage, selectedSubcategory } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<typeof loader>();
  
  // Client-only state: how many posts to display (progressive reveal)
  const [displayCount, setDisplayCount] = useState(6);
  
  // Accumulate posts from fetcher loads
  const [accumulatedPosts, setAccumulatedPosts] = useState(posts);
  
  // When loader data changes (navigation/filter), reset accumulated posts and display count
  const loaderKey = `${category.slug}-${selectedSubcategory || 'all'}`;
  const [lastLoaderKey, setLastLoaderKey] = useState(loaderKey);
  
  if (loaderKey !== lastLoaderKey) {
    setAccumulatedPosts(posts);
    setDisplayCount(6);
    setLastLoaderKey(loaderKey);
  }
  
  // When fetcher loads more data, append to accumulated posts
  if (fetcher.data && fetcher.state === "idle") {
    const fetcherPosts = fetcher.data.posts;
    const lastAccumulatedId = accumulatedPosts[accumulatedPosts.length - 1]?.id;
    const firstFetchedId = fetcherPosts[0]?.id;
    
    // Only append if this is new data (avoid duplicates)
    if (fetcherPosts.length > 0 && lastAccumulatedId !== firstFetchedId) {
      setAccumulatedPosts(prev => [...prev, ...fetcherPosts]);
      setDisplayCount(prev => prev + 6);
    }
  }
  
  // Handle subcategory filter change via URL params
  const handleSubcategoryFilter = (subcategorySlug: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (subcategorySlug) {
      newParams.set("sub", subcategorySlug);
    } else {
      newParams.delete("sub");
    }
    newParams.delete("page"); // Reset to page 1
    setSearchParams(newParams, { replace: true });
  };
  
  // Handle load more
  const handleLoadMore = () => {
    // If we have more posts in the current batch, just reveal more
    if (displayCount < accumulatedPosts.length) {
      setDisplayCount(prev => Math.min(prev + 6, accumulatedPosts.length));
      return;
    }
    
    // Otherwise, fetch the next page using fetcher
    const nextPage = Math.floor(accumulatedPosts.length / 15) + 1;
    const params = new URLSearchParams(searchParams);
    params.set("page", String(nextPage));
    
    fetcher.load(`?${params.toString()}`);
  };
  
  // Determine loading state
  const isLoading = fetcher.state === "loading";
  const visiblePosts = accumulatedPosts.slice(0, displayCount);
  const hasMorePosts = displayCount < totalPosts;
  
  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-6 flex-wrap">
          {/* Category Title */}
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">
            {category.name}
          </h1>

          {/* Subcategories */}
          {category.subCategories && category.subCategories.length > 0 && (
            <>
              <span className="text-gray-300">|</span>
              <nav className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleSubcategoryFilter(null)}
                  className={`px-3 py-1 text-sm transition-all font-medium border rounded-md ${
                    selectedSubcategory === null
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-blue-50 border-gray-200'
                  }`}
                >
                  الكل
                </button>
                {category.subCategories.map((subcategory) => (
                  <button
                    key={subcategory.slug}
                    onClick={() => handleSubcategoryFilter(subcategory.slug)}
                    className={`px-3 py-1 text-sm transition-all font-medium border rounded-md ${
                      selectedSubcategory === subcategory.slug
                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-blue-50 border-gray-200'
                    }`}
                  >
                    {subcategory.name}
                  </button>
                ))}
              </nav>
            </>
          )}
        </div>
        {/* Category Description */}
        {category.description && (
          <p className="text-gray-600 mt-2">{category.description}</p>
        )}
      </div>

      {/* Category Posts Grid */}
      {visiblePosts.length > 0 ? (
        <div>
          <PostsGrid 
            posts={visiblePosts} 
            showCategoryHeader={false}
            postsPerPage={visiblePosts.length}
          />
          
          {/* Load More Button - Always show if there are more results */}
          {hasMorePosts && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <ButtonSpinner />
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
          title="لا توجد مقالات في هذا القسم"
          description="لم يتم نشر أي مقالات في هذا القسم بعد"
        />
      )}
    </div>
  );
}
