import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import type { Post } from "./PostCard";

interface SliderProps {
  posts: Post[];
  buildLink?: (post: Post) => string;
}

export function Slider({ posts, buildLink }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [posts.length]);

  if (!posts || posts.length === 0) {
    return null;
  }

  const currentPost = posts[currentIndex];
  const linkHref = buildLink
    ? buildLink(currentPost)
    : `/posts/categories/${currentPost.categorySlug}/articles/${currentPost.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg group">
      {/* Background Images with Animation */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {currentPost.image ? (
            <img
              src={currentPost.image}
              alt={currentPost.title}
              className="w-full h-full object-cover"
              loading={currentIndex === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content with Animation */}
      <AnimatePresence initial={false}>
        <motion.div
          key={`content-${currentIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 p-8 text-white"
        >
          {/* Category Badge */}
          {currentPost.categoryName && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="inline-block px-3 py-1 mb-3 text-sm font-medium bg-red-600 rounded"
            >
              {currentPost.categoryName}
            </motion.span>
          )}

          {/* Title */}
          <Link to={linkHref}>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl font-bold mb-3 line-clamp-2 hover:text-[var(--color-secondary)] transition-colors"
            >
              {currentPost.title}
            </motion.h2>
          </Link>

          {/* Date */}
          <motion.time
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-sm text-gray-300"
          >
            {new Date(currentPost.publishedAt || currentPost.createdAt).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </motion.time>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-8" : "bg-white/50"
            }`}
            aria-label={`الانتقال إلى الشريحة ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
        aria-label="السابق"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % posts.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
        aria-label="التالي"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    </motion.div>
  );
}
