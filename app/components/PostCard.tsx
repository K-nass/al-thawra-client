import { Link } from "react-router";
import type { Post } from "../services/postsService";

export type { Post };

interface PostCardProps {
  post: Post;
  buildLink?: (post: Post) => string;
}

export function PostCard({ post, buildLink }: PostCardProps) {
  const displayDate = post.publishedAt || post.createdAt;
  const formattedDate = new Date(displayDate).toLocaleDateString("ar-u-nu-latn", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const linkHref = buildLink
    ? buildLink(post)
    : `/posts/categories/${post.categorySlug}/articles/${post.slug}`;

  return (
    <article>
      <Link to={linkHref}>
        {post.image && post.image !== "null" && post.image !== "undefined" ? (
          <div>
            <img
              src={post.image}
              alt={post.imageDescription || post.title}
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : (
          <div>
            <span>لا توجد صورة</span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            if (navigator.share) {
              navigator.share({
                title: post.title,
                url: window.location.origin + linkHref,
              });
            }
          }}
        >
          <svg
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

      <div>
        {post.categoryName && (
          <Link to={`/category/${post.categorySlug}`}>
            {post.categoryName}
          </Link>
        )}

        <Link to={linkHref}>
          <h3>
            {post.title}
          </h3>
        </Link>

        <time dateTime={displayDate}>
          {formattedDate}
        </time>

        {post.authorName && (
          <Link to={`/author/${post.authorName}`}>
            <img
              src={post.authorImage}
              alt={post.authorName}
            />
            <span>
              {post.authorName}
            </span>
          </Link>
        )}

      </div>
    </article>
  );
}
