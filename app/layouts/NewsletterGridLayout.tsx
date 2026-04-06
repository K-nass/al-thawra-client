import { useState } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import type { Post } from "../services/postsService";
import type { Category } from "../services/categoriesService";
import Layout3 from "./Layout3";
import ArticleImage from "../components/ArticleImage";
import { cleanPlainText } from "~/utils/arabicTextUtils";
import ColoredTitle from "~/components/ColoredTitle";

interface NewsletterGridLayoutProps {
  posts: Post[];
  newsletterCategories?: Category[];
}

interface BriefingService {
  id: string;
  name: string;
  description: string;
  frequency: string;
}

export default function NewsletterGridLayout({ posts, newsletterCategories = [] }: NewsletterGridLayoutProps) {
  const [email, setEmail] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle empty or undefined posts
  const safePosts = posts || [];

  // Map categories to BriefingService format (limit to 10)
  const services: BriefingService[] = newsletterCategories
    .sort((a, b) => a.order - b.order)
    .slice(0, 10)
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description || "اشترك للحصول على آخر التحديثات",
      frequency: "حسب التحديثات",
    }));

  // Initialize selected services with first two items
  const [selectedServices, setSelectedServices] = useState<string[]>(() =>
    services.slice(0, 2).map(s => s.id)
  );

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
  };

  const displayedServices = isExpanded ? services : services.slice(0, 3);

  // Get first 4 posts for first row
  const firstRowPosts = safePosts.slice(0, 10);

  // Get posts 5-7 for second row
  const secondRowPosts = safePosts.slice(4, 7);

  // Empty state
  if (safePosts.length === 0) {
    return (
      <div className="min-h-[600px] md:min-h-[700px] flex items-center justify-center">
        <p className="text-gray-500 text-lg">لا توجد مقالات متاحة</p>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] md:min-h-[700px] space-y-4">
      {/* First Row: Articles Swiper */}
      <Swiper
        spaceBetween={16}
        breakpoints={{
          0: { slidesPerView: 2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
        style={{ height: 'auto' }}
      >
        {firstRowPosts.map((post) => (
          <SwiperSlide key={post.id} style={{ height: 'auto' }}>
            <Link
              to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
              className="block group h-full"
            >
              <article className="h-full flex flex-col border border-dashed border-black/10 overflow-hidden">
                <div className="p-3 min-h-[180px] flex flex-col">
                  <ColoredTitle
                    title={post.title}
                    coloredWordsCount={0}
                    className="semafor-section-title hover:text-blue-700 transition-colors mb-2"
                  />

                  {post.summary && (
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {cleanPlainText(post.summary)}
                    </p>
                  )}
                </div>

                <ArticleImage
                  src={post.image}
                  alt={post.title}
                  className="w-full flex-none h-52 md:h-48 lg:h-44 mt-auto"
                />
              </article>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Second Row: 3 Articles + Subscription */}
      {safePosts.length >= 5 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
          {/* Left Column: 3 Articles + Advertisement */}
          <div className="lg:col-span-3 space-y-4">
            {/* 3 Articles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {secondRowPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                  className="block group"
                >
                  <article className="h-full flex flex-col border border-dashed border-black/10 overflow-hidden">
                    <div className="p-3">
                      <ColoredTitle
                        title={post.title}
                        coloredWordsCount={0}
                        className="text-lg font-bold mb-2 leading-tight line-clamp-2 hover:text-blue-700 transition-colors"
                      />

                      {post.summary && (
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                          {cleanPlainText(post.summary)}
                        </p>
                      )}
                    </div>

                    <ArticleImage
                      src={post.image}
                      alt={post.title}
                      className="w-full flex-none mt-auto h-52 md:h-48 lg:h-44"
                    />
                  </article>
                </Link>
              ))}
            </div>

            {/* Layout3 - Advertisement Section */}
            <Layout3
              category="إعلان"
              title="أتلانتس دبي تقدم دخولاً مجانياً للحديقة المائية بينما تستمر الحرب"
              summary="جاءت هذه البادرة الحسنة بعد أقل من أسبوعين من قيام طائرة إيرانية بدون طيار بضرب فندق فيرمونت ذا بالم على بعد حوالي ثلاثة أميال، مما أدى إلى إصابة أربعة أشخاص."
              image="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"
              imageCredit="كريم صحيح/وكالة فرانس برس عبر Getty"
            />
          </div>

          {/* Briefings Subscription */}
          <div className="lg:col-span-1">
            <div className="bg-[#b8d4e0] h-full flex flex-col">
              {/* Sticky Header Section */}
              <div className="sticky top-0 bg-[#b8d4e0] z-10 border-b border-dashed border-black/30 pb-3">
                <div className="p-3">
                  <h2 className="text-lg font-bold mb-3 text-black">
                    اشترك في نشراتنا الإخبارية
                  </h2>

                  {/* Email Input Form */}
                  <form onSubmit={handleSubmit} className="mb-2">
                    <div className="flex border border-black overflow-hidden">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="البريد الإلكتروني"
                        dir="rtl"
                        className="flex-1 min-w-0 px-2 py-1.5 text-sm text-black placeholder-gray-600 focus:outline-none bg-white border-0"
                      />
                      <button
                        type="submit"
                        className="shrink-0 px-3 py-1.5 bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors border-r border-black"
                      >
                        إرسال
                      </button>
                    </div>
                  </form>

                  {/* Selected Count */}
                  <p className="text-sm text-gray-700 text-center">
                    {selectedServices.length} نشرات مختارة
                  </p>
                </div>
              </div>

              {/* Scrollable Services List */}
              <div className="flex-1 overflow-y-auto p-3">
                <div className="space-y-3">
                  {displayedServices.map((service) => (
                    <div key={service.id} className="border-b border-dashed border-black/30 pb-3 last:border-b-0">
                      <label className="flex items-start gap-2 cursor-pointer group">
                        {/* Custom Styled Checkbox */}
                        <div className="relative shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service.id)}
                            onChange={() => handleServiceToggle(service.id)}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 border-2 border-black bg-[#d0e8f2] peer-checked:bg-black peer-checked:border-black flex items-center justify-center transition-colors">
                            {selectedServices.includes(service.id) && (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-black mb-1 group-hover:text-gray-700 transition-colors">
                            {service.name}
                          </h3>
                          {/* <p className="text-sm text-gray-700 mb-1 leading-snug">
                            {service.description}
                          </p> */}
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600 font-semibold">{service.frequency}</span>
                            <span className="text-blue-700 hover:underline cursor-pointer">اقرأها</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Collapse/Expand Button */}
              <div className="border-t border-dashed border-black/30 p-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "إخفاء الخدمات" : "عرض جميع الخدمات"}
                  className="w-full flex items-center justify-center py-1 text-black hover:bg-black/5 transition-colors rounded"
                >
                  {isExpanded ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
