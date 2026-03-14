import { Link } from "react-router";
import type { Post } from "../services/postsService";

interface CategoryWithPosts {
  category: {
    name: string;
  };
  posts: Post[];
}

interface Layout7Props {
  categoryData: CategoryWithPosts;
  showAdvertisement?: boolean;
  advertisementImage?: string;
}

export default function Layout7({ categoryData, showAdvertisement = false, advertisementImage }: Layout7Props) {
  const { posts } = categoryData;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {posts.slice(0, 3).map((post, index) => (
          <Link
            key={post.id}
            to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
            className="block group"
          >
            <article className={`semafor-card overflow-hidden flex flex-col h-full pl-4 pr-4 ${index < 3 ? 'border-l border-dashed border-black/10' : ''}`}>
              <div className="p-4 flex-1">
                <h3 className={`font-bold mb-3 group-hover:text-blue-700 transition-colors line-clamp-2 ${index === 2 ? 'text-blue-800 text-base' : 'text-base'}`}>
                  {post.title}
                </h3>
                {post.description && (
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {post.description.split(" ").slice(0, 20).join(" ")}
                  </p>
                )}
              </div>
              {post.image && (
                <div className="w-full aspect-square overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
            </article>
          </Link>
        ))}
      </div>

      {/* Advertisement Banner at the end */}
      {showAdvertisement && (
        <div className="w-full mt-6 border border-dashed border-black/10 overflow-hidden">
          {advertisementImage ? (
            <img
              src={advertisementImage}
              alt="Advertisement"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full bg-[#d0e8f2] py-12 flex items-center justify-center">
              <span className="text-gray-500 text-sm font-semibold tracking-wider">AD</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
