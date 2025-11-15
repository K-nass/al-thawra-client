import type { Route } from "./+types/home";
import { PostsGrid } from "../components/PostsGrid";
import { Slider } from "../components/Slider";
import { Sidebar } from "../components/Sidebar";
import { NewsletterSubscription } from "../components/NewsletterSubscription";
import type { Post } from "../components/PostCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "الثورة - الصفحة الرئيسية" },
    { name: "description", content: "أخبار ومقالات الثورة" },
  ];
}

// Mock data for testing
const mockPosts: Post[] = [
  {
    id: "1",
    title: "مساعد وزير الخارجية لشؤون أوروبا: تطوير علاقاتنا مع السويد",
    slug: "post-1",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=500&fit=crop",
    categoryName: "محليات",
    categorySlug: "local",
    publishedAt: "2025-11-13T00:00:00Z",
    createdAt: "2025-11-13T00:00:00Z",
  },
  {
    id: "2",
    title: "وزير الأشغال: أعمال صيانة جذرية للطرق وشبكات الصرف والأمطار في منطقة اليرموك",
    slug: "post-2",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=500&fit=crop",
    categoryName: "محليات",
    categorySlug: "local",
    publishedAt: "2025-11-14T00:00:00Z",
    createdAt: "2025-11-14T00:00:00Z",
  },
  {
    id: "3",
    title: "الأرصاد: زيادة الرطوبة خلال الليل وحتى صباح الغد",
    slug: "post-3",
    image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800&h=500&fit=crop",
    categoryName: "محليات",
    categorySlug: "local",
    publishedAt: "2025-11-14T00:00:00Z",
    createdAt: "2025-11-14T00:00:00Z",
  },
];

const mockOpinionPosts: Post[] = [
  {
    id: "4",
    title: "المستشار عادل بطرس",
    slug: "post-4",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop",
    categoryName: "كتاب وآراء",
    categorySlug: "opinion",
    publishedAt: "2025-11-14T00:00:00Z",
    createdAt: "2025-11-14T00:00:00Z",
  },
  {
    id: "5",
    title: "طالب الرفاعي",
    slug: "post-5",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=500&fit=crop",
    categoryName: "كتاب وآراء",
    categorySlug: "opinion",
    publishedAt: "2025-11-14T00:00:00Z",
    createdAt: "2025-11-14T00:00:00Z",
  },
  {
    id: "6",
    title: "أحمد العرافي",
    slug: "post-6",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=500&fit=crop",
    categoryName: "كتاب وآراء",
    categorySlug: "opinion",
    publishedAt: "2025-11-14T00:00:00Z",
    createdAt: "2025-11-14T00:00:00Z",
  },
];

// Slider posts
const sliderPosts: Post[] = [
  {
    id: "s1",
    title: "عاجل: قرارات حكومية جديدة لدعم الاقتصاد الوطني",
    slug: "slider-1",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&h=600&fit=crop",
    categoryName: "عاجل",
    categorySlug: "breaking",
    publishedAt: "2025-11-15T00:00:00Z",
    createdAt: "2025-11-15T00:00:00Z",
  },
  {
    id: "s2",
    title: "مؤتمر دولي في الكويت لمناقشة قضايا المنطقة",
    slug: "slider-2",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop",
    categoryName: "سياسة",
    categorySlug: "politics",
    publishedAt: "2025-11-15T00:00:00Z",
    createdAt: "2025-11-15T00:00:00Z",
  },
  {
    id: "s3",
    title: "إنجازات رياضية تاريخية للمنتخب الوطني",
    slug: "slider-3",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=600&fit=crop",
    categoryName: "رياضة",
    categorySlug: "sports",
    publishedAt: "2025-11-15T00:00:00Z",
    createdAt: "2025-11-15T00:00:00Z",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 space-y-12">
            {/* Slider */}
            <Slider posts={sliderPosts} />

            {/* Local News Section */}
            <PostsGrid posts={mockPosts} categoryName="محليات" />

            {/* Opinion Section */}
            <PostsGrid posts={mockOpinionPosts} categoryName="كتاب وآراء" />
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <Sidebar />
          </div>
        </div>
      </main>

      {/* Newsletter Subscription */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Newsletter - Main Content Area */}
            <div className="flex-1">
              <NewsletterSubscription />
            </div>
            {/* Empty space for sidebar alignment */}
            <div className="lg:w-80 flex-shrink-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
