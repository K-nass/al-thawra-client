import type { Route } from "./+types/home";
import { Link, useLoaderData, useNavigation, useOutletContext } from "react-router";
import { useState, useEffect } from "react";
import { NewsletterSubscription } from "../components/NewsletterSubscription";
import { HomePageSkeleton } from "../components/skeletons";
import { Spinner } from "../components/Spinner";
import { postsService, type Post } from "../services/postsService";
import { type Category } from "../services/categoriesService";
import { magazinesService } from "../services/magazinesService";
import { userService } from "../services/userService";
import { cache, CacheTTL } from "../lib/cache";
import { generateMetaTags } from "~/utils/seo";
import { EmptyState } from "~/components/EmptyState";

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

export async function loader({}: Route.LoaderArgs) {
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
      chiefEditor,
      chiefEditorPosts,
    };
  } catch (error: any) {
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

  return (
    <main className="semafor-container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - "The World at a Glance" */}
        <aside className="lg:col-span-3 order-2 lg:order-1 border-b lg:border-b-0 lg:border-l border-dashed border-black/10 pb-6 lg:pb-0 lg:pl-6">
          <div className="semafor-sidebar sticky top-8">
            <h2 className="text-xl font-bold mb-4 pb-3">
              العالم في لمحة
            </h2>
            {urgentPosts && urgentPosts.length > 0 ? (
              <ol className="space-y-4">
                {urgentPosts.slice(0, 6).map((post, index) => (
                  <li key={post.id} className="text-sm">
                    <Link
                      to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                      className="hover:underline leading-snug block"
                    >
                      <span className="font-bold">{index + 1}.</span> {post.title}
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-gray-600">لا توجد أخبار عاجلة</p>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-6 order-1 lg:order-2 lg:px-6">
          {/* Hero Section */}
          {sliderPosts.length > 0 && sliderPosts[0] && (
            <section className="mb-8 pb-8 border-b border-dashed border-black/10">
              <Link
                to={`/posts/categories/${sliderPosts[0].categorySlug}/articles/${sliderPosts[0].slug}`}
                className="block group"
              >
                <article>
                  {sliderPosts[0].categoryName && (
                    <div className="mb-3">
                      <span className="text-xs uppercase tracking-wider text-gray-600 font-semibold">
                        {sliderPosts[0].categoryName}
                      </span>
                    </div>
                  )}
                  
                  <h1 className="semafor-main-headline mb-6 group-hover:text-blue-700 transition-colors">
                    {sliderPosts[0].title}
                  </h1>

                  {/* Subtitle/Description */}
                  {sliderPosts[0].description && (
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      {sliderPosts[0].description}
                    </p>
                  )}

                  {sliderPosts[0].image && (
                    <div className="mb-4 overflow-hidden">
                      <img
                        src={sliderPosts[0].image}
                        alt={sliderPosts[0].title}
                        className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
                        loading="eager"
                      />
                      {sliderPosts[0].authorName && (
                        <p className="text-xs text-gray-500 mt-2">
                          تصوير: {sliderPosts[0].authorName}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              </Link>
            </section>
          )}

          {/* Secondary Stories Grid */}
          {sliderPosts.length > 1 && (
            <section className="mb-12 pb-12 border-b border-dashed border-black/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sliderPosts.slice(1, 4).map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                    className={`block group ${index < 2 ? 'md:border-l md:border-dashed md:border-black/10 md:pr-6' : ''}`}
                  >
                    <article className="semafor-card p-5 h-full">
                      <h3 className="text-lg font-bold mb-3 group-hover:text-blue-700 transition-colors leading-tight">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {post.description}
                        </p>
                      )}
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Category Sections */}
          {categoryPosts.length > 0 && categoryPosts[0] && (
            <section className="mb-12 pb-12 border-b border-dashed border-black/10">
              <h2 className="semafor-section-title">{categoryPosts[0].category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categoryPosts[0].posts.slice(0, 4).map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                    className={`block group ${index % 2 === 0 ? 'md:border-l md:border-dashed md:border-black/10 md:pr-6' : ''}`}
                  >
                    <article className="semafor-card overflow-hidden">
                      {post.image && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-700 transition-colors">
                          {post.title}
                        </h3>
                        {post.description && (
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {post.description}
                          </p>
                        )}
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Writers & Opinions */}
          {writersPosts.length > 0 && (
            <section className="mb-12 pb-12 border-b border-dashed border-black/10">
              <h2 className="semafor-section-title">آراء الكتاب</h2>
              <div className="space-y-6">
                {writersPosts.slice(0, 3).map((post, index) => (
                  <div key={post.id} className={index < writersPosts.slice(0, 3).length - 1 ? 'pb-6 border-b border-dashed border-black/10' : ''}>
                    <Link
                      to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                      className="block group"
                    >
                      <article className="semafor-card p-5">
                        <div className="flex items-start gap-4">
                          {post.authorImage && (
                            <img
                              src={post.authorImage}
                              alt={post.authorName || ''}
                              className="w-16 h-16 rounded-full object-cover"
                              loading="lazy"
                            />
                          )}
                          <div className="flex-1">
                            {post.authorName && (
                              <p className="text-sm font-semibold text-gray-600 mb-1">
                                {post.authorName}
                              </p>
                            )}
                            <h3 className="text-lg font-bold mb-2 group-hover:text-blue-700 transition-colors">
                              {post.title}
                            </h3>
                            {post.description && (
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {post.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Additional Categories */}
          {categoryPosts.slice(1).map(({ category, posts }, sectionIndex) => (
            <section key={category.id} className={`mb-12 ${sectionIndex < categoryPosts.slice(1).length - 1 ? 'pb-12 border-b border-dashed border-black/10' : ''}`}>
              <h2 className="semafor-section-title">{category.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.slice(0, 4).map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                    className={`block group ${index % 2 === 0 ? 'md:border-l md:border-dashed md:border-black/10 md:pr-6' : ''}`}
                  >
                    <article className="semafor-card p-5">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-blue-700 transition-colors">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {post.description}
                        </p>
                      )}
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Right Sidebar - Featured Content */}
        <aside className="lg:col-span-3 order-3 lg:order-3 border-t lg:border-t-0 lg:border-r border-dashed border-black/10 pt-6 lg:pt-0 lg:pr-6">
          <div className="sticky top-8 space-y-6">
            {/* Featured Box */}
            <div className="semafor-sidebar pb-6">
              {chiefEditor && chiefEditorPosts.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-3 leading-tight">
                    {chiefEditorPosts[0].title}
                  </h3>
                  {chiefEditorPosts[0].description && (
                    <p className="text-sm text-gray-700 mb-4">
                      {chiefEditorPosts[0].description}
                    </p>
                  )}
                  <Link
                    to={`/posts/categories/${chiefEditorPosts[0].categorySlug}/articles/${chiefEditorPosts[0].slug}`}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    استمع الآن →
                  </Link>
                </div>
              )}
            </div>

            {/* Newsletter */}
            <div className="semafor-sidebar">
              <NewsletterSubscription />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
