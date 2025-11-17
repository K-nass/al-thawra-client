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
    // Fetch category details with subcategories and posts in parallel
    const [category, postsResponse] = await Promise.all([
      categoriesService.getCategoryBySlug(slug, true), // withSub = true
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
  
  // State for managing loaded posts and filters
  const [posts, setPosts] = useState(initialPosts);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [filteredTotalPosts, setFilteredTotalPosts] = useState(totalPosts);
  
  // Show loading skeleton during navigation
  if (navigation.state === "loading") {
    return <CategoryPageSkeleton />;
  }
  
  // Handle subcategory filter change
  const handleSubcategoryFilter = async (subcategorySlug: string | null) => {
    setSelectedSubcategory(subcategorySlug);
    setIsLoadingMore(true);
    
    try {
      // Fetch posts for the selected subcategory or main category
      const targetSlug = subcategorySlug || category.slug;
      const response = await postsService.getPostsByCategory(targetSlug, { 
        pageSize: 15 
      });
      
      setPosts(response.items);
      setCurrentPage(response.pageNumber);
      setFilteredTotalPosts(response.totalCount);
    } catch (error) {
      console.error('Error filtering posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  // Load more posts function
  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const targetSlug = selectedSubcategory || category.slug;
      const response = await postsService.getPostsByCategory(targetSlug, { 
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
      {posts.length > 0 ? (
        <div>
          <PostsGrid 
            posts={posts} 
            showCategoryHeader={false}
            postsPerPage={posts.length}
          />
          
          {/* Load More Button */}
          {filteredTotalPosts > posts.length && (
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
                  `تحميل المزيد (${filteredTotalPosts - posts.length} مقالة متبقية)`
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
