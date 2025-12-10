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
    <div className="my-12">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text-primary)" }}>
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
}
