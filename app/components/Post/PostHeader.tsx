import { MessageCircle } from "lucide-react";

interface PostHeaderProps {
  category: string;
  categoryHref?: string;
  title: string;
  date: string;
  commentsCount: number;
}

export function PostHeader({
  category,
  categoryHref = "#",
  title,
  date,
  commentsCount,
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
      <div className="flex items-center space-x space-x-4 text-sm mb-6 flex-row" style={{ color: "var(--color-text-secondary)" }}>
        <span>{date}</span>
        <span className="w-px h-4" style={{ backgroundColor: "var(--color-text-secondary)", opacity: 0.3 }}></span>
        <div className="flex items-center flex-row">
          <span className="material-symbols-outlined text-base ml-1">
           <MessageCircle />
          </span>
          <span>{commentsCount} تعليق</span>
        </div>
      </div>
    </div>
  );
}
