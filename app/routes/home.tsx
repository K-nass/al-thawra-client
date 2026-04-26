import type { Route } from "./+types/home";
import { Link, useLoaderData, useNavigation, useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import { Spinner } from "../components/Spinner";
import { postsService, type Post } from "../services/postsService";
import { categoriesService, type Category } from "../services/categoriesService";
import { magazinesService } from "../services/magazinesService";
import { userService } from "../services/userService";
import { reelsService } from "../services/reelsService";
import { cache, CacheTTL } from "../lib/cache";
import { generateMetaTags } from "~/utils/seo";
import { EmptyState } from "~/components/EmptyState";
import { ReelsSection, type HomepageReel } from "~/components/Reels/Home";
import HeroSliderLayout from "~/layouts/HeroSliderLayout";
import DualSwiperLayout from "~/layouts/DualSwiperLayout";
import BalancedColumnsLayout from "~/layouts/BalancedColumnsLayout";
import FeaturedWithRowLayout from "~/layouts/FeaturedWithRowLayout";
import DualFeaturedLayout from "~/layouts/DualFeaturedLayout";
import TripleColumnLayout from "~/layouts/TripleColumnLayout";
import InvertedSplitLayout from "~/layouts/InvertedSplitLayout";
import SplitHeroLayout from "~/layouts/SplitHeroLayout";
import NewsletterSubscriptionSidebar from "~/components/NewsletterSubscriptionSidebar";

type CategoryData = { category: Category; posts: Post[] };

const LAYOUT_COMPONENTS: Record<string, (data: CategoryData, props: { isLast: boolean; newsletterCategories: Category[] }) => React.ReactNode> = {
  "dual_swiper": (data) => <DualSwiperLayout posts={data.posts} />,
  "balanced-columns": (data) => <BalancedColumnsLayout categoryData={data} />,
  "featured-with-row": (data) => <FeaturedWithRowLayout categoryData={data} />,
  "dual-featured": (data) => <DualFeaturedLayout posts={data.posts} />,
  "split-hero": (data) => <SplitHeroLayout posts={data.posts} />,
  "triple-column": (data, { isLast }) => <TripleColumnLayout categoryData={data} showAdvertisement={isLast} />,
  "inverted-split": (data) => <InvertedSplitLayout categoryData={data} />,
  // Legacy numeric identifiers for backward compatibility
  // Layout1: (data) => <DualSwiperLayout posts={data.posts} />,
  // Layout2: (data) => <DualSwiperLayout posts={data.posts} />,
  // Layout3: (data) => <DualFeaturedLayout posts={data.posts} />,
  // Layout4: (data) => <BalancedColumnsLayout categoryData={data} />,
  // Layout5: (data) => <FeaturedWithRowLayout categoryData={data} />,
  // Layout6: (data) => <DualFeaturedLayout posts={data.posts} />,
  // Layout7: (data, { isLast }) => <TripleColumnLayout categoryData={data} showAdvertisement={isLast} />,
  // Layout8: (data) => <InvertedSplitLayout categoryData={data} />,
  // Layout9: (data) => <FeaturedWithRowLayout categoryData={data} />,
  // Layout10: (data) => <SplitHeroLayout posts={data.posts} />,
  // Layout11: (data) => <SplitHeroLayout posts={data.posts} />,
  // Layout12: (data) => <BalancedColumnsLayout categoryData={data} />,
  // Layout13: (data) => <DualFeaturedLayout posts={data.posts} />,
};

export function meta({ }: Route.MetaArgs) {
  return generateMetaTags({
    title: "الصفحة الرئيسية",
    description: "موقع الثورة - مصدرك الموثوق للأخبار العربية، المقالات، التحليلات السياسية، والآراء. تابع آخر الأخبار المحلية والعالمية لحظة بلحظة",
    url: "/",
    type: "website",
  });
}

export function links() {
  return [
    { rel: "icon", href: "/favIcon.png", type: "image/png" },
    { rel: "apple-touch-icon", href: "/favIcon.png" },
  ];
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
      return [];
    });


    // Fetch the latest magazine (today's issue or most recent)
    let latestMagazine = await cache.getOrFetch(
      'magazine:latest',
      () => magazinesService.getTodaysMagazine(),
      CacheTTL.SHORT
    ).catch(() => {
      return null;
    });

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

    const homeReels = await cache.getOrFetch(
      "reels:home:10",
      async () => {
        const response = await reelsService.getReels(undefined, 10);
        const reels = response.reels || [];
        return reels.map((reel) => ({
          id: reel.id,
          thumbnailUrl: reel.thumbnailUrl,
          title: reel.caption,
          category: reel.tags?.[0] ? String(reel.tags[0]).toUpperCase() : undefined,
          author: reel.userName || undefined,
          isLoading: false,
        })) satisfies HomepageReel[];
      },
      CacheTTL.SHORT
    ).catch(() => [] as HomepageReel[]);

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

    // Fetch newsletter categories for Layout2
    const newsletterCategories = await cache.getOrFetch(
      "categories:newsletter",
      () => categoriesService.getActiveCategories(),
      CacheTTL.SHORT
    ).catch(() => []);

    return {
      sliderPosts,
      writersPosts,
      latestMagazine,
      rightDirectionPosts,
      leftDirectionPosts,
      homeReels,
      chiefEditor,
      chiefEditorPosts,
      newsletterCategories,
    };
  } catch (error: any) {
    return {
      sliderPosts: [],
      writersPosts: [],
      latestMagazine: null,
      rightDirectionPosts: [],
      leftDirectionPosts: [],
      homeReels: [],
      chiefEditor: null,
      chiefEditorPosts: [],
      newsletterCategories: [],
    };
  }
}

