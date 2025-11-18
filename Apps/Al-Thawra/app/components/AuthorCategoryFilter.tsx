import { useMemo } from "react";
import { PostsGrid } from "./PostsGrid";
import type { Post } from "./PostCard";

interface CategoryGroup {
  categorySlug: string;
  posts: Post[];
}

interface AuthorCategoryGroupProps {
  posts: Post[];
  authorName: string;
}

export function AuthorCategoryGroup({ posts, authorName }: AuthorCategoryGroupProps) {
  // Group posts by category
  const categoryGroups = useMemo(() => {
    const groups: Record<string, Post[]> = {};
    
    posts.forEach(post => {
      const categorySlug = post.categorySlug || 'uncategorized';
      if (!groups[categorySlug]) {
        groups[categorySlug] = [];
      }
      groups[categorySlug].push(post);
    });

    // Convert to array and sort by post count (descending)
    return Object.entries(groups)
      .map(([categorySlug, categoryPosts]) => ({
        categorySlug,
        posts: categoryPosts
      }))
      .sort((a, b) => b.posts.length - a.posts.length);
  }, [posts]);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-[var(--color-white)] border border-[var(--color-divider)] rounded-lg">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
          لا توجد مقالات
        </h3>
        <p className="text-[var(--color-text-secondary)]">
          لم يقم {authorName} بنشر أي مقالات بعد
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {categoryGroups.map((group) => (
        <div key={group.categorySlug} className="space-y-4">
          {/* Category Header */}
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              {group.categorySlug}
            </h2>
            <span className="text-sm text-[var(--color-text-secondary)] bg-[var(--color-background-light)] px-3 py-1 rounded-full">
              {group.posts.length} مقال
            </span>
          </div>
          
          {/* Posts Grid for this category */}
          <PostsGrid 
            posts={group.posts} 
            showCategoryHeader={false}
            postsPerPage={6}
          />
        </div>
      ))}
    </div>
  );
}
