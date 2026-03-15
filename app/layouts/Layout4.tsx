import { Link } from "react-router";
import type { Post } from "../services/postsService";

interface CategoryWithPosts {
  category: {
    name: string;
  };
  posts: Post[];
}

interface Layout4Props {
  categoryData: CategoryWithPosts;
}

export default function Layout4({ categoryData }: Layout4Props) {
  const { category, posts } = categoryData;

  return (
    <div>
      {/* Top section: 3 columns layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 mb-6">
        {/* Left column - smaller articles */}
        <div className="md:col-span-3 space-y-6 md:space-y-10 pr-2 md:pr-4 flex flex-col justify-between">
          {posts.slice(0, 3).map((post, index) => (
            <Link
              key={post.id}
              to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
              className="block group"
            >
              <article className={`semafor-card overflow-hidden ${index < 2 ? 'pb-6 border-b border-dashed border-black/10' : ''}`}>
                <div className="p-3">
                  <h3 className="text-md font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {post.description.split(" ").slice(0, 15).join(" ")}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Center - main featured article with image */}
        {posts[3] && (
          <div className="md:col-span-6 md:border-dashed md:border-black/10 px-4 flex justify-center">
            <Link
              to={`/posts/categories/${posts[3].categorySlug}/articles/${posts[3].slug}`}
              className="block group w-full max-w-lg"
            >
              <article className="semafor-card overflow-hidden h-full flex flex-col">
                <div className="p-4 mb-4">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-blue-700 transition-colors text-center">
                    {posts[3].title}
                  </h3>
                  {posts[3].description && (
                    <p className="text-sm md:text-base text-gray-700 line-clamp-2 text-center">
                      {posts[3].description}
                    </p>
                  )}
                </div>
                {posts[3].image && (
                  <div className="w-full px-6 pb-6 flex justify-center mt-auto">
                    <div className="w-full aspect-[4/3] overflow-hidden">
                      <img
                        src={posts[3].image}
                        alt={posts[3].title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </article>
            </Link>
          </div>
        )}

        {/* Right column - smaller articles */}
        <div className="md:col-span-3 space-y-6 md:space-y-10 pl-2 md:pl-4 flex flex-col justify-between">
          {posts.slice(4, 7).map((post, index) => (
            <Link
              key={post.id}
              to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
              className="block group"
            >
              <article className={`semafor-card overflow-hidden ${index < 2 ? 'pb-6 border-b border-dashed border-black/10' : ''}`}>
                <div className="p-3">
                  <h3 className="text-md font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-3">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-xs text-gray-700 line-clamp-2">
                      {post.description.split(" ").slice(0, 15).join(" ")}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom section: 4 articles in a row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-dashed border-black/10 pt-6">
        {posts.slice(7, 11).map((post, index) => (
          <Link
            key={post.id}
            to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
            className="block group"
          >
            <article className={`semafor-card p-4 ${index < 3 ? 'border-l border-dashed border-black/10' : ''}`}>
              <h3 className="text-md font-bold mb-2 group-hover:text-blue-700 transition-colors line-clamp-3">
                {post.title}
              </h3>
              {post.description && (
                <p className="text-xs text-gray-700 line-clamp-2">
                  {post.description.split(" ").slice(0, 15).join(" ")}
                </p>
              )}
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

