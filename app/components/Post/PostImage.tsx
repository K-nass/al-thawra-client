import { useState } from "react";

interface PostImageProps {
  src: string | null | undefined;
  alt: string;
  description?: string;
}

export function PostImage({ src, alt, description }: PostImageProps) {
  const [hasError, setHasError] = useState(false);

  // Helper to check if src is a "wrong" value from backend
  const isValidSrc = src &&
    src !== "null" &&
    src !== "undefined" &&
    src.trim() !== "";

  if (!isValidSrc || hasError) {
    return null;
  }

  return (
    <figure className="my-6">
      <img
        src={src!}
        alt={alt}
        className="w-full rounded-lg shadow-md"
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
      />
      {description && (
        <figcaption className="mt-2 text-sm text-[var(--color-text-secondary)] text-center">
          {description}
        </figcaption>
      )}
    </figure>
  );
}
