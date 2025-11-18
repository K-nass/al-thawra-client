import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { PostCard, type Post } from "./PostCard";
import { StaggerContainer, StaggerItem, ScrollAnimation } from "./ScrollAnimation";

interface PostsGridProps {
  posts: Post[];
  categoryName?: string;
  categorySlug?: string;
  showCategoryHeader?: boolean;
  postsPerPage?: number;
}

export function PostsGrid({
  posts,
  categoryName,
  categorySlug,
  showCategoryHeader = true,
  postsPerPage = 3,
}: PostsGridProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لا توجد مقالات</p>
      </div>
    );
  }

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const canGoNext = currentIndex < totalPages - 1;
  const canGoPrev = currentIndex > 0;

  const visiblePosts = posts.slice(
    currentIndex * postsPerPage,
    (currentIndex + 1) * postsPerPage
  );

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
      {/* Category Header */}
      {showCategoryHeader && categoryName && (
        <ScrollAnimation 
          key={`header-${categorySlug}-${currentIndex}`}
          animation="slideUp" 
          once={false} 
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center">
            {categorySlug && (
              <Link 
                to={`/category/${categorySlug}`}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
                title={`عرض جميع مقالات ${categoryName}`}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-[var(--color-primary)] transition-colors" />
              </Link>
            )}
            <h2 className="text-2xl font-bold text-gray-900 mr-3">{categoryName}</h2>
          </div>

          {/* Navigation Arrows */}
          {posts.length > postsPerPage && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
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
                className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                aria-label="التالي"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </ScrollAnimation>
      )}

      {/* Posts Grid */}
      <StaggerContainer 
        key={`posts-grid-${currentIndex}`}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        staggerDelay={0.15} 
        once={false}
      >
        {visiblePosts.map((post) => (
          <StaggerItem key={post.id}>
            <PostCard post={post} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
