import type { Route } from "./+types/home";
import { useLoaderData, useNavigation } from "react-router";
import { PostsGrid } from "../components/PostsGrid";
import { Slider } from "../components/Slider";
import { NewsletterSubscription } from "../components/NewsletterSubscription";
import { HomePageSkeleton } from "../components/skeletons";
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

export async function loader() {
  try {
    // Get homepage categories (fast metadata)
    const homepageCategories = await categoriesService.getHomepageCategories('Arabic').catch(() => []);
    
    // Sort and limit categories
    const limitedCategories = homepageCategories
      .sort((a, b) => a.order - b.order)
      .slice(0, 6);
    
    // Make only ONE request for ALL posts (90 items)
    // We'll filter locally for slider and categories
    const allPostsResponse = await postsService.getPosts({ 
      pageSize: 90, // Get enough posts for slider + all categories
      language: 'Arabic' 
    }).catch(() => ({ items: [], totalCount: 0, pageNumber: 1, pageSize: 90, totalPages: 0 }));
    
    // Filter slider posts locally (posts marked as isSlider)
    const sliderPosts = allPostsResponse.items
      .filter(post => post.isSlider)
      .slice(0, 15);
    
    // Filter posts by category locally (fast!)
    const categoryPosts = limitedCategories
      .map(category => {
        const posts = allPostsResponse.items
          .filter(post => post.categorySlug === category.slug)
          .slice(0, 15); // Limit to 15 posts per category
        
        return {
          category,
          posts,
        };
      })
      .filter(cp => cp.posts.length > 0); // Only include categories with posts

    return {
      sliderPosts,
      categoryPosts,
    };
  } catch (error: any) {
    console.error('Error loading home page:', error.response?.data || error.message);
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
