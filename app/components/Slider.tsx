import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "./PostCard";
import { buildArticlePath } from "~/lib/articleRoutes";

interface SliderProps {
  posts: Post[];
  buildLink?: (post: Post) => string;
}

export function Slider({ posts, buildLink }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, posts.length]);

  if (!posts || posts.length === 0) {
    return null;
  }

  const currentPost = posts[currentIndex];
  const linkHref = buildLink
    ? buildLink(currentPost)
    : buildArticlePath(currentPost);

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % posts.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  return (
    <div>
      {/* Background Image with Crossfade */}
      <div>
        {posts.map((post, index) => (
          <div
            key={post.id || index}
          >
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                loading={index === 0 ? "eager" : "lazy"}
              />
            ) : (
              <div />
            )}
          </div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div />

      {/* Content */}
      <div>
        <div>
          {/* Category Badge */}
          {currentPost.categoryName && (
            <div
            >
              {currentPost.categoryName}
            </div>
          )}

          {/* Title */}
          <Link to={linkHref}>
            <h2
            >
              {currentPost.title}
            </h2>
          </Link>

          {/* Date */}
          <time
          >
            {new Date(currentPost.publishedAt || currentPost.createdAt).toLocaleDateString("ar-u-nu-latn", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </div>

      {/* Navigation Arrows - Subtle and Easy on Eyes */}
      <button
        onClick={handlePrev}
        aria-label="السابق"
      >
        <ChevronRight />
      </button>

      <button
        onClick={handleNext}
        aria-label="التالي"
      >
        <ChevronLeft />
      </button>

      {/* Dot Indicators */}
      <div>
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isTransitioning) return;
              setIsTransitioning(true);
              setCurrentIndex(index);
              setTimeout(() => setIsTransitioning(false), 500);
            }}
            aria-label={`الانتقال إلى الشريحة ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