export default function Home() {
  // Get data from loader
  const { sliderPosts, writersPosts, latestMagazine, rightDirectionPosts, leftDirectionPosts, homeReels, chiefEditor, chiefEditorPosts, newsletterCategories } = useLoaderData<typeof loader>();

  // Get categories from parent via outlet context (cleaner than useRouteLoaderData)
  const { categories } = useOutletContext<{ categories: Category[] }>();

  const navigation = useNavigation();
  const [categoryPosts, setCategoryPosts] = useState<Array<{ category: Category; posts: Post[] }>>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  function normalizeLayoutId(layoutId: unknown): string | null {
    if (typeof layoutId === "number" && Number.isFinite(layoutId)) {
      return `Layout${layoutId}`;
    }
    if (typeof layoutId !== "string") return null;
    const trimmed = layoutId.trim();
    if (!trimmed) return null;

    // Keep legacy LayoutX identifiers as-is.
    if (/^Layout\d+$/i.test(trimmed)) return trimmed;

    // Normalize common CMS variants.
    const normalized = trimmed.toLowerCase();
    const aliasMap: Record<string, string> = {
      "dual-swiper": "dual_swiper",
      dualswiper: "dual_swiper",
      "balanced-columns": "balanced-columns",
      balancedcolumns: "balanced-columns",
      balanced_columns: "balanced-columns",
      "featured-with-row": "featured-with-row",
      featuredwithrow: "featured-with-row",
      featured_with_row: "featured-with-row",
      "dual-featured": "dual-featured",
      dualfeatured: "dual-featured",
      dual_featured: "dual-featured",
      "split-hero": "split-hero",
      splithero: "split-hero",
      split_hero: "split-hero",
      "triple-column": "triple-column",
      triplecolumn: "triple-column",
      triple_column: "triple-column",
      "inverted-split": "inverted-split",
      invertedsplit: "inverted-split",
      inverted_split: "inverted-split",
      dual_swiper: "dual_swiper",
    };

    return aliasMap[normalized] ?? trimmed;
  }

  // Fetch posts for categories
  useEffect(() => {
    async function fetchCategoryPosts() {
      setIsLoadingCategories(true);

      // Filter by showOnHomepage, sort by order ascending then name alphabetically
      const homepageCategories = categories
        .filter((cat: Category) => cat.showOnHomepage)
        .sort((a: Category, b: Category) => a.order - b.order || a.name.localeCompare(b.name));

      const results = [];
      for (const category of homepageCategories) {
        try {
          const posts = await cache.getOrFetch(
            `posts:category:${category.slug}:15`,
            async () => {
              const response = await postsService.getPostsByCategory(
                category.slug,
                { pageSize: 15 },
                undefined
              );
              console.log(`[Homepage] Fetched ${response.items.length} posts for category "${category.name}" (${category.slug})`);
              return response.items;
            },
            CacheTTL.SHORT
          );

          if (posts.length > 0) {
            results.push({
              category,
              posts,
            });
          } else {
            console.warn(`[Homepage] No posts found for category "${category.name}" (${category.slug})`);
          }
        } catch (error) {
          console.error(`[Homepage] Error fetching posts for category "${category.name}" (${category.slug}):`, error);
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

  function renderCategoryLayout(
    layoutId: unknown,
    data: { category: Category; posts: Post[] },
    isLast: boolean,
    newsletterCats: Category[]
  ) {
    const normalizedLayoutId = normalizeLayoutId(layoutId);
    const defaultLayoutId = "featured-with-row";

    const renderer =
      (normalizedLayoutId && LAYOUT_COMPONENTS[normalizedLayoutId]) ||
      LAYOUT_COMPONENTS[defaultLayoutId];

    if (!normalizedLayoutId) {
      console.warn(
        `[Homepage] Missing layout for category "${data.category.slug}" — using default "${defaultLayoutId}".`
      );
    } else if (!LAYOUT_COMPONENTS[normalizedLayoutId]) {
      console.warn(
        `[Homepage] Unimplemented layout "${normalizedLayoutId}" for category "${data.category.slug}" — using default "${defaultLayoutId}".`
      );
    }

    return renderer(data, { isLast, newsletterCategories: newsletterCats });
  }

  // Sort slider posts by their category's order field
  const categoryOrderMap = new Map(categories.map((cat: Category) => [cat.slug, cat.order]));
  const sortedSliderPosts = [...sliderPosts].sort((a, b) => {
    const orderA = categoryOrderMap.get(a.categorySlug) ?? Infinity;
    const orderB = categoryOrderMap.get(b.categorySlug) ?? Infinity;
    return orderA - orderB;
  });
  console.log("home reels",homeReels);
  
  return (
    <main className="semafor-container py-4 md:py-8">
      <HeroSliderLayout
        sliderPosts={sortedSliderPosts}
        rightDirectionPosts={rightDirectionPosts}
        leftDirectionPosts={leftDirectionPosts}
        chiefEditor={chiefEditor}
        chiefEditorPosts={chiefEditorPosts}  
      />

      <ReelsSection reels={homeReels} />
      {/* TODO:make this sidebar left  */}
      <NewsletterSubscriptionSidebar />

      {(() => {
        // Find the index of the last category with an implemented layout
        const IMPLEMENTED = new Set([
          "hero-slider", "newsletter-grid", "balanced-columns",
          "featured-with-row", "dual-featured", "split-hero", "triple-column", "inverted-split"
        ]);
        const lastImplementedIdx = categoryPosts.reduce((last, item, idx) => {
          const id = normalizeLayoutId(item.category.layout);
          return id && IMPLEMENTED.has(id) ? idx : last;
        }, -1);

        return categoryPosts.map((data, idx) => {
          const layoutId = normalizeLayoutId(data.category.layout) ?? "featured-with-row";
          const isLast = idx === lastImplementedIdx;

          return (
            <section
              key={data.category.slug}
              className={`mb-8 md:mb-12 ${isLast ? '' : 'pb-8 md:pb-12 border-b-2 border-black'} mt-6 md:mt-10`}
            >
              <Link to={`/category/${data.category.slug}`}>
                <h2 className="semafor-section-title hover:text-blue-700 transition-colors">
                  {data.category.name}
                </h2>
              </Link>
              {renderCategoryLayout(layoutId, data, isLast, newsletterCategories)}
            </section>
          );
        });
      })()}
    </main>
  );
}
