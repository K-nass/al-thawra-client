import { Link } from "react-router";
import type { Post } from "../services/postsService";
import ArticleImage from "../components/ArticleImage";

interface CategoryWithPosts {
  category: {
    name: string;
  };
  posts: Post[];
}

interface Layout5Props {
  categoryData: CategoryWithPosts;
}

export default function Layout5({ categoryData }: Layout5Props) {
  const { category, posts } = categoryData;

  // Handle empty or undefined posts
  const safePosts = posts || [];

  // Empty state
  if (safePosts.length === 0) {
    return null;
  }

  // Get first post for top featured article
  const featuredPost = safePosts[0];
  
  // Get posts 2-5 for bottom row
  const bottomRowPosts = safePosts.slice(1, 5);

  return (
    <div className="w-full">
      {/* Top - single featured article */}
      {featuredPost && (
        <div className="flex justify-center mb-6">
          <div className="max-w-5xl w-full px-4">
            <Link
              to={`/posts/categories/${featuredPost.categorySlug}/articles/${featuredPost.slug}`}
              className="block group"
            >
              <article className="semafor-card overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full px-6 pb-6 mt-auto flex items-center">
                    <div className="w-full aspect-[3/2] overflow-hidden">
                      <ArticleImage
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="p-6 flex items-center justify-center hover:bg-[#b8d4e0] transition-colors duration-300">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-700 transition-colors line-clamp-4 leading-tight">
                        {featuredPost.title}
                      </h3>
                      {featuredPost.summary && (
                        <p className="text-base text-gray-700 line-clamp-2 leading-relaxed">
                          {featuredPost.summary}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </div>
      )}

      {/* Bottom - 4 articles in a row */}
      {bottomRowPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-dashed border-black/10">
          {bottomRowPosts.map((post, index) => (
            <Link
              key={post.id}
              to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
              className="block group h-full"
            >
                <article className={`semafor-card p-4 h-full flex flex-col ${index < 3 ? 'border-l border-dashed border-black/10' : ''}`}>
                  <h3 className="text-md font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-3 min-h-[3.75rem]">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-700 line-clamp-2 min-h-[2rem]">
                    {post.summary || ""}
                  </p>
                </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
