/**
 * Image Lazy Loading Utility
 * Provides consistent lazy loading attributes for images
 */

export interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // For above-the-fold images
}

/**
 * Get lazy loading attributes for an image
 */
export function getLazyImageProps(props: LazyImageProps) {
  const { src, alt, className, width, height, priority = false } = props;

  return {
    src,
    alt,
    className,
    ...(width && { width }),
    ...(height && { height }),
    loading: priority ? ("eager" as const) : ("lazy" as const),
    decoding: "async" as const,
  };
}

/**
 * Check if image should be lazy loaded
 * Above-the-fold images should not be lazy loaded
 */
export function shouldLazyLoad(index: number, threshold = 3): boolean {
  return index >= threshold;
}
