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
    <div>
      <a
        className="text-sm font-bold hover:underline transition-colors"
        href={categoryHref}
        style={{ color: "var(--color-primary)" }}
      >
        {category}
      </a>
      <h1 className="text-4xl font-black my-4" style={{ color: "var(--color-text-primary)" }}>
        {title}
      </h1>
      <div className="flex items-center space-x space-x-4 text-base mb-6 flex-row flex-wrap gap-3 font-semibold" style={{ color: "var(--color-text-primary)" }}>
        <span>{date}</span>
        {authorName && (
          <>
            <span className="w-px h-5" style={{ backgroundColor: "var(--color-text-secondary)", opacity: 0.4 }}></span>
            <div className="flex items-center flex-row gap-1">
              <User className="w-5 h-5" />
              {authorHref ? (
                <a
                  href={authorHref}
                  className="hover:underline transition-colors hover:text-(--color-primary)"
                  style={{ color: "inherit" }}
                >
                  {authorName}
                </a>
              ) : (
                <span>{authorName}</span>
              )}
            </div>
          </>
        )}
        <span className="w-px h-5" style={{ backgroundColor: "var(--color-text-secondary)", opacity: 0.4 }}></span>
        <div className="flex items-center flex-row gap-1">
          <MessageCircle className="w-5 h-5" />
          <span>{commentsCount} تعليق</span>
        </div>
      </div>
    </div>
  );
}
