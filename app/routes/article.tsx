import type { Route } from "./+types/article";
import { Link } from "react-router";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `مقالة #${params.id} - الثورة` },
    { name: "description", content: "اقرأ المقالة الكاملة على الثورة" },
  ];
}

// Sample article data
const articles: Record<string, any> = {
  "1": {
    id: 1,
    title: "تكريم لمعلمي الأجيال",
    category: "محليات",
    author: "أحمد الكويتي",
    date: "12 نوفمبر 2024",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop",
    content: `
      تم تنظيم حفل تكريم شامل لمعلمي الأجيال في الكويت، حيث حضره عدد من المسؤولين والتربويين.
      
      وقد تناول الحفل أهمية دور المعلم في بناء المجتمع والنهوض بالأجيال الجديدة. كما تم تكريم عدد من المعلمين المتميزين الذين قدموا إسهامات كبيرة في المجال التعليمي.
      
      وأكد المتحدثون على أهمية الاستثمار في التعليم والاهتمام برفع مستوى المعلمين والمعلمات. كما تم الإشادة بالجهود المبذولة من قبل وزارة التربية والتعليم.
      
      وشهد الحفل عروضاً فنية وثقافية متنوعة، كما تم توزيع الجوائز والشهادات على المتميزين من المعلمين.
    `,
  },
  "2": {
    id: 2,
    title: "أخبار اقتصادية هامة",
    category: "اقتصاد",
    author: "محمد الاقتصادي",
    date: "11 نوفمبر 2024",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop",
    content: "محتوى المقالة الاقتصادية...",
  },
  "3": {
    id: 3,
    title: "الرياضة المحلية",
    category: "رياضة",
    author: "علي الرياضي",
    date: "10 نوفمبر 2024",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=600&fit=crop",
    content: "محتوى المقالة الرياضية...",
  },
};

const relatedArticles = [
  {
    id: 4,
    title: "أخبار تعليمية أخرى",
    category: "محليات",
    image: "https://images.unsplash.com/photo-1427504494785-cdba6c3fb77b?w=300&h=200&fit=crop",
  },
  {
    id: 5,
    title: "تطورات في القطاع التعليمي",
    category: "محليات",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop",
  },
  {
    id: 6,
    title: "برامج تدريبية للمعلمين",
    category: "محليات",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop",
  },
];

export default function Article({ params }: Route.ComponentProps) {
  const article = articles[params.id] || articles["1"];

  return (
    <main className="min-h-screen">
      {/* Article Header */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="text-blue-300 hover:text-blue-200 mb-4 inline-block">
            ← العودة للرئيسية
          </Link>
          <span className="inline-block bg-blue-600 px-3 py-1 rounded text-sm font-semibold mb-4">
            {article.category}
          </span>
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex justify-between items-center text-gray-300 text-sm">
            <div>
              <span className="font-semibold">{article.author}</span>
              <span className="mx-2">•</span>
              <span>{article.date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="bg-black py-8">
        <div className="max-w-4xl mx-auto px-4">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="prose prose-lg max-w-none">
                <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                  {article.content}
                </div>
              </article>

              {/* Share Buttons */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-bold text-lg mb-4">شارك هذا المقال</h3>
                <div className="flex gap-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    فيسبوك
                  </button>
                  <button className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500">
                    تويتر
                  </button>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                    نسخ الرابط
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside>
              {/* Related Articles */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">مقالات ذات صلة</h3>
                <div className="space-y-4">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      to={`/article/${related.id}`}
                      className="group block hover:bg-gray-50 p-2 rounded transition-colors"
                    >
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-32 object-cover rounded mb-2 group-hover:opacity-80 transition-opacity"
                      />
                      <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600">
                        {related.title}
                      </h4>
                      <span className="text-xs text-gray-500">{related.category}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">اشترك في النشرة البريدية</h3>
                <p className="text-sm text-gray-600 mb-4">احصل على آخر الأخبار مباشرة</p>
                <form className="space-y-2">
                  <input
                    type="email"
                    placeholder="بريدك الإلكتروني"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
                  >
                    اشترك
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">التعليقات</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-center py-8">
              لا توجد تعليقات حتى الآن. كن أول من يعلق!
            </p>
            <form className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">اسمك</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">بريدك الإلكتروني</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">تعليقك</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
              >
                إرسال التعليق
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
