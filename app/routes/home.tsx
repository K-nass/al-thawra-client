import type { Route } from "./+types/home";
import { useLoaderData, useNavigation, useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import { PostsGrid } from "../components/PostsGrid";
import { Slider } from "../components/Slider";
import { NewsletterSubscription } from "../components/NewsletterSubscription";
import { WritersOpinionsGrid } from "../components/WritersOpinionsGrid";
import { TodaysIssue } from "../components/TodaysIssue";
import { HomePageSkeleton } from "../components/skeletons";
import { EmptyState } from "../components/EmptyState";
import { postsService, type Post } from "../services/postsService";
import { categoriesService, type Category } from "../services/categoriesService";
import { magazinesService, type Magazine } from "../services/magazinesService";
import { userService } from "../services/userService";
import { cache, CacheTTL } from "../lib/cache";
import { generateMetaTags } from "~/utils/seo";
import { ChiefEditorSection } from "../components/ChiefEditorSection";

export function meta({ }: Route.MetaArgs) {
  return generateMetaTags({
    title: "الصفحة الرئيسية",
    description: "موقع الثورة - مصدرك الموثوق للأخبار العربية، المقالات، التحليلات السياسية، والآراء. تابع آخر الأخبار المحلية والعالمية لحظة بلحظة",
    url: "/",
    type: "website",
  });
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

    // Fetch the latest magazine (today's issue or most recent)
    console.log('Fetching latest magazine...');

    let latestMagazine = await cache.getOrFetch(
      'magazine:latest',
      () => magazinesService.getTodaysMagazine(),
      CacheTTL.SHORT
    ).catch((error) => {
      console.error('Error fetching latest magazine:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      return null;
    });

    // Fetch urgent news
    const urgentPosts = await cache.getOrFetch(
      "posts:urgent:15",
      () => postsService.getUrgentPosts(15),
      CacheTTL.SHORT
    ).catch(() => []);

    // Fetch chief editor data
    let chiefEditor = null;
    let chiefEditorPosts: Post[] = [];
    
    try {
      chiefEditor = await cache.getOrFetch(
        "chief-editor:info",
        () => userService.getChiefEditor(),
        CacheTTL.LONG
      );

      if (chiefEditor) {
        // Fetch posts - Minimum page size is 15
        const response = await cache.getOrFetch(
          "chief-editor:posts:home",
          () => postsService.getChiefEditorPosts(15),
          CacheTTL.SHORT
        );
        chiefEditorPosts = response.slice(0, 5); // Take only first 5
      }
    } catch (error) {
      console.error("Error fetching chief editor data:", error);
    }

    console.log('Final latest magazine data:', latestMagazine);

    return {
      sliderPosts,
      writersPosts,
      latestMagazine,
      urgentPosts,
      chiefEditor,
      chiefEditorPosts,
    };
  } catch (error: any) {
    console.error('Error loading home page:', error.response?.data || error.message);
    return {
      sliderPosts: [],
      writersPosts: [],
      latestMagazine: null,
      urgentPosts: [],
      chiefEditor: null,
      chiefEditorPosts: [],
    };
  }
}

export default function Home() {
  // Get data from loader
  const { sliderPosts, writersPosts, latestMagazine, urgentPosts, chiefEditor, chiefEditorPosts } = useLoaderData<typeof loader>();
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
      {sliderPosts.length > 0 && (
        <Slider posts={sliderPosts} />
      )}

      {/* Today's Issue Section */}
      <TodaysIssue
        issueNumber={latestMagazine ? `العدد ${latestMagazine.issueNumber}` : undefined}
        date={latestMagazine ? new Date(latestMagazine.createdAt).toLocaleDateString("ar-EG", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        }) : undefined}
        magazineCover={latestMagazine?.thumbnailUrl}
        magazineDate={latestMagazine ? (() => {
          const d = new Date(latestMagazine.createdAt);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })() : undefined}
        urgentNews={urgentPosts?.map(post => ({
          title: post.title,
          slug: post.slug,
          categorySlug: post.categorySlug
        }))}
      />

      {/* Chief Editor Section */}
      {chiefEditor && chiefEditorPosts.length > 0 && (
        <ChiefEditorSection 
          editor={chiefEditor} 
          posts={chiefEditorPosts} 
        />
      )}

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
