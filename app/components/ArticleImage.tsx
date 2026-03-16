import { useState } from "react";
import ArticleImageFallback from "./ArticleImageFallback";

interface ArticleImageProps {
  src?: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  fit?: "cover" | "contain";
  imgClassName?: string;
  aspectRatio?: string;
}

export default function ArticleImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  fit = "cover",
  imgClassName = "",
  aspectRatio,
}: ArticleImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const wrapperStyle = aspectRatio ? { aspectRatio } : undefined;

  // If no src provided or error occurred, show fallback
  if (!src || hasError) {
    return (
      <div className={`relative ${className}`} style={wrapperStyle}>
        <ArticleImageFallback className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={wrapperStyle}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        // `block` removes the baseline gap that can look like padding under images.
        className={`block w-full h-full ${fit === "contain" ? "object-contain" : "object-cover"} ${imgClassName}`}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0">
          <ArticleImageFallback className="w-full h-full" />
        </div>
      )}
    </div>
  );
}
