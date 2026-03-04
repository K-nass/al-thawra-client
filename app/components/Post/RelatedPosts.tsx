import type { ReactNode } from "react";

interface RelatedPostsProps {
  children: ReactNode;
  title?: string;
}

export function RelatedPosts({
  children,
  title = "مقالات ذات صلة",
}: RelatedPostsProps) {
  return (
    <div>
      <h2>
        {title}
      </h2>
      <div>
        {children}
      </div>
    </div>
  );
}
