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
    <figure className="mb-6">
      <img
        src={src!}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
        className="w-full h-auto"
      />
      {description && (
        <figcaption className="text-xs text-gray-500 mt-2 italic">
          {description}
        </figcaption>
      )}
    </figure>
  );
}
