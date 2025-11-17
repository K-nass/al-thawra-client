import type { Route } from "./+types/category.$slug";
import { useLoaderData, Link, useNavigation } from "react-router";
import { useState } from "react";
import { PostsGrid } from "../components/PostsGrid";
import { CategoryPageSkeleton } from "../components/skeletons";
import { EmptyState } from "../components/EmptyState";
import { postsService } from "../services/postsService";
import { categoriesService } from "../services/categoriesService";

// Loader function for server-side data fetching
export async function loader({ params }: Route.LoaderArgs) {
  const slug = params.slug;

  try {
    // Fetch category details and posts in parallel
    const [category, postsResponse] = await Promise.all([
      categoriesService.getCategoryBySlug(slug),
      postsService.getPostsByCategory(slug, { pageSize: 15 }),
    ]);

    return {
      category,
      posts: postsResponse.items,
      totalPosts: postsResponse.totalCount,
      currentPage: postsResponse.pageNumber,
      totalPages: postsResponse.totalPages,
    };
  } catch (error: any) {
    console.error(`Error loading category ${slug}:`, error.response?.data || error.message);
    throw new Response("Category not found", { status: 404 });
  }
}

// Loading fallback
export function HydrateFallback() {
  return <CategoryPageSkeleton />;
}

export default function CategoryPage() {
  const { category, posts: initialPosts, totalPosts, currentPage: initialPage } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  
  // State for managing loaded posts
  const [posts, setPosts] = useState(initialPosts);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Show loading skeleton during navigation
  if (navigation.state === "loading") {
    return <CategoryPageSkeleton />;
  }
  
  // Load more posts function
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await postsService.getPostsByCategory(category.slug, { 
        pageNumber: nextPage,
        pageSize: 15 
      });
      
      setPosts(prevPosts => [...prevPosts, ...response.items]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };
  
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
                {category.subCategories.map((subcategory) => (
                  <Link
                    key={subcategory.slug}
                    to={`/category/${subcategory.slug}`}
                    className="px-3 py-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-blue-50 rounded-md transition-all font-medium border border-gray-200"
                  >
                    {subcategory.name}
                  </Link>
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
      {posts.length > 0 ? (
        <div>
          <PostsGrid 
            posts={posts} 
            showCategoryHeader={false}
            postsPerPage={posts.length}
          />
          
          {/* Load More Button */}
          {totalPosts > posts.length && (
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
                  `تحميل المزيد (${totalPosts - posts.length} مقالة متبقية)`
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
