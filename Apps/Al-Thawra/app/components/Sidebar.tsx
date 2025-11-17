import { Link } from "react-router";
import type { Post } from "../services/postsService";

export function Sidebar({ trendingPosts }: { trendingPosts: Post[] }) {
  return (
    <aside className="space-y-6">
      {/* Trending Posts Section */}
      <div className="bg-[var(--color-white)] rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 border-b-2 border-[var(--color-primary)] pb-2">
          الأكثر قراءة
        </h3>
        {trendingPosts && trendingPosts.length > 0 ? (
          <ul className="space-y-4">
            {trendingPosts.slice(0, 5).map((post: Post, index: number) => (
              <li key={post.id}>
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
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--color-text-secondary)]">لا توجد مقالات متاحة حاليًا.</p>
        )}
      </div>
    </aside>
  );
}
