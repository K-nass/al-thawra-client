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
    <div className="max-w-7xl mx-auto px-4 py-12 border-t border-dashed border-black/10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {title}
      </h2>
      
      <div>
        {children}
      </div>
    </div>
  );
}
