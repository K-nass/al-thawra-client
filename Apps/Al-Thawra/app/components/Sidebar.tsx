import { Link } from "react-router";
import type { Post } from "../services/postsService";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "./ScrollAnimation";

export function Sidebar({ trendingPosts }: { trendingPosts: Post[] }) {
  return (
    <aside className="space-y-6">
      {/* Editor's Article Section */}
      <ScrollAnimation animation="slideLeft" once={false}>
        <div className="bg-[var(--color-white)] rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
            مقالة رئيس التحرير
          </h3>
          <span className="text-sm font-bold text-[var(--color-primary)] mb-4 block border-b-2 border-[var(--color-primary)] pb-2 w-fit">
            د. محمد الرميحي
          </span>
          <Link to="#" className="group block">
            <div className="relative aspect-video mb-3 overflow-hidden rounded-md">
              <img
                src="https://placehold.co/600x400/png"
                alt="Editor's Article"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
              عنوان المقالة الافتراضي هنا
            </h4>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2 line-clamp-3">
              مقدمة قصيرة عن المقالة توضح المحتوى بشكل مختصر وجذاب للقارئ...
            </p>
          </Link>
        </div>
      </ScrollAnimation>

      {/* Trending Posts Section */}
      <ScrollAnimation animation="slideLeft" once={false}>
        <div className="bg-[var(--color-white)] rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 border-b-2 border-[var(--color-primary)] pb-2">
          الأكثر قراءة
        </h3>
        {trendingPosts && trendingPosts.length > 0 ? (
          <StaggerContainer className="space-y-4" staggerDelay={0.1} once={false}>
            {trendingPosts.slice(0, 5).map((post: Post, index: number) => (
              <StaggerItem key={post.id}>
                <Link 
                  to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                  className="flex gap-3 group cursor-pointer"
                >
                  <span className="flex-shrink-0 w-8 h-8 bg-[var(--color-primary)] text-[var(--color-text-light)] rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <span className="text-xs text-[var(--color-text-secondary)] mt-1 block">
                      {new Date(post.publishedAt).toLocaleDateString("ar-KW", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <p className="text-sm text-[var(--color-text-secondary)]">لا توجد مقالات متاحة حاليًا.</p>
        )}
        </div>
      </ScrollAnimation>
    </aside>
  );
}
