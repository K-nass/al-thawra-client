import { cleanHtml } from "../../utils/htmlCleaner";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  const cleanedContent = cleanHtml(content);

  return (
    <div
      className="max-w-none my-8 prose prose-lg"
      style={{ color: "var(--color-text-primary)" }}
      dangerouslySetInnerHTML={{ __html: cleanedContent }}
    />
  );
}
