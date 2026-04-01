import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import type { Post } from "../services/postsService";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import ArticleImage from "../components/ArticleImage";
import { cleanPlainText } from "~/utils/arabicTextUtils";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface Layout1Props {
  sliderPosts: Post[];
  urgentPosts: Post[];
  rightDirectionPosts: Post[];
  leftDirectionPosts: Post[];
  chiefEditor: any;
  chiefEditorPosts: Post[];
}

export default function Layout1({ sliderPosts, urgentPosts, rightDirectionPosts, leftDirectionPosts, chiefEditor, chiefEditorPosts }: Layout1Props) {
  const getFirstChar = (value?: string) => (value && value.trim().length > 0 ? value.trim()[0] : "ك");

  const posts = rightDirectionPosts || [];
  const [rightStartIndex, setRightStartIndex] = useState(0);

  // Keep the index valid if the list size changes (e.g. refetch).
  useEffect(() => {
    if (posts.length === 0) return;
    setRightStartIndex((i) => i % posts.length);
  }, [posts.length]);

  const rightWindow = useMemo(() => {
    if (posts.length === 0) return [];
    const windowSize = Math.min(5, posts.length);
    const picked: Post[] = [];
    const seen = new Set<string>();

    // Pick up to 5 unique posts in a looping manner: 1 featured + 4 cards.
    for (let offset = 0; offset < posts.length && picked.length < windowSize; offset++) {
      const p = posts[(rightStartIndex + offset) % posts.length];
      if (!p) continue;
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      picked.push(p);
    }

    return picked;
  }, [posts, rightStartIndex]);

  const featuredPost = rightWindow[0];
  const authorCardPosts = rightWindow.slice(1, 5);

  const canSwapRight = posts.length > 1;
  const goNextRight = () => {
    if (!canSwapRight) return;
    setRightStartIndex((i) => (posts.length === 0 ? 0 : (i + 1) % posts.length));
  };
  const goPrevRight = () => {
    if (!canSwapRight) return;
    setRightStartIndex((i) => (posts.length === 0 ? 0 : (i - 1 + posts.length) % posts.length));
  };

  // Auto-rotate so the visible right articles swap as we loop through the array.
  useEffect(() => {
    if (!canSwapRight) return;
    const id = window.setInterval(goNextRight, 9000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSwapRight, posts.length]);
  console.log(authorCardPosts);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4 lg:border-b-2 semafor-section-title min-h-[400px] lg:min-h-[600px]">
      {/* Left Sidebar - Featured Content */}
      <aside className="lg:col-span-3 order-2 lg:order-1 h-full">
        <div className="h-full flex flex-col">
          {/* Main Featured Article */}
          <div className="pb-4 border-b border-dashed border-black/10">
            {featuredPost ? (
              <div className="group">
                <div className="flex items-center justify-between gap-3">
                  <div className="mb-0">
                    <span className="text-xs uppercase tracking-wide text-gray-600 font-semibold">
                      {featuredPost.categoryName}
                    </span>
                  </div>

                  {canSwapRight && (
                    <div className="flex items-center gap-3 opacity-0 translate-y-1 pointer-events-none transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto focus-within:opacity-100 focus-within:translate-y-0 focus-within:pointer-events-auto">
                      <button
                        type="button"
                        onClick={goPrevRight}
                        className="w-8 h-8 rounded-full border-2 border-gray-800 text-gray-800 flex items-center justify-center transition-all duration-300 ease-out active:scale-95"
                        aria-label="المقال السابق"
                      >
                        <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={goNextRight}
                        className="w-8 h-8 rounded-full border-2 border-gray-800 text-gray-800 flex items-center justify-center transition-all duration-300 ease-out  active:scale-95"
                        aria-label="المقال التالي"
                      >
                        <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <Link
                  to={`/posts/categories/${featuredPost.categorySlug}/articles/${featuredPost.slug}`}
                  className="block group"
                >
                  <h3 className="text-lg font-bold mb-3 leading-tight group-hover:text-blue-700 transition-colors">
                    {featuredPost.title}
                  </h3>
                  {featuredPost.summary && (
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {cleanPlainText(featuredPost.summary)}
                    </p>
                  )}
                  <div className="mb-2">
                    <ArticleImage
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full overflow-hidden"
                      aspectRatio="4 / 3"
                      loading="eager"
                    />
                  </div>
                  {(featuredPost.imageDescription || featuredPost.authorName) && (
                    <p className="text-xs text-gray-500">
                      {featuredPost.imageDescription || featuredPost.authorName}
                    </p>
                  )}
                </Link>
              </div>
            ) : (
              <div className="py-8">
                <p className="text-sm text-gray-600">لا توجد مقالات متاحة</p>
              </div>
            )}
          </div>

          {/* Author Cards - Two Columns */}
          <div className="grid grid-cols-2 gap-3">
            {authorCardPosts.map((post) => (
              <Link
                key={post.id}
                to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                className="bg-[#b8d4e0] p-3 flex flex-col group justify-between gap-6 transition-colors"
              >
                <h4 className="text-sm font-bold leading-tight group-hover:text-blue-700 transition-colors">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2">
                  {post.authorImage ? (
                    <img
                      src={post.authorImage}
                      alt={post.authorName || post.title}
                      className="w-10 h-10 rounded-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-bold">
                      {getFirstChar(post.createdBy)}
                    </div>
                  )}
                  <div className="text-xs">
                    <div className="font-semibold">{post.createdBy}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area - Swiper */}
      <div className="lg:col-span-6 order-1 lg:order-2 md:border-r md:border-l md:border-dashed md:border-black/10 relative p-4">
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{
              el: '.swiper-pagination-container',
              clickable: true,
              dynamicBullets: false,
              renderBullet: (index: number, className: string) => {
                const total = sliderPosts.length;
                // Distance from nearest edge (0 = edge, higher = more central)
                const distFromEdge = Math.min(index, total - 1 - index);
                let sizeClass = 'dot-middle'; // default normal
                if (distFromEdge === 0) {
                  sizeClass = 'dot-edge';      // smallest
                } else if (distFromEdge === 1) {
                  sizeClass = 'dot-near-edge'; // slightly smaller
                }
                return `<span class="${className} graduated-bullet ${sizeClass}"></span>`;
              },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            effect="fade"
            fadeEffect={{
              crossFade: true
            }}
            loop={sliderPosts.length > 1}
            speed={800}
            className="premium-swiper h-full"
          >
            {sliderPosts.length > 0 ? (
              sliderPosts.map((post) => (
                <SwiperSlide key={post.id} className="h-full">
                  <Link
                    to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                    className="block group h-full"
                  >
                    <article className="h-full flex flex-col">
                      <div className="px-4 py-4 text-center">
                        {post.categoryName && (
                          <div className="mb-3">
                            <span className="text-lg uppercase tracking-wider text-gray-600 font-bold">
                              {post.categoryName}
                            </span>
                          </div>
                        )}

                        <h1 className="semafor-main-headline mb-4 group-hover:text-blue-700 transition-colors">
                          {post.title}
                        </h1>

                        {post.summary && (
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {cleanPlainText(post.summary)}
                          </p>
                        )}
                      </div>

                      <div className="flex-1 flex items-center justify-center px-6 pb-6">
                        <div className="w-full max-w-2xl aspect-[4/3] overflow-hidden">
                          < ArticleImage
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full"
                          />
                        </div>
                      </div>

                      {post.authorName && (
                        <p className="text-xs text-gray-500 py-2 text-center">
                          تصوير: {post.authorName}
                        </p>
                      )}
                    </article>
                  </Link>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <section className="h-full flex items-center justify-center">
                  <p className="text-gray-500">لا توجد مقالات متاحة</p>
                </section>
              </SwiperSlide>
            )}
          </Swiper>

          {/* Navigation Controls Row */}
          <div className="flex items-center justify-between mt-4">
            {/* Pagination dots will be rendered here by Swiper */}
            <div className="swiper-pagination-container flex-1"></div>

            {/* Custom Navigation Buttons */}
            {sliderPosts.length > 1 && (
              <div className="flex items-center gap-3">
                <button
                  className="swiper-button-prev-custom w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center"
                  aria-label="Previous slide"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  className="swiper-button-next-custom w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center"
                  aria-label="Next slide"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - "The World at a Glance" */}
      <aside className="lg:col-span-3 order-3 pb-4 lg:pb-6 lg:pl-6 h-full">
        <div className="space-y-4 h-full flex flex-col">
          <div className="flex-1">
            {/* Header with title and map */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-2xl font-bold leading-tight">
                  اليمن في لمحة
                </h2>
                <div className="flex items-center gap-2 pt-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></span>
                  <span className="text-xs text-gray-600 whitespace-nowrap">
                    تم التحديث {new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
                  </span>
                </div>
              </div>
              <div className="flex items-start justify-end">
                <img
                  src="/map.png"
                  alt="خريطة العالم"
                  className="w-full h-32 object-contain"
                />
              </div>
              <hr className="w-full border-dashed border-black/10 col-span-2" />
            </div>
            {leftDirectionPosts && leftDirectionPosts.length > 0 ? (
              <div className="divide-y divide-dashed divide-black/10">
                {/* 3 rows with image */}
                {leftDirectionPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                    className="flex items-start gap-3 py-3 group transition-colors"
                    title={post.title}
                  >
                    <div className="w-36 flex-none overflow-hidden border border-dashed border-black/10">
                      <ArticleImage
                        src={post.image}
                        alt={post.title}
                        className="w-full"
                        aspectRatio="4 / 3"
                      />
                    </div>

                    <div className="flex-1 min-w-0 text-right">
                      <div className="text-[11px] uppercase tracking-wide text-gray-600 font-semibold line-clamp-1">
                        {post.categoryName}
                      </div>
                      <div className="mt-1 text-sm font-semibold leading-snug text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-3">
                        {post.title}
                      </div>
                    </div>
                  </Link>
                ))}

                {/* 4 rows without image */}
                {leftDirectionPosts.slice(3, 7).map((post) => (
                  <Link
                    key={post.id}
                    to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                    className="block py-3 group transition-colors"
                    title={post.title}
                  >
                    <div className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-blue-700 transition-colors text-right line-clamp-2">
                      {post.title}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">لا توجد مقالات متاحة</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
