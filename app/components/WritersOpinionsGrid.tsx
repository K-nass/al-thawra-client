import { Link } from "react-router";
import { useState } from "react";
import type { Post } from "../services/postsService";
import { StaggerContainer, StaggerItem, ScrollAnimation } from "./ScrollAnimation";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface WritersOpinionsGridProps {
  posts: Post[];
  showHeader?: boolean;
  postsPerPage?: number;
}

export function WritersOpinionsGrid({ posts, showHeader = true, postsPerPage = 3 }: WritersOpinionsGridProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!posts || posts.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const visiblePosts = posts.slice(currentIndex * postsPerPage, (currentIndex + 1) * postsPerPage);
  
  const canGoNext = currentIndex < totalPages - 1;
  const canGoPrev = currentIndex > 0;

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section className="w-full" dir="rtl" lang="ar">
      {showHeader && (
        <ScrollAnimation 
          key={`writers-header-${currentIndex}`}
          animation="slideUp" 
          once={false} 
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center">
            <Link
              to="/writers-opinions"
              className="p-2 rounded-full hover:bg-[var(--color-background-light)] transition-colors group"
              title="عرض جميع كتاب وآراء"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-[var(--color-primary)] transition-colors" />
            </Link>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mr-3">
              كتاب وآراء
            </h2>
          </div>

          {posts.length > postsPerPage && (
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                className="p-2 rounded-full hover:bg-[var(--color-background-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                aria-label="السابق"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-sm text-gray-500 min-w-[60px] text-center">
                {currentIndex + 1} / {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="p-2 rounded-full hover:bg-[var(--color-background-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                aria-label="التالي"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </ScrollAnimation>
      )}

      <StaggerContainer 
        key={`writers-grid-${currentIndex}`}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        staggerDelay={0.15} 
        once={false}
      >
        {visiblePosts.map((post) => (
          <StaggerItem key={post.id}>
            <Link
              to={`/writers-opinions/${post.slug}`}
              className="block group"
            >
              <div className="relative h-[280px] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-secondary)] opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative h-full p-6 flex flex-col justify-between text-white">
                  {/* Top Section - Category */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      {post.categoryName}
                    </span>
                  </div>

                  {/* Middle Section - Title */}
                  <div className="flex-1 flex pt-2">
                    <h3 className="text-2xl font-bold leading-snug tracking-wide line-clamp-3">
                      {post.title}
                    </h3>
                  </div>

                  {/* Bottom Section - Author Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                    {/* Author Image */}
                    <div className="flex-shrink-0">
                      {post.authorImage ? (
                        <img
                          src={post.authorImage}
                          alt={post.authorName}
                          className="w-16 h-16 rounded-lg object-cover border-2 border-white/30"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                          <span className="text-xl font-bold">
                            {post.authorName?.charAt(0) || "ك"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Author Name & Date */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-lg truncate">
                        {post.authorName}
                      </p>
                      <p className="text-xs text-white/80 mt-0.5">
                        {new Date(post.publishedAt).toLocaleDateString("ar-KW", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
