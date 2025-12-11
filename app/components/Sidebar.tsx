import { Link } from "react-router";
import type { Post } from "../services/postsService";
import type { ChiefEditor } from "../services/userService";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "./ScrollAnimation";
import { Image, User } from "lucide-react";

interface SidebarProps {
  trendingPosts: Post[];
  chiefEditor: ChiefEditor | null;
  chiefEditorPosts: Post[];
}
export function Sidebar({ trendingPosts, chiefEditor, chiefEditorPosts }: SidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Editor's Article Section - Only show if we have chief editor data */}
      {/* Editor's Article Section - Only show if we have chief editor data */}
      {chiefEditor && chiefEditorPosts.length > 0 && (
        <ScrollAnimation animation="slideLeft" once={false}>
          <div className="bg-[var(--color-white)] rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-1">
              مقالات رئيس التحرير
            </h3>
            <span className="flex items-center gap-3 mb-6 border-b-2 border-[var(--color-primary)] pb-4 w-fit pr-2">
              {chiefEditor.avatarUrl ? (
                <img
                  src={chiefEditor.avatarUrl}
                  alt={chiefEditor.slug || ""}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                />
              ) : (
                 <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <User className="w-8 h-8" />
                 </div>
              )}
              <span className="text-xl font-bold text-[var(--color-primary)]">
                {chiefEditor.fullName}
              </span>
            </span>

            {/* Featured post (first one) */}
            <Link
              to={`/posts/categories/${chiefEditorPosts[0].categorySlug}/articles/${chiefEditorPosts[0].slug}`}
              className="group block"
            >
              <div className="relative aspect-video mb-3 overflow-hidden rounded-md bg-gray-100">
                {chiefEditorPosts[0].image ? (
                  <img
                    src={chiefEditorPosts[0].image}
                    alt={chiefEditorPosts[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Image className="w-12 h-12" />
                  </div>
                )}
              </div>
              <h4 className="text-lg font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                {chiefEditorPosts[0].title}
              </h4>
              <p className="text-sm text-[var(--color-text-secondary)] mt-2 line-clamp-3">
                {chiefEditorPosts[0].description.slice(0, 50) + '...'}
              </p>
            </Link>

            {/* Additional posts as numbered list */}
            {chiefEditorPosts.length > 1 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                 <div className="space-y-4">
                  {chiefEditorPosts.slice(1, 6).map((post, index) => (
                    <Link
                      key={post.id}
                      to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                      className="flex gap-3 group cursor-pointer"
                    >
                      <span className="flex-shrink-0 w-8 h-8 bg-gray-100 text-[var(--color-text-secondary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                 </div>
                {chiefEditor.slug && (
                  <Link
                    to={`/writers-opinions/${chiefEditor.slug}`}
                    className="block text-sm font-bold text-[var(--color-primary)] hover:underline mt-4 text-center"
                  >
                    عرض الكل ←
                  </Link>
                )}
              </div>
            )}
          </div>
        </ScrollAnimation>
      )}

      {/* Trending Posts Section */}
      <ScrollAnimation animation="slideLeft" once={false}>
        <div className="bg-[var(--color-white)] rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 border-b-2 border-[var(--color-primary)] pb-2">
            الأكثر قراءة
          </h3>
          {trendingPosts && trendingPosts.length > 0 ? (
            <>
              <StaggerContainer className="space-y-4" staggerDelay={0.1} once={false}>
                {trendingPosts.slice(0, 5).map((post: Post, index: number) => (
                  <StaggerItem key={post.id}>
                    <Link
                      to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                      className="flex gap-3 group cursor-pointer"
                    >
                      <span className="flex-shrink-0 w-8 h-8 bg-gray-100 text-[var(--color-text-secondary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              <Link
                to="/search"
                className="block text-sm font-bold text-[var(--color-primary)] hover:underline mt-4 text-center"
              >
                عرض الكل ←
              </Link>
            </>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">لا توجد مقالات متاحة حاليًا.</p>
          )}
        </div>
      </ScrollAnimation>
    </aside>
  );
}
