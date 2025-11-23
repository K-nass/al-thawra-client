import type { Route } from "./+types/home";
import { useLoaderData, useNavigation, useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import { PostsGrid } from "../components/PostsGrid";
import { Slider } from "../components/Slider";
import { NewsletterSubscription } from "../components/NewsletterSubscription";
import { WritersOpinionsGrid } from "../components/WritersOpinionsGrid";
import { HomePageSkeleton } from "../components/skeletons";
import { EmptyState } from "../components/EmptyState";
import { postsService, type Post } from "../services/postsService";
import { categoriesService, type Category } from "../services/categoriesService";
import { cache, CacheTTL } from "../lib/cache";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "الثورة - الصفحة الرئيسية" },
    { name: "description", content: "أخبار ومقالات الثورة" },
  ];
}

// Loading fallback for hydration
export function HydrateFallback() {
  return <HomePageSkeleton />;
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    // Note: Categories are now fetched in root loader and accessed via useRouteLoaderData
    // We'll get them in the component instead of here
    
    // Fetch slider posts separately with caching
    const sliderPosts = await cache.getOrFetch(
      "posts:slider:15:Article",
      () => postsService.getSliderPosts(15, "Article"),
      CacheTTL.SHORT
    ).catch(() => []);
    
    // Fetch writers & opinions posts with caching
    const writersPosts = await cache.getOrFetch(
      "posts:writers-opinions:15:Article",
      () => postsService.getPostsWithAuthors(15, "Article"),
      CacheTTL.SHORT
    ).catch(() => []);
    
    return {  
      sliderPosts,
      writersPosts,
      // Categories will be accessed from root loader in component
    };
  } catch (error: any) {
    console.error('Error loading home page:', error.response?.data || error.message);
    return {
      sliderPosts: [],
      writersPosts: [],
    };
  }
}

export default function Home() {
  // Get data from loader
  const { sliderPosts, writersPosts } = useLoaderData<typeof loader>();
  // Get categories from parent via outlet context (cleaner than useRouteLoaderData)
  const { categories } = useOutletContext<{ categories: Category[] }>();
  
  const navigation = useNavigation();
  const [categoryPosts, setCategoryPosts] = useState<Array<{ category: Category; posts: Post[] }>>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch posts for categories
  useEffect(() => {
    async function fetchCategoryPosts() {
      setIsLoadingCategories(true);
      
      // Sort and limit categories
      const limitedCategories = categories
        .sort((a: Category, b: Category) => a.order - b.order)
        .slice(0, 6);
      
      const results = [];
      for (const category of limitedCategories) {
        try {
          const posts = await cache.getOrFetch(
            `posts:category:${category.slug}:15:Article`,
            async () => {
              const response = await postsService.getPostsByCategory(
                category.slug,
                { pageSize: 15 },
                "Article"
              );
              return response.items;
            },
            CacheTTL.SHORT
          );
          
          if (posts.length > 0) {
            results.push({
              category,
              posts,
            });
          }
        } catch (error) {
          console.error(`Error fetching posts for category ${category.slug}:`, error);
        }
      }
      
      setCategoryPosts(results);
      setIsLoadingCategories(false);
    }
    
    if (categories.length > 0) {
      fetchCategoryPosts();
    } else {
      setIsLoadingCategories(false);
    }
  }, [categories]);

  // Show loading skeleton during navigation or category loading
  if (navigation.state === "loading" || isLoadingCategories) {
    return <HomePageSkeleton />;
  }

  // Show empty state if no data at all
  if (sliderPosts.length === 0 && categoryPosts.length === 0 && writersPosts.length === 0) {
    return (
      <EmptyState 
        title="لا توجد مقالات متاحة"
        description="نعمل على إضافة محتوى جديد. يرجى المحاولة مرة أخرى لاحقاً"
        showRefresh={true}
        onRefresh={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Slider */}
      {sliderPosts.length > 0 && <Slider posts={sliderPosts} />}

      {/* First Category Section */}
      {categoryPosts.length > 0 && categoryPosts[0] && (
        <PostsGrid 
          key={categoryPosts[0].category.id}
          posts={categoryPosts[0].posts} 
          categoryName={categoryPosts[0].category.name} 
          categorySlug={categoryPosts[0].category.slug}
          showCategoryHeader={true}
        />
      )}

      {/* Writers & Opinions Section - Always Second */}
      {writersPosts.length > 0 && (
        <WritersOpinionsGrid posts={writersPosts} showHeader={true} />
      )}

      {/* Remaining Category Sections */}
      {categoryPosts.length > 1 && (
        categoryPosts.slice(1).map(({ category, posts }: { category: Category; posts: Post[] }) => (
          <PostsGrid 
            key={category.id}
            posts={posts} 
            categoryName={category.name} 
            categorySlug={category.slug}
            showCategoryHeader={true}
          />
        ))
      )}

      {/* Show empty state only if no categories at all */}
      {categoryPosts.length === 0 && writersPosts.length === 0 && (
        <EmptyState 
          title="لا توجد أقسام متاحة"
          description="لم نتمكن من تحميل الأقسام في الوقت الحالي"
        />
      )}

      {/* Newsletter Subscription */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 mt-8">
        <NewsletterSubscription />
      </div>
    </div>
  );
}
