import { PostCard, type Post } from "./PostCard";

interface PostsGridProps {
  posts: Post[];
  categoryName?: string;
  showCategoryHeader?: boolean;
}

export function PostsGrid({
  posts,
  categoryName,
  showCategoryHeader = true,
}: PostsGridProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لا توجد مقالات</p>
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* Category Header */}
      {showCategoryHeader && categoryName && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1"></div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900">{categoryName}</h2>
            <button
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="عرض المزيد"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
