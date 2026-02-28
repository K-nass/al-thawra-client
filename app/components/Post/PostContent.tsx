interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  return (
    <div 
      className="max-w-none my-8 prose prose-lg"
      style={{ color: "var(--color-text-primary)" }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
