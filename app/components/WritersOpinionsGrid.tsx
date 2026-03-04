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
    <section dir="rtl" lang="ar">
      {showHeader && (
        <ScrollAnimation
          key={`writers-header-${currentIndex}`}
          animation="slideUp"
          once={false}
        >
          <div>
            <Link
              to="/writers-opinions"
              title="عرض جميع كتاب وآراء"
            >
              <ChevronLeft />
            </Link>
            <h2>
              كتاب وآراء
            </h2>
          </div>

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

      <StaggerContainer
        key={`writers-grid-${currentIndex}`}
        staggerDelay={0.15}
        once={false}
      >
        {visiblePosts.map((post) => (
          <StaggerItem key={post.id}>
            <Link
              to={`/writers-opinions/${post.slug}`}
            >
              <div>
                {/* Gradient Background */}
                <div />

                {/* Content */}
                <div>
                  {/* Top Section - Category */}
                  <div>
                    <span>
                      {post.categoryName}
                    </span>
                  </div>

                  {/* Middle Section - Title */}
                  <div>
                    <h3>
                      {post.title}
                    </h3>
                  </div>

                  {/* Bottom Section - Author Info */}
                  <div>
                    {/* Author Image */}
                    <div>
                      {post.authorImage ? (
                        <img
                          src={post.authorImage}
                          alt={post.authorName}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div>
                          <span>
                            {post.authorName?.charAt(0) || "ك"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Author Name & Date */}
                    <div>
                      <p>
                        {post.authorName}
                      </p>
                      <p>
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
                <div />
                <div />
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
