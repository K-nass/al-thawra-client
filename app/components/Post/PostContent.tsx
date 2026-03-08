import { cleanHtml } from "../../utils/htmlCleaner";
import { cleanArabicArticleContent } from "../../utils/arabicTextUtils";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  // Apply both general HTML cleaning and Arabic-specific cleaning
  const cleanedContent = cleanHtml(cleanArabicArticleContent(content));

  return (
    <div
      className="prose prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-4
        prose-p:text-gray-800 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base
        prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800
        prose-strong:text-gray-900 prose-strong:font-semibold
        prose-ul:list-disc prose-ul:mr-6 prose-ul:text-gray-800 prose-ul:mb-4
        prose-ol:list-decimal prose-ol:mr-6 prose-ol:text-gray-800 prose-ol:mb-4
        prose-li:mb-2
        prose-blockquote:border-r-2 prose-blockquote:border-gray-300 prose-blockquote:pr-4 prose-blockquote:italic prose-blockquote:text-gray-700"
      dangerouslySetInnerHTML={{ __html: cleanedContent }}
    />
  );
}
