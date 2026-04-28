import { Link } from "react-router";
import type { Post } from "../services/postsService";
import ArticleImage from "../components/ArticleImage";
import { cleanPlainText } from "~/utils/arabicTextUtils";
import ColoredTitle from "~/components/ColoredTitle";
import { buildArticlePath } from "~/lib/articleRoutes";

interface CategoryWithPosts {
  category: {
    name: string;
  };
  posts: Post[];
}

interface BalancedColumnsLayoutProps {
  categoryData: CategoryWithPosts;
}

export default function BalancedColumnsLayout({ categoryData }: BalancedColumnsLayoutProps) {
  const { category, posts } = categoryData;

  return (
    <div>
      {/* Top section: 3 columns layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-2 mb-6">
        {/* Left column - smaller articles */}
        {/* space-y-6 md:space-y-10 */}
        <div className="md:col-span-3  flex flex-col ">
          {posts.slice(0, 3).map((post, index) => (
            <Link
              key={post.id}
              to={buildArticlePath(post)}
              className="block group"
            >
              <article className={` ${index < 2 ? ' border-b border-dashed border-black/10' : ''}`}>
                <div className="p-3 md:mb-16">
                  <ColoredTitle
                    title={post.title}
                    coloredWordsCount={0}
                    className="text-md font-bold mb-2 hover:text-blue-700 transition-colors"
                  />
                  {post.summary && (
                    <p className="text-xs text-gray-700 line-clamp-3 min-h-[3rem]">
                      {cleanPlainText(post.summary)}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Center - main featured article with image */}
        {posts[3] && (
          <div className="md:col-span-6 md:border-dashed md:border-black/10 flex justify-center">
            <Link
              to={buildArticlePath(posts[3])}
              className="block group w-full max-w-lg"
            >
              <article className="semafor-card overflow-hidden h-full flex flex-col">
                <div className="p-4">
                  <ColoredTitle
                    title={posts[3].title}
                    coloredWordsCount={0}
                    className="text-xl md:text-2xl font-bold mb-3 hover:text-blue-700 transition-colors text-center"
                  />
                  {posts[3].summary && (
                    <p className="text-sm md:text-base text-gray-700 line-clamp-2 text-center">
                      {cleanPlainText(posts[3].summary)}
                    </p>
                  )}
                </div>
                <div className="w-full px-6 pb-6 flex justify-center">
                  <div className="w-full aspect-4/3 overflow-hidden">
                    <ArticleImage
                      src={posts[3].image}
                      alt={posts[3].title}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </article>
            </Link>
          </div>
        )}

        {/* Right column - smaller articles */}
        <div className="md:col-span-3  flex flex-col ">
          {posts.slice(4, 7).map((post, index) => (
            <Link
              key={post.id}
              to={buildArticlePath(post)}
              className="block group"
            >
              <article className={` ${index < 2 ? ' border-b border-dashed border-black/10' : ''}`}>
                <div className="p-3 md:mb-16">
                  <ColoredTitle
                    title={post.title}
                    coloredWordsCount={0}
                    className="text-md font-bold mb-2 hover:text-blue-700 transition-colors"
                  />
                  {post.summary && (
                    <p className="text-xs text-gray-700 line-clamp-3 min-h-[3rem]">
                      {cleanPlainText(post.summary)}
                    </p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom section: 4 articles in a row */}
      <div className="grid grid-cols-1 md:grid-cols-4  border-t border-dashed border-black/10 ">
        {posts.slice(7, 11).map((post, index) => (
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
    </div>
  );
}
