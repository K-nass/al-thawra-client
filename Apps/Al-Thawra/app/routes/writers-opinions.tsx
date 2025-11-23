import { useLoaderData, useSearchParams } from "react-router";
import { postsService } from "~/services/postsService";
import { WritersOpinionsGrid } from "~/components/WritersOpinionsGrid";
import { ScrollAnimation } from "~/components/ScrollAnimation";
import { PenTool } from "lucide-react";
import { cache, CacheTTL } from "~/lib/cache";
import { generateMetaTags } from "~/utils/seo";

interface LoaderData {
  posts: any[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}

interface LoaderArgs {
  request: Request;
}

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = 15;

  try {
    // Fetch posts with authors with caching
    const cacheKey = `posts:writers-opinions:${page}:${pageSize}`;
    const response = await cache.getOrFetch(
      cacheKey,
      async () => {
        return await postsService.getPosts({
          hasAuthor: true,
          pageNumber: page,
          pageSize,
          type: "Article",
        });
      },
      CacheTTL.MEDIUM
    );

    return {
      posts: response.items,
      totalPosts: response.totalCount,
      currentPage: response.pageNumber,
      totalPages: response.totalPages,
    };
  } catch (error: any) {
    console.error("Error loading writers opinions:", error);
    return {
      posts: [],
      totalPosts: 0,
      currentPage: 1,
      totalPages: 1,
    };
  }
}

export function meta() {
  return generateMetaTags({
    title: "كتاب وآراء - الثورة",
    description: "اقرأ آراء وتحليلات من كتابنا المميزين. مقالات متنوعة تغطي مختلف القضايا السياسية والاجتماعية والثقافية",
    url: "/writers-opinions",
    type: "website",
  });
}

export default function WritersOpinionsPage() {
  const { posts, totalPosts, currentPage, totalPages } = useLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <ScrollAnimation animation="slideUp" duration={0.6} once={false}>
        <div className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-secondary)] rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <PenTool className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">كتاب وآراء</h1>
              <p className="text-white/90 text-lg">
                آراء وتحليلات من كتابنا المميزين
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/80 mt-6 pt-6 border-t border-white/20">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              {totalPosts} مقال
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              صفحة {currentPage} من {totalPages}
            </span>
          </div>
        </div>
      </ScrollAnimation>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div key={`posts-page-${currentPage}`}>
          <WritersOpinionsGrid posts={posts} showHeader={false} />

          {/* Pagination */}
          {totalPages > 1 && (
            <ScrollAnimation animation="fade" delay={0.2} once={false}>
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrevPage}
                  className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-primary)] font-medium"
                >
                  السابق
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-[var(--color-background-light)] text-[var(--color-text-primary)] hover:bg-[var(--color-card)]"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage}
                  className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-primary)] font-medium"
                >
                  التالي
                </button>
              </div>
            </ScrollAnimation>
          )}
        </div>
      ) : (
        <ScrollAnimation animation="fade" once={false}>
          <div className="text-center py-16 bg-[var(--color-white)] rounded-2xl shadow-sm">
            <PenTool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              لا توجد مقالات حالياً
            </h3>
            <p className="text-gray-500">
              لم يتم نشر أي مقالات من الكتاب بعد
            </p>
          </div>
        </ScrollAnimation>
      )}
    </div>
  );
}
