import { Link } from "react-router";
import type { Post } from "../services/postsService";

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

  return (
    <div>
      <div className="space-y-6">
        {/* Top - single featured article */}
        {posts[0] && (
          <Link
            to={`/posts/categories/${posts[0].categorySlug}/articles/${posts[0].slug}`}
            className="block group"
          >
            <article className="semafor-card overflow-hidden border-b border-dashed border-black/10 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts[0].image && (
                  <div className="h-100 overflow-hidden">
                    <img
                      src={posts[0].image}
                      alt={posts[0].title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-700 transition-colors text-center md:w-100">
                    {posts[0].title}
                  </h3>
                  {posts[0].description && (
                    <p className="text-base text-gray-700 line-clamp-3 text-center">
                      {posts[0].description}
                    </p>
                  )}
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Bottom - 4 articles in a row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
          {posts.slice(1, 5).map((post, index) => (
            <Link
              key={post.id}
              to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
              className="block group"
            >
              <article className={`semafor-card p-4 ${index < 3 ? 'border-l border-dashed border-black/10' : ''}`}>
                <h3 className="text-sm font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.description && (
                  <p className="text-xs text-gray-700 line-clamp-2">
                    {post.description.split(" ").slice(0, 20).join(" ")}
                  </p>
                )}
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
