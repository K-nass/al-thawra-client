import type { Route } from "./+types/category";
import { Link } from "react-router";

export function meta({ params }: Route.MetaArgs) {
  const categoryNames: Record<string, string> = {
    local: "محليات",
    economy: "اقتصاد",
    sports: "رياضة",
    culture: "فن وثقافة",
    tech: "تقنية",
    international: "الثورة الدولي",
    videos: "فيديوهات",
    podcasts: "بودكاست",
  };
  const categoryName = categoryNames[params.slug] || params.slug;
  return [
    { title: `${categoryName} - الثورة` },
    { name: "description", content: `أخبار ${categoryName} على جريدة الثورة` },
  ];
}

// Sample articles for each category
const categoryArticles: Record<string, any[]> = {
  local: [
    {
      id: 1,
      title: "تكريم لمعلمي الأجيال",
      description: "حفل تكريم شامل لمعلمي الأجيال في الكويت",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      date: "12 نوفمبر 2024",
    },
    {
      id: 2,
      title: "مشروع جديد في البنية التحتية",
      description: "إطلاق مشروع تطوير البنية التحتية في الكويت",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop",
      date: "11 نوفمبر 2024",
    },
    {
      id: 3,
      title: "أخبار البلدية",
      description: "آخر قرارات البلدية والخدمات البلدية",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      date: "10 نوفمبر 2024",
    },
    {
      id: 4,
      title: "فعاليات محلية",
      description: "أحدث الفعاليات والمناسبات المحلية",
      image: "https://images.unsplash.com/photo-1540575467063-178f50002cbc?w=400&h=300&fit=crop",
      date: "9 نوفمبر 2024",
    },
  ],
  economy: [
    {
      id: 5,
      title: "أخبار السوق المالي",
      description: "تطورات السوق المالي الكويتي",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
      date: "12 نوفمبر 2024",
    },
    {
      id: 6,
      title: "أسعار النفط",
      description: "تحديث أسعار النفط العالمية",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
      date: "11 نوفمبر 2024",
    },
  ],
  sports: [
    {
      id: 7,
      title: "نتائج المباريات",
      description: "نتائج مباريات الدوري الكويتي",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
      date: "12 نوفمبر 2024",
    },
    {
      id: 8,
      title: "أخبار الأندية",
      description: "آخر أخبار الأندية الرياضية",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
      date: "11 نوفمبر 2024",
    },
  ],
  culture: [
    {
      id: 9,
      title: "الفعاليات الثقافية",
      description: "أحدث الفعاليات الثقافية والفنية",
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop",
      date: "12 نوفمبر 2024",
    },
  ],
  tech: [
    {
      id: 10,
      title: "أحدث التطورات التكنولوجية",
      description: "آخر الأخبار التكنولوجية والابتكارات",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
      date: "12 نوفمبر 2024",
    },
  ],
};

const categoryNames: Record<string, string> = {
  local: "محليات",
  economy: "اقتصاد",
  sports: "رياضة",
  culture: "فن وثقافة",
  tech: "تقنية",
  international: "الثورة الدولي",
  videos: "فيديوهات",
  podcasts: "بودكاست",
};

export default function Category({ params }: Route.ComponentProps) {
  const categoryName = categoryNames[params.slug] || params.slug;
  const articles = categoryArticles[params.slug] || [];

  return (
    <main className="min-h-screen">
      {/* Category Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{categoryName}</h1>
          <p className="text-blue-100">اكتشف أحدث الأخبار والمقالات في قسم {categoryName}</p>
        </div>
      </section>

      {/* Filter and Sort */}
      <section className="bg-white border-b border-gray-200 py-4 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              الأحدث
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              الأكثر قراءة
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              الأكثر تعليقاً
            </button>
          </div>
          <span className="text-gray-600 text-sm">
            عدد المقالات: {articles.length}
          </span>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="group bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {article.description}
                    </p>
                    <p className="text-gray-500 text-xs">{article.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">لا توجد مقالات في هذا القسم حالياً</p>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {articles.length > 0 && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 flex justify-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              السابق
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
              التالي
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
