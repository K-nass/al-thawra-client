import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "./PostCard";

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
    : `/posts/categories/${currentPost.categorySlug}/articles/${currentPost.slug}`;

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
    <div className="relative w-full h-[450px] rounded-3xl overflow-hidden shadow-lg bg-gray-900">
      {/* Background Image with Crossfade */}
      <div className="absolute inset-0">
        {posts.map((post, index) => (
          <div
            key={post.id || index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-900 to-purple-900" />
            )}
          </div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <div className="max-w-3xl">
          {/* Category Badge */}
          {currentPost.categoryName && (
            <div
              className={`inline-block px-4 py-1.5 mb-3 text-sm font-bold bg-red-600 text-white rounded transition-opacity duration-500 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              {currentPost.categoryName}
            </div>
          )}

          {/* Title */}
          <Link to={linkHref}>
            <h2
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 line-clamp-2 hover:text-gray-200 transition-all duration-500 ${
                isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              }`}
            >
              {currentPost.title}
            </h2>
          </Link>

          {/* Date */}
          <time
            className={`text-gray-300 text-sm transition-opacity duration-500 ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {new Date(currentPost.publishedAt || currentPost.createdAt).toLocaleDateString("ar-EG", {
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
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 border border-white/20 z-10"
        aria-label="السابق"
      >
        <ChevronRight className="w-5 h-5 text-white/90" />
      </button>

      <button
        onClick={handleNext}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 border border-white/20 z-10"
        aria-label="التالي"
      >
        <ChevronLeft className="w-5 h-5 text-white/90" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isTransitioning) return;
              setIsTransitioning(true);
              setCurrentIndex(index);
              setTimeout(() => setIsTransitioning(false), 500);
            }}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-8 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`الانتقال إلى الشريحة ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
