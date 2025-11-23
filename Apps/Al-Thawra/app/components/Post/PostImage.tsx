interface PostImageProps {
  src: string;
  alt: string;
  description?: string;
}

export function PostImage({ src, alt, description }: PostImageProps) {
  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt}
        className="w-full rounded-lg shadow-md"
        loading="lazy"
        decoding="async"
      />
      {description && (
        <figcaption className="mt-2 text-sm text-[var(--color-text-secondary)] text-center">
          {description}
        </figcaption>
      )}
    </figure>
  );
}
