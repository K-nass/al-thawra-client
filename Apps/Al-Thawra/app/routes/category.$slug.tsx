import { useParams } from "react-router";
import { Link } from "react-router";
import { PostsGrid } from "../components/PostsGrid";
import type { Post } from "../components/PostCard";

// Dummy category data
const dummyCategories: Record<string, {
  id: string;
  name: string;
  slug: string;
  subcategories?: { name: string; slug: string }[];
}> = {
  economy: {
    id: "1",
    name: "اقتصاد",
    slug: "economy",
    subcategories: [
      { name: "شركة الاستثمارات الوطنية", slug: "national-investments" },
      { name: "بيت التمويل الكويتي", slug: "kuwait-finance-house" },
    ],
  },
  local: {
    id: "2",
    name: "محليات",
    slug: "local",
  },
  opinion: {
    id: "3",
    name: "كتاب وآراء",
    slug: "opinion",
  },
  international: {
    id: "4",
    name: "الثورة الدولي",
    slug: "international",
  },
};

// Dummy posts data
const dummyPosts: Post[] = [
  {
    id: "1",
    title: "«البيت» و«الشامية» تطلقان مشروعاً لتطوير أبراج مكتبية",
    slug: "post-1",
    image: "https://via.placeholder.com/800x600",
    categoryName: "اقتصاد",
    categorySlug: "economy",
    publishedAt: "2025-11-15T09:22:00Z",
    createdAt: "2025-11-15T09:22:00Z",
  },
  {
    id: "2",
    title: "«أسيكو» تحقق 8.3 مليين دينار أرباحاً صافية",
    slug: "post-2",
    image: "https://via.placeholder.com/800x600",
    categoryName: "اقتصاد",
    categorySlug: "economy",
    publishedAt: "2025-11-15T08:00:00Z",
    createdAt: "2025-11-15T08:00:00Z",
  },
  {
    id: "3",
    title: "«كامكو إنفست» تحقق 7.9 مليين دينار أرباحاً",
    slug: "post-3",
    image: "https://via.placeholder.com/800x600",
    categoryName: "اقتصاد",
    categorySlug: "economy",
    publishedAt: "2025-11-15T07:30:00Z",
    createdAt: "2025-11-15T07:30:00Z",
  },
  {
    id: "4",
    title: "«كيبكو» تحقق 13.4 مليون دينار أرباحاً في 9",
    slug: "post-4",
    image: "https://via.placeholder.com/800x600",
    categoryName: "اقتصاد",
    categorySlug: "economy",
    publishedAt: "2025-11-15T07:00:00Z",
    createdAt: "2025-11-15T07:00:00Z",
  },
  {
    id: "5",
    title: "البورصة الكويتية تسجل ارتفاعاً في التداولات",
    slug: "post-5",
    image: "https://via.placeholder.com/800x600",
    categoryName: "اقتصاد",
    categorySlug: "economy",
    publishedAt: "2025-11-14T10:00:00Z",
    createdAt: "2025-11-14T10:00:00Z",
  },
  {
    id: "6",
    title: "اتفاقية تعاون بين البنك الوطني والشركة العالمية",
    slug: "post-6",
    image: "https://via.placeholder.com/800x600",
    categoryName: "اقتصاد",
    categorySlug: "economy",
    publishedAt: "2025-11-14T09:00:00Z",
    createdAt: "2025-11-14T09:00:00Z",
  },
];

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug || "economy";
  const category = dummyCategories[categorySlug] || dummyCategories.economy;

  return (
    <>
      {/* Category Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-6 flex-wrap">
            {/* Category Title */}
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">
              {category.name}
            </h1>

            {/* Subcategories */}
            {category.subcategories && category.subcategories.length > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <nav className="flex items-center gap-2 flex-wrap">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.slug}
                      to={`/category/${category.slug}/${subcategory.slug}`}
                      className="px-3 py-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-blue-50 rounded-md transition-all font-medium border border-gray-200"
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </nav>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category Posts Grid */}
      <div className="bg-[var(--color-background-light)] py-8">
        <div className="container mx-auto px-4">
          <PostsGrid posts={dummyPosts} />
          
          {/* Load More Button */}
          <div className="flex justify-center mt-8">
            <button className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium shadow-md hover:shadow-lg">
              تحميل المزيد
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
