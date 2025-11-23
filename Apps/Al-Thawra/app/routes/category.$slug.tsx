import type { Route } from "./+types/category.$slug";
import { useLoaderData, useSearchParams } from "react-router";
import { ScrollAnimation } from "../components/ScrollAnimation";
import { generateMetaTags, generateCollectionPageSchema } from "~/utils/seo";
import { PostsGrid } from "../components/PostsGrid";
import { CategoryPageSkeleton } from "../components/skeletons";
import { EmptyState } from "../components/EmptyState";
import { postsService } from "../services/postsService";
import { categoriesService } from "../services/categoriesService";
import { cache, CacheTTL } from "../lib/cache";
import { motion } from "framer-motion";

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
      { title: "قسم غير موجود | الثورة" },
      { name: "robots", content: "noindex" },
    ];
  }

  const { category, selectedSubcategory } = data;
  const subcategory = selectedSubcategory 
    ? category.subCategories?.find((sub: any) => sub.slug === selectedSubcategory)
    : null;
  
  const title = subcategory 
    ? `${subcategory.name} - ${category.name}`
    : category.name;
  
  const description = subcategory?.description || category.description || 
    `تصفح أحدث الأخبار والمقالات في قسم ${title}. تحديثات يومية وتحليلات معمقة من الثورة`;

  return [
    ...generateMetaTags({
      title,
      description,
      url: `/category/${category.slug}${selectedSubcategory ? `?sub=${selectedSubcategory}` : ''}`,
      type: "website",
    }),
    {
      "script:ld+json": generateCollectionPageSchema({
        name: title,
        slug: category.slug,
        description,
      }),
    },
  ];
}

// Loading fallback
export function HydrateFallback() {
  return <CategoryPageSkeleton />;
}

export default function CategoryPage() {
  const { category, posts, totalPosts, currentPage, totalPages, selectedSubcategory } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Handle subcategory filter change via URL params (SSR-based)
  const handleSubcategoryFilter = (subcategorySlug: string | null) => {
    const newParams = new URLSearchParams();
    if (subcategorySlug) {
      newParams.set("sub", subcategorySlug);
    }
    // Always reset to page 1 when filtering
    setSearchParams(newParams);
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Determine if there are more pages
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  
  return (
    <div className="space-y-6">
      {/* Category Header */}
      <motion.div 
        key={selectedSubcategory || 'all'} 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
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
      </motion.div>

      {/* Category Posts Grid */}
      {posts.length > 0 ? (
        <div key={`posts-${selectedSubcategory || 'all'}-${currentPage}`}>
          <PostsGrid 
            posts={posts} 
            showCategoryHeader={false}
            postsPerPage={posts.length}
          />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              {/* Previous Button */}
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevPage}
                className="px-6 py-2 bg-white border border-gray-300 text-[var(--color-text-primary)] rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
              
              {/* Page Info */}
              <span className="text-[var(--color-text-secondary)]">
                صفحة {currentPage} من {totalPages}
              </span>
              
              {/* Next Button */}
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
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
