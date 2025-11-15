import { useParams } from "react-router";
import { PostsGrid } from "../components/PostsGrid";
import type { Post } from "../components/PostCard";

// Dummy author data
const dummyAuthor = {
  id: "1",
  name: "أميرة بن طرف",
  email: "Amira@alqabas.com",
  avatar: "https://via.placeholder.com/150",
  bio: "كاتبة وصحفية متخصصة في الشؤون الاجتماعية والتعليمية",
  postsCount: 156,
  followersCount: 12500,
};

// Dummy posts data
const dummyPosts: Post[] = [
  {
    id: "1",
    title: "العربية لولادة القضايا لعضوات مجالس المحافظات: إنجازات المرأة الكويتية مصدر فخر وإلهام",
    slug: "post-1",
    image: "https://via.placeholder.com/800x600",
    categoryName: "محليات",
    categorySlug: "local",
    publishedAt: "2025-11-12T10:00:00Z",
    createdAt: "2025-11-12T10:00:00Z",
    authorName: "أميرة بن طرف",
    authorSlug: "amira-ben-taraf",
  },
  {
    id: "2",
    title: "جهاز الاعتماد الأكاديمي: إلغاء 155 برنامجاً دراسياً من قوائم اعتماد الجامعات الأميركية",
    slug: "post-2",
    image: "https://via.placeholder.com/800x600",
    categoryName: "محليات",
    categorySlug: "local",
    publishedAt: "2025-11-13T10:00:00Z",
    createdAt: "2025-11-13T10:00:00Z",
    authorName: "أميرة بن طرف",
    authorSlug: "amira-ben-taraf",
  },
  {
    id: "3",
    title: "وزارة التربية تستطلع آراء الميدان وأولياء الأمور حول المناهج الجديدة",
    slug: "post-3",
    image: "https://via.placeholder.com/800x600",
    categoryName: "محليات",
    categorySlug: "local",
    publishedAt: "2025-11-13T13:34:00Z",
    createdAt: "2025-11-13T13:34:00Z",
    authorName: "أميرة بن طرف",
    authorSlug: "amira-ben-taraf",
  },
  {
    id: "4",
    title: "التعليم العالي يناقش خطط التطوير الأكاديمي للجامعات الحكومية",
    slug: "post-4",
    image: "https://via.placeholder.com/800x600",
    categoryName: "محليات",
    categorySlug: "local",
    publishedAt: "2025-11-10T10:00:00Z",
    createdAt: "2025-11-10T10:00:00Z",
    authorName: "أميرة بن طرف",
    authorSlug: "amira-ben-taraf",
  },
  {
    id: "5",
    title: "مبادرات تعليمية جديدة لدعم الطلاب المتفوقين",
    slug: "post-5",
    image: "https://via.placeholder.com/800x600",
    categoryName: "محليات",
    categorySlug: "local",
    publishedAt: "2025-11-09T10:00:00Z",
    createdAt: "2025-11-09T10:00:00Z",
    authorName: "أميرة بن طرف",
    authorSlug: "amira-ben-taraf",
  },
  {
    id: "6",
    title: "ورش عمل تدريبية للمعلمين حول التقنيات الحديثة",
    slug: "post-6",
    image: "https://via.placeholder.com/800x600",
    categoryName: "محليات",
    categorySlug: "local",
    publishedAt: "2025-11-08T10:00:00Z",
    createdAt: "2025-11-08T10:00:00Z",
    authorName: "أميرة بن طرف",
    authorSlug: "amira-ben-taraf",
  },
];

export default function AuthorPage() {
  const params = useParams();
  const authorSlug = params.slug;

  return (
    <>
      {/* Author Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Author Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-primary)] shadow-lg">
                <img
                  src={dummyAuthor.avatar}
                  alt={dummyAuthor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Author Info */}
            <div className="flex-1 text-center md:text-right">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                {dummyAuthor.name}
              </h1>
              <a
                href={`mailto:${dummyAuthor.email}`}
                className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors mb-3 inline-block"
              >
                {dummyAuthor.email}
              </a>
              <p className="text-[var(--color-text-secondary)] text-lg mb-4 max-w-2xl">
                {dummyAuthor.bio}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[var(--color-primary)]">
                    {dummyAuthor.postsCount}
                  </span>
                  <span className="text-[var(--color-text-secondary)]">مقال</span>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[var(--color-primary)]">
                    {dummyAuthor.followersCount.toLocaleString()}
                  </span>
                  <span className="text-[var(--color-text-secondary)]">متابع</span>
                </div>
              </div>
            </div>

            {/* Follow Button */}
            <div className="flex items-start">
              <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium shadow-md">
                متابعة +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Author Posts */}
      <div className="bg-[var(--color-background-light)] py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            مقالات {dummyAuthor.name}
          </h2>
          <PostsGrid posts={dummyPosts} />
        </div>
      </div>
    </>
  );
}
