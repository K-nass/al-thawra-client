import { Link } from "react-router";
import type { Post } from "../services/postsService";

export type { Post };

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const displayDate = post.publishedAt || post.createdAt;
  const formattedDate = new Date(displayDate).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <Link to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`} className="block relative aspect-16/10 overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">لا توجد صورة</span>
          </div>
        )}
        
        {/* Share Icon */}
        <button
          className="absolute top-3 left-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors"
          onClick={(e) => {
            e.preventDefault();
            // Share functionality
            if (navigator.share) {
              navigator.share({
                title: post.title,
                url: window.location.origin + `/posts/categories/${post.categorySlug}/articles/${post.slug}`,
              });
            }
          }}
        >
          <svg
            className="w-4 h-4 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        {post.categoryName && (
          <Link
            to={`/category/${post.categorySlug}`}
            className="inline-block mb-2 text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
          >
            {post.categoryName}
          </Link>
        )}

        {/* Title */}
        <Link to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
            {post.title}
          </h3>
        </Link>

        {/* Date */}
        <time className="text-sm text-gray-500" dateTime={displayDate}>
          {formattedDate}
        </time>

        {/* author name */}
        {post.authorName && (
          <Link
            to={`/author/${post.authorName}`}
            className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 group/author hover:bg-gray-50 -mx-4 px-4 py-2 transition-colors"
          >
            <img 
              src={post.authorImage} 
              alt={post.authorName} 
              className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-1 ring-gray-200" 
            />
            <span className="text-xs font-semibold text-gray-700 group-hover/author:text-[var(--color-primary)] transition-colors truncate">
              {post.authorName}
            </span>
          </Link>
        )}

      </div>
    </article>
  );
}
