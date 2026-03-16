import type { Route } from "./+types/home";
import { Link, useLoaderData, useNavigation, useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import { NewsletterSubscription } from "../components/NewsletterSubscription";
import { Spinner } from "../components/Spinner";
import { postsService, type Post } from "../services/postsService";
import { type Category } from "../services/categoriesService";
import { magazinesService } from "../services/magazinesService";
import { userService } from "../services/userService";
import { cache, CacheTTL } from "../lib/cache";
import { generateMetaTags } from "~/utils/seo";
import { EmptyState } from "~/components/EmptyState";
import Layout1 from "~/layouts/Layout1";
import Layout2 from "~/layouts/Layout2";
import Layout4 from "~/layouts/Layout4";
import Layout5 from "~/layouts/Layout5";
import Layout6 from "~/layouts/Layout6";
import Layout7 from "~/layouts/Layout7";
import Layout8 from "~/layouts/Layout8";
import Layout11 from "~/layouts/Layout11";

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
  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <Spinner size="xl" text="جاري تحميل الصفحة الرئيسية..." />
    </div>
  );
}

export async function loader({ }: Route.LoaderArgs) {
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
    ).catch((error) => {
      console.error("Error fetching writers posts:", error);
      return [];
    });

    console.log("Loader - writersPosts fetched:", writersPosts);

    // Fetch the latest magazine (today's issue or most recent)
    let latestMagazine = await cache.getOrFetch(
      'magazine:latest',
      () => magazinesService.getTodaysMagazine(),
      CacheTTL.SHORT
    ).catch(() => {
      return null;
    });

    // Fetch urgent news
    const urgentPosts = await cache.getOrFetch(
      "posts:urgent:15",
      () => postsService.getUrgentPosts(15),
      CacheTTL.SHORT
    ).catch(() => []);

    // Fetch "right direction" articles for Layout1 left sidebar
    const rightDirectionPosts = await cache.getOrFetch(
      "posts:direction:right:15:Article",
      async () => {
        const response = await postsService.getPosts({
          pageSize: 15,
          type: "Article",
          direction: "Right",
        });
        // Provide enough items so Layout1 can rotate/swaps through them.
        return response.items.slice(0, 12);
      },
      CacheTTL.SHORT
    ).catch(() => [] as Post[]);

    // Fetch "left direction" articles for Layout1 right sidebar grid
    const leftDirectionPosts = await cache.getOrFetch(
      "posts:direction:left:15:Article",
      async () => {
        const response = await postsService.getPosts({
          pageSize: 15,
          type: "Article",
          direction: "Left",
        });
        return response.items.slice(0, 6);
      },
      CacheTTL.SHORT
    ).catch(() => [] as Post[]);

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
      // Error fetching chief editor data
    }

    return {
      sliderPosts,
      writersPosts,
      latestMagazine,
      urgentPosts,
      rightDirectionPosts,
      leftDirectionPosts,
      chiefEditor,
      chiefEditorPosts,
    };
  } catch (error: any) {
    return {
      sliderPosts: [],
      writersPosts: [],
      latestMagazine: null,
      urgentPosts: [],
      rightDirectionPosts: [],
      leftDirectionPosts: [],
      chiefEditor: null,
      chiefEditorPosts: [],
    };
  }
}

export default function Home() {
  // Get data from loader
  const { sliderPosts, writersPosts, latestMagazine, urgentPosts, rightDirectionPosts, leftDirectionPosts, chiefEditor, chiefEditorPosts } = useLoaderData<typeof loader>();

  // Get categories from parent via outlet context (cleaner than useRouteLoaderData)
  const { categories } = useOutletContext<{ categories: Category[] }>();

  const navigation = useNavigation();
  const [categoryPosts, setCategoryPosts] = useState<Array<{ category: Category; posts: Post[] }>>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch posts for categories
  useEffect(() => {
    async function fetchCategoryPosts() {
      setIsLoadingCategories(true);

      // Sort and limit categories to match layout order (10 layout slots)
      const limitedCategories = categories
        .sort((a: Category, b: Category) => a.order - b.order)
        .slice(0, 10);

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
          // Error fetching posts for category
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

  // Show loading spinner during navigation (content area only)
  if (navigation.state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <Spinner size="xl" text="جاري تحميل الصفحة..." />
      </div>
    );
  }

  // Show loading spinner while fetching category posts
  if (isLoadingCategories) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <Spinner size="xl" text="جاري تحميل المحتوى..." />
      </div>
    );
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

  // Layout order for category sections: 2, 4, 5, 6, 7, 8, 6, 7, 11, 7(with ad)
  const layoutOrder = [2, 4, 5, 6, 7, 8, 6, 7, 11, 7] as const;

  function renderCategoryLayout(
    layoutNumber: number,
    data: { category: Category; posts: Post[] },
    isLast: boolean
  ) {
    switch (layoutNumber) {
      case 2:
        return <Layout2 posts={data.posts} />;
      case 4:
        return <Layout4 categoryData={data} />;
      case 5:
        return <Layout5 categoryData={data} />;
      case 6:
        return <Layout6 posts={data.posts} />;
      case 7:
        return <Layout7 categoryData={data} showAdvertisement={isLast} />;
      case 8:
        return <Layout8 categoryData={data} />;
      case 11:
        return <Layout11 posts={data.posts} />;
      default:
        return null;
    }
  }

  return (
    <main className="semafor-container py-4 md:py-8">
      <Layout1
        sliderPosts={sliderPosts}
        urgentPosts={urgentPosts}
        rightDirectionPosts={rightDirectionPosts}
        leftDirectionPosts={leftDirectionPosts}
        chiefEditor={chiefEditor}
        chiefEditorPosts={chiefEditorPosts}
      />

      {categoryPosts.map((data, idx) => {
        const layoutNumber = layoutOrder[idx % layoutOrder.length];
        const isLast = idx === categoryPosts.length - 1;
        const isLastInSequence = idx === layoutOrder.length - 1;

        return (
          <section
            key={data.category.slug}
            className={`mb-8 md:mb-12 ${isLast || isLastInSequence ? '' : 'pb-8 md:pb-12 border-b-2 border-black'} mt-6 md:mt-10`}
          >
            <Link to={`/category/${data.category.slug}`}>
              <h2 className="semafor-section-title hover:text-blue-700 transition-colors">
                {data.category.name}
              </h2>
            </Link>
            {renderCategoryLayout(layoutNumber, data, isLast && layoutNumber === 7)}
          </section>
        );
      })}
    </main>
  );
}
