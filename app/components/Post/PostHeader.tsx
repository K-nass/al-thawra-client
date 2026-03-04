import { MessageCircle, User } from "lucide-react";

interface PostHeaderProps {
  category: string;
  categoryHref?: string;
  title: string;
  date: string;
  commentsCount: number;
  authorName?: string;
  authorHref?: string;
}

export function PostHeader({
  category,
  categoryHref = "#",
  title,
  date,
  commentsCount,
  authorName,
  authorHref,
}: PostHeaderProps) {
  return (
    <div className="mb-6">
      {/* Category Badge */}
      <a
        href={categoryHref}
        className="inline-block text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors mb-3"
      >
        {category}
      </a>
      
      {/* Article Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {title}
      </h1>
      
      {/* Meta Information with dashed border separator */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 pb-4 mb-4 border-b border-dashed border-black/10">
        <span>{date}</span>
        
        {authorName && (
          <>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {authorHref ? (
                <a
                  href={authorHref}
                  className="hover:text-gray-900 transition-colors"
                >
                  {authorName}
                </a>
              ) : (
                <span>{authorName}</span>
              )}
            </div>
          </>
        )}
        
        <span className="text-gray-400">•</span>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          <span>{commentsCount} تعليق</span>
        </div>
      </div>
    </div>
  );
}
