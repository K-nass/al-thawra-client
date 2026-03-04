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
        href={categoryHref}
      >
        {category}
      </a>
      <h1>
        {title}
      </h1>
      <div>
        <span>{date}</span>
        {authorName && (
          <>
            <span></span>
            <div>
              <User />
              {authorHref ? (
                <a
                  href={authorHref}
                >
                  {authorName}
                </a>
              ) : (
                <span>{authorName}</span>
              )}
            </div>
          </>
        )}
        <span></span>
        <div>
          <MessageCircle />
          <span>{commentsCount} تعليق</span>
        </div>
      </div>
    </div>
  );
}
