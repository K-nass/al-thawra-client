import { MessageCircle } from "lucide-react";

interface PostHeaderProps {
  category: string;
  categoryHref?: string;
  title: string;
}

interface PostMetaProps {
  date: string;
  commentsCount: number;
  authorName?: string;
  authorHref?: string;
  title?: string;
}

export function PostHeader({
  category,
  categoryHref = "#",
  title,
}: PostHeaderProps) {
  return (
    <div className="mb-4">
      {/* Category Badge */}
      <a
        href={categoryHref}
        className="inline-block text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors mb-3"
      >
        {category}
      </a>

      {/* Article Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight font-serif">
        {title}
      </h1>
    </div>
  );
}

export function PostMeta({
  date,
  commentsCount,
  authorName,
  authorHref,
}: PostMetaProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 py-4 mb-4">
      {/* Left: date + author + comments */}
      <div className="flex flex-wrap items-center gap-3">
        <span>{date}</span>

        {authorName && (
          <>
            <span className="text-gray-300">|</span>
            <span className="font-serif italic text-gray-700">
              —{" "}
              {authorHref ? (
                <a href={authorHref} className="underline hover:text-gray-900 transition-colors">
                  {authorName}
                </a>
              ) : (
                <span className="underline">{authorName}</span>
              )}
            </span>
          </>
        )}

        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{commentsCount} تعليق</span>
        </div>
      </div>
    </div>
  );
}
