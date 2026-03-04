import { cleanHtml } from "../../utils/htmlCleaner";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  const cleanedContent = cleanHtml(content);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: cleanedContent }}
    />
  );
}
