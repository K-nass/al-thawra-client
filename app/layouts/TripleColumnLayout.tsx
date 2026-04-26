import { Link } from "react-router";
import type { Post } from "../services/postsService";
import ArticleImage from "../components/ArticleImage";
import { cleanPlainText } from "~/utils/arabicTextUtils";
import ColoredTitle from "~/components/ColoredTitle";

interface CategoryWithPosts {
  category: {
    name: string;
  };
  posts: Post[];
}

interface TripleColumnLayoutProps {
  categoryData: CategoryWithPosts;
  showAdvertisement?: boolean;
  advertisementImage?: string;
}

export default function TripleColumnLayout({ categoryData, showAdvertisement = false, advertisementImage }: TripleColumnLayoutProps) {
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
            <article className={`semafor-card overflow-hidden flex flex-col h-full pl-4 pr-4 ${index < 2 ? 'border-l border-dashed border-black/10' : ''}`}>
              <div className="p-4 flex-1">
                <ColoredTitle
                  title={post.title}
                  coloredWordsCount={0}
                  className="font-bold mb-3 hover:text-blue-700 transition-colors"
                />
                {post.summary && (
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {cleanPlainText(post.summary).split(" ").slice(0, 20).join(" ")}
                  </p>
                )}
              </div>
              <div className="w-full aspect-square overflow-hidden">
                <ArticleImage
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full"
                />
              </div>
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
