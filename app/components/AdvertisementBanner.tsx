import { Link } from "react-router";
import ArticleImage from "./ArticleImage";
import { cleanPlainText } from "~/utils/arabicTextUtils";

interface AdvertisementBannerProps {
  category?: string;
  title: string;
  summary: string;
  image?: string;
  imageCredit?: string;
  link?: string;
}

export default function AdvertisementBanner({ 
  category, 
  title, 
  summary, 
  image, 
  imageCredit,
  link 
}: AdvertisementBannerProps) {  
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
          <p className="text-sm text-gray-600 leading-relaxed">
            {cleanPlainText(summary)}
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
