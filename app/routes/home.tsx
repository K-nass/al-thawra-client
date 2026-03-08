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
    <main className="semafor-container py-4 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 lg:border-b-2 mt-4 md:mt-4 semafor-section-title pb-4 lg:pb-7">
        {/* right Sidebar - "The World at a Glance" */}
        <aside className="lg:col-span-3 order-2 lg:order-1 pb-4 lg:pb-6 lg:pl-6">
          <div className="semafor-sidebar space-y-6">
            <div>
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

          </div>
        </aside>

        {/* left side bar */}
        <div className="semafor-sidebar lg:col-span-3 order-3 pb-4 lg:pb-6 lg:pl-6">
          {sliderPosts.length > 1 && (
            <section className="mb-12 pb-12 border-dashed border-black/10">
              <div className="grid grid-cols-1 gap-6">
                {sliderPosts.slice(1, 4).map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                  >
                    <article className="semafor-card p-5 h-full">
                      <h3 className="text-lg font-bold mb-3 group-hover:text-blue-700 transition-colors leading-tight">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {post.description.split(' ').slice(0, 20).join(' ')}
                        </p>
                      )}
                    </article>
                  </Link>
                ))}
                <NewsletterSubscription />
              </div>
            </section>
          )}
        </div>


        {/* Main Content Area */}
        <div className="lg:col-span-6 order-1 lg:order-2 px-4 lg:px-6">
          {/* Hero Section */}
          {sliderPosts.length > 0 && sliderPosts[0] && (
            <section className="mb-6 md:mb-8 pb-6 md:pb-8">
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
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {sliderPosts[0].description}
                    </p>
                  )}

                  {sliderPosts[0].image && (
                    <div className="overflow-hidden">
                      <img
                        src={sliderPosts[0].image}
                        alt={sliderPosts[0].title}
                        className="w-full group-hover:scale-[1.02] transition-transform duration-500"
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
          {/* Right Sidebar - Featured Content */}
          <aside className="lg:col-span-3 order-3 lg:order-3 pt-4 md:pt-6 lg:pt-0 pr-4 lg:pr-6">
            <div className="space-y-6">
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
            </div>
          </aside>
        </div>
      </div>

      {categoryPosts.length > 0 && categoryPosts[0] && (
        <section className="mb-8 md:mb-12 pb-8 md:pb-12 border-b-2 border-black mt-6 md:mt-10">
          <h2 className="semafor-section-title">{categoryPosts[0].category.name}</h2>

          {/* Top section: 3 columns layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 mb-6">
            {/* Left column - smaller articles */}
            <div className="md:col-span-3 space-y-6 md:space-y-10 mt-8 md:mt-15 pr-2 md:pr-4">
              {categoryPosts[0].posts.slice(0, 3).map((post, index) => (
                <Link
                  key={post.id}
                  to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                  className="block group"
                >
                  <article className={`semafor-card overflow-hidden pb-6 ${index < 2 ? 'border-b border-dashed border-black/10' : ''}`}>
                    <div className="p-3">
                      <h3 className="text-md font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-3">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {post.description.split(" ").slice(0, 15).join(" ")}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Center - main featured article with image */}
            {categoryPosts[0].posts[3] && (
              <div className="md:col-span-6 md:border-r md:border-l md:border-dashed md:border-black/10 px-4">
                <Link
                  to={`/posts/categories/${categoryPosts[0].posts[3].categorySlug}/articles/${categoryPosts[0].posts[3].slug}`}
                  className="block group"
                >
                  <article className="semafor-card overflow-hidden">
                    <div className="p-4 mb-4">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-blue-700 transition-colors text-center">
                        {categoryPosts[0].posts[3].title}
                      </h3>
                      {categoryPosts[0].posts[3].description && (
                        <p className="text-sm md:text-base text-gray-700 line-clamp-2 text-center">
                          {categoryPosts[0].posts[3].description}
                        </p>
                      )}
                    </div>
                    {categoryPosts[0].posts[3].image && (
                      <div className="h-64 md:h-80 overflow-hidden">
                        <img
                          src={categoryPosts[0].posts[3].image}
                          alt={categoryPosts[0].posts[3].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </article>
                </Link>
              </div>
            )}

            {/* Right column - smaller articles */}
            <div className="md:col-span-3 space-y-6 md:space-y-10 mt-8 md:mt-15 pl-2 md:pl-4">
              {categoryPosts[0].posts.slice(4, 7).map((post, index) => (
                <Link
                  key={post.id}
                  to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                  className="block group"
                >
                  <article className={`semafor-card overflow-hidden pb-6 ${index < 2 ? 'border-b border-dashed border-black/10' : ''}`}>
                    <div className="p-3">
                      <h3 className="text-md font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-3">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {post.description.split(" ").slice(0, 15).join(" ")}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom section: 4 articles in a row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-dashed border-black/10 pt-6">
            {categoryPosts[0].posts.slice(7, 11).map((post, index) => (
              <Link
                key={post.id}
                to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                className="block group"
              >
                <article className={`semafor-card p-4 ${index < 3 ? 'border-l border-dashed border-black/10' : ''}`}>
                  <h3 className="text-md font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {post.description.split(" ").slice(0, 15).join(" ")}
                    </p>
                  )}
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* will trigger later */}
      {/* {writersPosts.length > 0 && (
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
                            {post.description.split(" ").slice(0, 20).join(" ")}
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
      )} */}

      {categoryPosts.slice(1).map(({ category, posts }, sectionIndex) => (
        <section key={category.id} className={`mb-8 md:mb-12 ${sectionIndex < categoryPosts.slice(1).length - 1 ? 'pb-8 md:pb-12 border-b-2 border-black' : ''}`}>
          <h2 className="semafor-section-title">{category.name}</h2>

          {/* First category - special layout like the image */}
          {sectionIndex === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - smaller articles */}
              <div className="space-y-4">
                {posts.slice(0, 3).map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                    className="block group"
                  >
                    <article className="semafor-card p-4 border-b border-dashed border-black/10 pb-4">
                      <h3 className="text-base font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {post.description.split(" ").slice(0, 20).join(" ")}
                        </p>
                      )}
                    </article>
                  </Link>
                ))}
              </div>

              {/* Right side - featured article with image */}
              {posts[3] && (
                <Link
                  to={`/posts/categories/${posts[3].categorySlug}/articles/${posts[3].slug}`}
                  className="block group"
                >
                  <article className="semafor-card overflow-hidden">
                    {posts[3].image && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={posts[3].image}
                          alt={posts[3].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-3 text-blue-800 group-hover:text-blue-700 transition-colors">
                        {posts[3].title}
                      </h3>
                      {posts[3].description && (
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {posts[3].description}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              )}
            </div>
          ) : sectionIndex === 1 ? (
            /* Second category - 2x2 grid layout with images */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top row - two featured articles with images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
                {posts.slice(0, 2).map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                    className="block group"
                  >
                    <article className="semafor-card overflow-hidden border-b border-dashed border-black/10">
                      <div className="p-4">
                        <h3 className={`font-bold mb-3 group-hover:text-blue-700 transition-colors line-clamp-3 ${index === 1 ? 'text-blue-800 text-lg' : 'text-base'}`}>
                          {post.title}
                        </h3>
                        {post.description && (
                          <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                            {post.description.split(" ").slice(0, 20).join(" ")}
                          </p>
                        )}
                      </div>
                      {post.image && (
                        <div className="h-40 overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </article>
                  </Link>
                ))}
              </div>

              {/* Bottom row - four smaller articles */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:col-span-2 border-t border-dashed border-black/10 pt-6">
                {posts.slice(2, 6).map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                    className="block group"
                  >
                    <article className={`semafor-card p-4 ${index < 4 ? 'border-r border-dashed border-black/10' : ''}`}>
                      <h3 className="text-sm font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {post.description.split(" ").slice(0, 20).join(" ")}
                        </p>
                      )}
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          ) : sectionIndex === 2 ? (
            /* Third category - 3 articles in a row with images */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {posts.slice(0, 3).map((post, index) => (
                <Link
                  key={post.id}
                  to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                  className="block group"
                >
                  <article className={`semafor-card overflow-hidden ${index < 3 ? 'border-l border-dashed border-black/10 pl-3 pr-3' : ''}`}>
                    <div className="p-4 mb-4">
                      <h3 className="text-base font-bold mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {post.description.split(" ").slice(0, 20).join(" ")}
                        </p>
                      )}
                    </div>
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
                  </article>
                </Link>
              ))}
            </div>
          ) : sectionIndex === 3 ? (
            /* Fourth category - Gulf layout: one featured article + 4 below */
            <div className="space-y-6">
              {/* Top - single featured article */}
              {posts[0] && (
                <Link
                  to={`/posts/categories/${posts[0].categorySlug}/articles/${posts[0].slug}`}
                  className="block group"
                >
                  <article className="semafor-card overflow-hidden border-b border-dashed border-black/10 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4">
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-700 transition-colors text-center">
                          {posts[0].title}
                        </h3>
                        {posts[0].description && (
                          <p className="text-base text-gray-700 line-clamp-3 text-center">
                            {posts[0].description}
                          </p>
                        )}
                      </div>
                      {posts[0].image && (
                        <div className="h-64 overflow-hidden">
                          <img
                            src={posts[0].image}
                            alt={posts[0].title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              )}

              {/* Bottom - 4 articles in a row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                {posts.slice(1, 5).map((post, index) => (
                  <Link
                    key={post.id}
                    to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                    className="block group"
                  >
                    <article className={`semafor-card p-4 ${index < 3 ? 'border-r border-dashed border-black/10' : ''}`}>
                      <h3 className="text-sm font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-xs text-gray-700 line-clamp-2">
                          {post.description.split(" ").slice(0, 20).join(" ")}
                        </p>
                      )}
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          ) : sectionIndex === categoryPosts.slice(1).length - 1 ? (
            /* Last category - Security layout: 3 articles in a row with images */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {posts.slice(0, 3).map((post, index) => (
                <Link
                  key={post.id}
                  to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                  className="block group"
                >
                  <article className={`semafor-card overflow-hidden flex flex-col pl-4 pr-4 ${index < 3 ? 'border-r border-dashed border-black/10' : ''}`}>
                    <div className="p-4 grow">
                      <h3 className={`font-bold mb-3 group-hover:text-blue-700 transition-colors line-clamp-2 ${index === 2 ? 'text-blue-800 text-base' : 'text-base'}`}>
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {post.description.split(" ").slice(0, 20).join(" ")}
                        </p>
                      )}
                    </div>
                    {post.image && (
                      <div className="h-48 overflow-hidden mt-auto">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            /* Other categories - regular grid layout */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.slice(0, 4).map((post, index) => (
                <Link
                  key={post.id}
                  to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                  className={`block group ${index % 2 === 0 ? 'md:border-r md:border-dashed md:border-black/10 md:pl-6 bg-amber-900' : ''}`}
                >
                  <article className="semafor-card p-5">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-blue-700 transition-colors">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {post.description.split(" ").slice(0, 20).join(" ")}
                      </p>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          )}
        </section>
      ))}
    </main>
  );
}
