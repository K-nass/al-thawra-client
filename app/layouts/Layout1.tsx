import { Link } from "react-router";
import type { Post } from "../services/postsService";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface Layout1Props {
  sliderPosts: Post[];
  urgentPosts: Post[];
  chiefEditor: any;
  chiefEditorPosts: Post[];
}

export default function Layout1({ sliderPosts, urgentPosts, chiefEditor, chiefEditorPosts }: Layout1Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-4 lg:border-b-2 semafor-section-title min-h-[600px] lg:min-h-[700px]">
      {/* Left Sidebar - Featured Content */}
      <aside className="lg:col-span-3 order-2 lg:order-1 h-full">
        <div className="h-full flex flex-col">
          {/* Main Featured Article */}
          <div className="pb-4 border-b border-dashed border-black/10">
            <div className="mb-3">
              <span className="text-xs uppercase tracking-wide text-gray-600 font-semibold">
                السياسة
              </span>
            </div>
            <h3 className="text-lg font-bold mb-3 leading-tight">
              البيت الأبيض يشير إلى مرور آمن لمشروع قانون الإسكان
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              مجلس الشيوخ في طريقه لتمرير حظر الرئيس دونالد ترامب المقترح على المستثمرين المؤسسيين في الإسكان كجزء من حزمة أكبر من الإجراءات.
            </p>
            <div className="mb-2">
              <img 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23cccccc' width='400' height='400'/%3E%3Ctext fill='%23666666' font-family='Arial' font-size='20' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EArticle Image%3C/text%3E%3C/svg%3E" 
                alt="مبنى الكابيتول" 
                className="w-full aspect-square object-cover"
              />
            </div>
            <p className="text-xs text-gray-500">
              كايلي كوبر/رويترز
            </p>
          </div>

          {/* Author Cards - Two Columns */}
          <div className="grid grid-cols-2 gap-3 pt-4 flex-1">
            {/* Author Card 1 */}
            <div className="bg-[#b8d4e0] p-3 flex flex-col">
              <h4 className="text-sm font-bold mb-auto leading-tight">
                رأي / صدمات النفط الماضية قد تعلمنا الدرس الخاطئ حول حرب إيران
              </h4>
              <div className="flex items-center gap-2 mt-3">
                <img 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle fill='%234a5568' cx='50' cy='50' r='50'/%3E%3Ctext fill='%23ffffff' font-family='Arial' font-size='24' font-weight='bold' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3EAS%3C/text%3E%3C/svg%3E" 
                  alt="علاء شاهين صالحة" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-xs">
                  <div className="font-semibold">علاء شاهين</div>
                  <div className="font-semibold">صالحة</div>
                </div>
              </div>
            </div>

            {/* Author Card 2 */}
            <div className="bg-[#b8d4e0] p-3 flex flex-col">
              <h4 className="text-sm font-bold mb-auto leading-tight">
                رأي / استراتيجية الطاقة الفائزة للصين
              </h4>
              <div className="flex items-center gap-2 mt-3">
                <img 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle fill='%234a5568' cx='50' cy='50' r='50'/%3E%3Ctext fill='%23ffffff' font-family='Arial' font-size='24' font-weight='bold' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3ETM%3C/text%3E%3C/svg%3E" 
                  alt="تيم ماكدونيل" 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-xs">
                  <div className="font-semibold">تيم</div>
                  <div className="font-semibold">ماكدونيل</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area - Swiper */}
      <div className="lg:col-span-6 order-1 lg:order-2 md:border-r md:border-l md:border-dashed md:border-black/10 relative group/swiper p-4">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: false,
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

                      {post.description && (
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {post.description}
                        </p>
                      )}
                    </div>

                    {post.image && (
                      <div className="flex-1 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    )}
                    
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

        {/* Custom Navigation Buttons */}
        {sliderPosts.length > 1 && (
          <>
            <button 
              className="swiper-button-prev-custom absolute left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#b8d4e0] shadow-lg flex items-center justify-center opacity-0 group-hover/swiper:opacity-100 transition-opacity duration-300"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="swiper-button-next-custom absolute right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#b8d4e0] shadow-lg flex items-center justify-center opacity-0 group-hover/swiper:opacity-100 transition-opacity duration-300"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Right Sidebar - "The World at a Glance" */}
      <aside className="lg:col-span-3 order-3 pb-4 lg:pb-6 lg:pl-6 h-full">
        <div className="space-y-4 h-full flex flex-col">
          <div className="flex-1">
            {/* Header with title and map */}
            <div className="grid grid-cols-2 gap-4 pb-4">
              <div>
                <h2 className="text-2xl font-bold leading-tight">
                  العالم في لمحة
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
            </div>
            {urgentPosts && urgentPosts.length > 0 ? (
              <ol className="space-y-4">
                {urgentPosts.slice(0, 6).map((post, index) => (
                  <li key={post.id} className="text-sm leading-relaxed">
                    <Link
                      to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                      className="block group"
                    >
                      <span className="font-bold text-gray-700">{index + 1}</span>{' '}
                      <span className="underline decoration-2 underline-offset-2 font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                        {post.title}
                      </span>
                      {post.description && (
                        <span className="text-gray-500">
                          {' '}{post.description.split(' ').slice(0, 15).join(' ')}...
                        </span>
                      )}
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
    </div>
  );
}
