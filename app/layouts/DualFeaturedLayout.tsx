import { Link } from "react-router";
import type { Post } from "../services/postsService";
import ArticleImage from "../components/ArticleImage";
import { cleanPlainText } from "~/utils/arabicTextUtils";
import ColoredTitle from "~/components/ColoredTitle";
import { buildArticlePath } from "~/lib/articleRoutes";

interface DualFeaturedLayoutProps {
  posts: Post[];
}

export default function DualFeaturedLayout({ posts }: DualFeaturedLayoutProps) {
  // Handle empty or undefined posts
  const safePosts = posts || [];

  // Empty state
  if (safePosts.length === 0) {
    return null;
  }

  // Get first 2 posts for first row
  const firstRowPosts = safePosts.slice(0, 2);
  
  // Get posts 3-6 for second row
  const secondRowPosts = safePosts.slice(2, 6);

  return (
    <div className="w-full">
      {/* Top row - two featured articles with images */}
      <div className="flex justify-center mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full px-4">
          {firstRowPosts.map((post, index) => (
            <Link
              key={post.id}
              to={buildArticlePath(post)}
              className="block group"
            >
              <article className="semafor-card overflow-hidden flex flex-col h-full">
                <div className="p-6 flex-grow">
                  <ColoredTitle
                    title={post.title}
                    coloredWordsCount={0}
                    className="text-2xl font-bold mb-4 hover:text-blue-700 transition-colors text-center leading-tight"
                  />
                  {post.summary && (
                    <p className="text-base text-gray-700 line-clamp-2 mb-6 text-center leading-relaxed">
                      {cleanPlainText(post.summary)}
                    </p>
                  )}
                </div>
                <div className="w-full flex justify-center px-6 pb-6 mt-auto">
                  <div className="w-full aspect-[3/2] overflow-hidden">
                    <ArticleImage
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom row - four smaller articles */}
      {secondRowPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-dashed border-black/10 pt-6">
          {secondRowPosts.map((post, index) => (
          <Link
            key={post.id}
            to={buildArticlePath(post)}
            className="block group h-full"
          >
            <article className={`semafor-card p-4 h-full flex flex-col ${index < 3 ? 'border-l border-dashed border-black/10' : ''}`}>
              <ColoredTitle
                title={post.title}
                coloredWordsCount={0}
                className="text-md font-bold mb-2 hover:text-blue-700 transition-colors"
              />
              <p className="text-xs text-gray-700 line-clamp-2">
                {cleanPlainText(post.summary) || ""}
              </p>
            </article>
          </Link>
          ))}
        </div>
      )}
    </div>
  );
}
