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
  buildLink?: (post: Post) => string;
}

export function PostsGrid({
  posts,
  categoryName,
  categorySlug,
  showCategoryHeader = true,
  postsPerPage = 3,
  buildLink,
}: PostsGridProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!posts || posts.length === 0) {
    return (
      <div>
        <p>لا توجد مقالات</p>
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
    <section dir="rtl" lang="ar">
      {/* Category Header */}
      {showCategoryHeader && categoryName && (
        <ScrollAnimation
          key={`header-${categorySlug}-${currentIndex}`}
          animation="slideUp"
          once={false}
        >
          <div>
            {categorySlug && (
              <Link
                to={`/category/${categorySlug}`}
                title={`عرض جميع مقالات ${categoryName}`}
              >
                <ArrowLeft />
              </Link>
            )}
            <h2>{categoryName}</h2>
          </div>

          {/* Navigation Arrows */}
          {posts.length > postsPerPage && (
            <div>
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                aria-label="السابق"
              >
                <ChevronRight />
              </button>
              <span>
                {currentIndex + 1} / {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                aria-label="التالي"
              >
                <ChevronLeft />
              </button>
            </div>
          )}
        </ScrollAnimation>
      )}

      {/* Posts Grid */}
      <StaggerContainer
        key={`posts-grid-${currentIndex}`}
        staggerDelay={0.15}
        once={false}
        immediate={true}
      >
        {visiblePosts.map((post) => (
          <StaggerItem key={post.id}>
            <PostCard post={post} buildLink={buildLink} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
