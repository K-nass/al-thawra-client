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
      <div>
        <div>📝</div>
        <h3>
          لا توجد مقالات
        </h3>
        <p>
          لم يقم {authorName} بنشر أي مقالات بعد
        </p>
      </div>
    );
  }

  return (
    <div>
      {categoryGroups.map((group) => (
        <div key={group.categorySlug}>
          {/* Category Header */}
          <div>
            <h2>
              {group.categorySlug}
            </h2>
            <span>
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
