interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="max-w-none my-8">
      <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: "var(--color-text-primary)" }}>
        {content}
      </p>
    </div>
  );
}
