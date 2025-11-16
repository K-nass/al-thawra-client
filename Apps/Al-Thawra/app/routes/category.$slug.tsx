import type { Route } from "./+types/category.$slug";
import { useLoaderData, Link } from "react-router";
import { PostsGrid } from "../components/PostsGrid";
import { PostsGridSkeleton } from "../components/LoadingSkeleton";
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
      postsService.getPostsByCategory(slug, { pageSize: 30 }),
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
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <PostsGridSkeleton />
    </div>
  );
}

export default function CategoryPage() {
  const { category, posts, totalPosts } = useLoaderData<typeof loader>();

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
          
          {/* Load More Button - TODO: Implement pagination */}
          {totalPosts > posts.length && (
            <div className="flex justify-center mt-8">
              <button className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium shadow-md hover:shadow-lg">
                تحميل المزيد ({totalPosts - posts.length} مقالة متبقية)
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
