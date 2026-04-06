import { Link } from "react-router";
import type { Post } from "../services/postsService";
import ArticleImage from "../components/ArticleImage";
import { cleanPlainText } from "~/utils/arabicTextUtils";
import ColoredTitle from "~/components/ColoredTitle";

interface Layout11Props {
  posts: Post[];
}

export default function Layout11({ posts }: Layout11Props) {
  // Handle empty or undefined posts
  const safePosts = posts || [];

  // Empty state
  if (safePosts.length === 0) {
    return null;
  }

  // Get first post for left column (text only)
  const leftPost = safePosts[0];
  
  // Get second post for right column (image only)
  const rightPost = safePosts[2];
  
  // Get posts 3-6 for second row
  const secondRowPosts = safePosts.slice(2, 6);

  return (
    <div className="w-full">
      {/* Top row - two columns: left (text only), right (image only) */}
      <div className="flex justify-center mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full px-4">
          {/* Left column - Text only with background */}
          {leftPost && (
            <Link
              to={`/posts/categories/${leftPost.categorySlug}/articles/${leftPost.slug}`}
              className="block group"
            >
              <article className="semafor-card overflow-hidden flex flex-col h-full hover:bg-[#b8d4e0] transition-colors duration-300">
                <div className="p-6 flex items-center justify-center h-full">
                  <div className="text-center">
                    <ColoredTitle
                      title={leftPost.title}
                      coloredWordsCount={0}
                      className="text-2xl font-bold mb-4 hover:text-blue-700 transition-colors leading-tight"
                    />
                    {leftPost.summary && (
                      <p className="text-base text-gray-700 line-clamp-2 leading-relaxed">
                    {cleanPlainText(leftPost.summary)}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* Right column - Image only */}
          {rightPost && (
            <Link
              to={`/posts/categories/${rightPost.categorySlug}/articles/${rightPost.slug}`}
              className="block group"
            >
              <article className="semafor-card overflow-hidden h-full px-6 pb-6 mt-auto">
                <div className="w-full h-full aspect-[3/2] overflow-hidden">
                  <ArticleImage
                    src={rightPost.image}
                    alt={rightPost.title}
                    className="w-full h-full"
                  />
                </div>
              </article>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom row - four smaller articles */}
      {secondRowPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-dashed border-black/10 pt-6">
          {secondRowPosts.map((post, index) => (
            <Link
              key={post.id}
              to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
              className="block group h-full"
            >
              <article className={`semafor-card p-3 h-full flex flex-col ${index < 3 ? 'border-l border-dashed border-black/10' : ''}`}>
                <ColoredTitle
                  title={post.title}
                  coloredWordsCount={0}
                  className="text-sm font-bold mb-4 hover:text-blue-700 transition-colors"
                />
                {post.summary && (
                  <p className="text-xs text-gray-700 line-clamp-2 mt-auto">
                    {cleanPlainText(post.summary)}
                  </p>
                )}
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
