import type { Route } from "./+types/home";
import { useLoaderData, useNavigation } from "react-router";
import { PostsGrid } from "../components/PostsGrid";
import { Slider } from "../components/Slider";
import { NewsletterSubscription } from "../components/NewsletterSubscription";
import { HomePageSkeleton } from "../components/LoadingSkeleton";
import { EmptyState } from "../components/EmptyState";
import { postsService, type Post } from "../services/postsService";
import { categoriesService, type Category } from "../services/categoriesService";

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

// Loader function for server-side data fetching
export async function loader() {
  try {
    // First, get categories that should show on homepage
    const homepageCategories = await categoriesService.getHomepageCategories('Arabic');
    
    // Get slider posts
    const sliderPosts = await postsService.getSliderPosts(15);
    
    // Load posts for each homepage category in parallel
    const categoryPostsPromises = homepageCategories
      .sort((a, b) => a.order - b.order) // Sort by order
      .slice(0, 6) // Limit to first 6 categories
      .map(async (category) => {
        try {
          const response = await postsService.getPostsByCategory(category.slug, { pageSize: 15 });
          return {
            category,
            posts: response.items,
          };
        } catch (error) {
          console.error(`Error loading posts for category ${category.slug}:`, error);
          return {
            category,
            posts: [],
          };
        }
      });

    const categoryPosts = await Promise.all(categoryPostsPromises);

    return {
      sliderPosts,
      categoryPosts: categoryPosts.filter(cp => cp.posts.length > 0), // Only return categories with posts
    };
  } catch (error: any) {
    console.error('Error loading home page posts:', error.response?.data || error.message);
    // Return empty data on error
    return {
      sliderPosts: [],
      categoryPosts: [],
    };
  }
}

export default function Home() {
  // Get data from loader
  const { sliderPosts, categoryPosts } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  // Show loading skeleton during navigation
  if (navigation.state === "loading") {
    return <HomePageSkeleton />;
  }

  // Show empty state if no data at all
  if (sliderPosts.length === 0 && categoryPosts.length === 0) {
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

      {/* Dynamic Category Sections */}
      {categoryPosts.length > 0 ? (
        categoryPosts.map(({ category, posts }) => (
          <PostsGrid 
            key={category.id}
            posts={posts} 
            categoryName={category.name} 
            categorySlug={category.slug}
            showCategoryHeader={true}
          />
        ))
      ) : (
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
