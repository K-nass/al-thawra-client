import type { Route } from "./+types/category.$slug";
import { useLoaderData, useSearchParams } from "react-router";
import { generateMetaTags, generateCollectionPageSchema } from "~/utils/seo";
import { PostCard } from "../components/PostCard";
import { CategoryPageSkeleton } from "../components/skeletons";
import { EmptyState } from "../components/EmptyState";
import { postsService } from "../services/postsService";
import { categoriesService } from "../services/categoriesService";
import { cache, CacheTTL } from "../lib/cache";
import { useState, useRef, useEffect } from "react";

// Loader function for server-side data fetching
export async function loader({ params, request }: Route.LoaderArgs) {
  const slug = params.slug;
  if (!slug) {
    throw new Response("Category slug required", { status: 404 });
  }
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
  const { category, posts, currentPage, totalPages, selectedSubcategory } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle subcategory filter change via URL params (SSR-based)
  const handleSubcategoryFilter = (subcategorySlug: string | null) => {
    const newParams = new URLSearchParams();
    if (subcategorySlug) {
      newParams.set("sub", subcategorySlug);
    }
    // Always reset to page 1 when filtering
    setSearchParams(newParams);
    setIsDropdownOpen(false); // Close dropdown after selection
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
    <div className="min-h-screen">
      {/* Category Header - Centered, No Background */}
      <div key={selectedSubcategory || 'all'}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Category Title - Centered */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
            {category.name}
          </h1>

          {/* Subcategories - Centered Row */}
          {category.subCategories && category.subCategories.length > 0 && (
            <nav className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <button
                onClick={() => handleSubcategoryFilter(null)}
                className={`px-3 py-1 text-sm font-medium transition-colors cursor-pointer ${
                  !selectedSubcategory 
                    ? 'text-gray-900 underline underline-offset-4' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
              الكل
              </button>
              
              <span className="text-gray-400">|</span>
              
              {/* Show first 5 subcategories */}
              {category.subCategories.slice(0, 5).map((subcategory, index) => (
                <div key={subcategory.slug} className="flex items-center gap-2">
                  <button
                    onClick={() => handleSubcategoryFilter(subcategory.slug)}
                    className={`px-3 py-1 text-sm font-medium transition-colors cursor-pointer ${
                      selectedSubcategory === subcategory.slug
                        ? 'text-gray-900 underline underline-offset-4' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {subcategory.name}
                  </button>
                  {index < 4 && index < category.subCategories.length - 1 && (
                    <span className="text-gray-400">|</span>
                  )}
                </div>
              ))}
              
              {/* Dropdown for more subcategories */}
              {category.subCategories.length > 5 && (
                <>
                  <span className="text-gray-400">|</span>
                  <div ref={dropdownRef} className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      المزيد
                      <svg 
                        className="w-3 h-3"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-[#d0e8f2] border border-black/20 py-2 z-10 shadow-lg">
                        {category.subCategories.slice(5).map((subcategory) => (
                          <button
                            key={subcategory.slug}
                            onClick={() => handleSubcategoryFilter(subcategory.slug)}
                            className={`w-full text-right px-4 py-2 text-sm hover:bg-black/5 transition-colors ${
                              selectedSubcategory === subcategory.slug
                                ? 'text-gray-900 font-medium' 
                                : 'text-gray-700'
                            }`}
                          >
                            {subcategory.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </nav>
          )}
          
          {/* Category Description - Centered */}
          {category.description && (
            <p className="text-gray-700 text-center max-w-3xl mx-auto">{category.description}</p>
          )}
        </div>
      </div>

      {/* Category Posts - Newspaper Grid Layout */}
      {posts.length > 0 ? (
        <div key={`posts-${selectedSubcategory || 'all'}-${currentPage}`} className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Featured Section - 3 Column Grid with Dashed Borders */}
          {posts.length >= 3 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-8">
                {/* First Featured Post */}
                <div className="p-6 border-b border-dashed border-black/10 md:border-b-0 md:border-l">
                  <PostCard post={posts[0]} variant="featured" />
                </div>
                
                {/* Second Featured Post */}
                <div className="p-6 border-b border-dashed border-black/10 md:border-b-0 md:border-l">
                  <PostCard post={posts[1]} variant="featured" />
                </div>
                
                {/* Third Featured Post */}
                <div className="p-6">
                  <PostCard post={posts[2]} variant="featured" />
                </div>
              </div>
              
              {/* Remaining Posts Grid - 4 columns with borders between all cards */}
              {posts.length > 3 && (
                <>
                  {/* Separator between featured and regular grid */}
                  <div className="border-t border-dashed border-black/10 my-8"></div>
                  
                  {/* Group posts by rows */}
                  {Array.from({ length: Math.ceil((posts.length - 3) / 4) }).map((_, rowIndex) => {
                    const rowPosts = posts.slice(3 + rowIndex * 4, 3 + (rowIndex + 1) * 4);
                    const isLastRow = rowIndex === Math.ceil((posts.length - 3) / 4) - 1;
                    
                    return (
                      <div key={`row-${rowIndex}`}>
                        {/* Row of cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
                          {rowPosts.map((post, colIndex) => {
                            const isLastInRow = colIndex === rowPosts.length - 1;
                            const isLastPost = isLastRow && isLastInRow;
                            
                            return (
                              <div 
                                key={post.id} 
                                className={`p-6 ${
                                  // Add right border for columns 1, 2, 3 (not the last column) on desktop
                                  colIndex < rowPosts.length - 1 && colIndex < 3 ? 'lg:border-l border-dashed border-black/10' : ''
                                } ${
                                  // Add bottom border on mobile for all except the very last post
                                  !isLastPost ? 'border-b border-dashed border-black/10 lg:border-b-0' : ''
                                }`}
                              >
                                <PostCard post={post} variant="standard" />
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Horizontal border after row (full width, outside the grid) - desktop only */}
                        {!isLastRow && (
                          <div className="hidden lg:block border-b border-dashed border-black/10 mb-4 mt-4"></div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </>
          ) : (
            /* Less than 3 posts - show in available columns */
            <div className={`grid grid-cols-1 ${posts.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-0`}>
              {posts.map((post, index) => (
                <div 
                  key={post.id} 
                  className={`p-6 border-b border-dashed border-black/10 md:border-b-0 ${
                    index < posts.length - 1 ? 'md:border-l' : ''
                  }`}
                >
                  <PostCard post={post} variant="featured" />
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-8 mt-8 border-t border-dashed border-black/10">
              {/* Previous Button */}
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevPage}
                className="px-6 py-2 text-gray-900 font-medium border border-dashed border-black/20 rounded-lg hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                السابق
              </button>
              
              {/* Page Info */}
              <span className="text-gray-700 font-medium">
                صفحة {currentPage} من {totalPages}
              </span>
              
              {/* Next Button */}
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="px-6 py-2 text-gray-900 font-medium border border-dashed border-black/20 rounded-lg hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                التالي
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="border-t border-dashed border-black/10 mb-8"></div>
          <EmptyState 
            title="لا توجد مقالات في هذا القسم"
            description="لم يتم نشر أي مقالات في هذا القسم بعد"
          />
        </div>
      )}
    </div>
  );
}
