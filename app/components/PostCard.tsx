import { Link } from "react-router";
import type { Post } from "../services/postsService";

export type { Post };

interface PostCardProps {
  post: Post;
  buildLink?: (post: Post) => string;
  variant?: 'standard' | 'featured';
}

export function PostCard({ post, buildLink, variant = 'standard' }: PostCardProps) {
  const displayDate = post.publishedAt || post.createdAt;
  const formattedDate = new Date(displayDate).toLocaleDateString("ar-u-nu-latn", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const linkHref = buildLink
    ? buildLink(post)
    : `/posts/categories/${post.categorySlug}/articles/${post.slug}`;

  const isFeatured = variant === 'featured';

  return (
    <article className={`relative group ${isFeatured ? 'h-full' : 'h-full flex flex-col'}`}>
      <Link to={linkHref} className="block">
        {post.image && post.image !== "null" && post.image !== "undefined" ? (
          <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[4/3] mb-4' : 'aspect-[4/3] mb-3'}`}>
            <img
              src={post.image}
              alt={post.imageDescription || post.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className={`flex items-center justify-center bg-gray-200/50 ${isFeatured ? 'aspect-[4/3] mb-4' : 'aspect-[4/3] mb-3'}`}>
            <span className="text-gray-500 text-sm">لا توجد صورة</span>
          </div>
        )}
      </Link>

      <div className={`flex-1 flex flex-col ${isFeatured ? '' : ''}`}>
        {post.categoryName && (
          <Link 
            to={`/category/${post.categorySlug}`}
            className={`inline-block font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2 ${isFeatured ? 'text-sm' : 'text-xs'}`}
          >
            {post.categoryName}
          </Link>
        )}

        <Link to={linkHref} className="block group mb-2">
          <h3 className={`font-bold leading-tight text-gray-900 group-hover:text-blue-600 transition-colors ${isFeatured ? 'text-xl md:text-2xl' : 'text-base md:text-lg line-clamp-3'}`}>
            {post.title}
          </h3>
        </Link>

        <p className={`text-gray-700 leading-relaxed mb-3 ${isFeatured ? 'text-sm line-clamp-3' : 'text-sm line-clamp-2'}`}>
          {post.imageDescription || post.title}
        </p>

        <div className="mt-auto">
          <time 
            dateTime={displayDate}
            className="text-gray-500 text-xs block mb-2"
          >
            {formattedDate}
          </time>

          {post.authorName && (
            <Link 
              to={`/author/${post.authorName}`}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {post.authorImage && (
                <img
                  src={post.authorImage}
                  alt={post.authorName}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <span className="text-xs font-medium">
                {post.authorName}
              </span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
