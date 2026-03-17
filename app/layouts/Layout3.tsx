import { Link } from "react-router";
import ArticleImage from "../components/ArticleImage";

interface Layout3Props {
  category?: string;
  title: string;
  summary: string;
  image?: string;
  imageCredit?: string;
  link?: string;
}

export default function Layout3({ 
  category, 
  title, 
  summary, 
  image, 
  imageCredit,
  link 
}: Layout3Props) {
  const content = (
    <div className="bg-[#b8d4e0] p-4">
      {/* Category Label */}
      {category && (
        <div className="text-center mb-3">
          <span className="text-xs uppercase tracking-wider text-gray-600 font-semibold">
            {category}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Text Content */}
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-serif text-gray-800 leading-tight">
            {title}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Image */}
        <div className="space-y-1">
          <div className="overflow-hidden">
            <ArticleImage
              src={image}
              alt={title}
              className="w-full aspect-video"
            />
          </div>
          {imageCredit && (
            <p className="text-xs text-gray-500 text-right">
              {imageCredit}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (link) {
    return (
      <Link to={link} className="block hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
