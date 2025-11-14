import type { Route } from "./+types/search";
import { Link, useSearchParams } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "بحث - الثورة" },
    { name: "description", content: "ابحث عن الأخبار على جريدة الثورة" },
  ];
}

// Sample search results
const allArticles = [
  {
    id: 1,
    title: "تكريم لمعلمي الأجيال",
    description: "تقرير شامل عن حفل تكريم المعلمين والمربين في الكويت",
    category: "محليات",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    date: "12 نوفمبر 2024",
  },
  {
    id: 2,
    title: "أخبار اقتصادية هامة",
    description: "تطورات السوق المالي الكويتي",
    category: "اقتصاد",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
    date: "11 نوفمبر 2024",
  },
  {
    id: 3,
    title: "الرياضة المحلية",
    description: "نتائج المباريات والبطولات",
    category: "رياضة",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
    date: "10 نوفمبر 2024",
  },
  {
    id: 4,
    title: "فن وثقافة",
    description: "أحدث الفعاليات الثقافية",
    category: "فن وثقافة",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop",
    date: "9 نوفمبر 2024",
  },
  {
    id: 5,
    title: "التقنية والابتكار",
    description: "أحدث التطورات التكنولوجية",
    category: "تقنية",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    date: "8 نوفمبر 2024",
  },
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const results = query
    ? allArticles.filter(
        (article) =>
          article.title.includes(query) ||
          article.description.includes(query) ||
          article.category.includes(query)
      )
    : [];

  return (
    <main className="min-h-screen">
      {/* Search Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6">بحث</h1>
          <form className="flex gap-2" action="/search" method="get">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="ابحث عن أخبار..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              بحث
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {query ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  تم العثور على <span className="font-bold text-blue-600">{results.length}</span> نتيجة
                  {query && (
                    <>
                      {" "}
                      لـ "<span className="font-bold">{query}</span>"
                    </>
                  )}
                </p>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((article) => (
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
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded inline-block mb-2">
                          {article.category}
                        </span>
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
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-lg mb-4">
                    لم يتم العثور على نتائج لـ "{query}"
                  </p>
                  <p className="text-gray-500 mb-6">
                    حاول البحث عن كلمات مختلفة أو تصفح الأقسام الرئيسية
                  </p>
                  <Link
                    to="/"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    العودة للرئيسية
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg mb-4">ابدأ البحث عن الأخبار</p>
              <p className="text-gray-500">
                استخدم شريط البحث أعلاه للبحث عن المقالات والأخبار
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Searches */}
      {!query && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">عمليات بحث شهيرة</h2>
            <div className="flex flex-wrap gap-3">
              {["محليات", "اقتصاد", "رياضة", "فن وثقافة", "تقنية"].map((term) => (
                <Link
                  key={term}
                  to={`/search?q=${term}`}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-600 transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
