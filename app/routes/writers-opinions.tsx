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
    <div>
      {/* Page Header */}
      <ScrollAnimation animation="slideUp" duration={0.6} once={false}>
        <div>
          <div>
            <div>
              <PenTool />
            </div>
            <div>
              <h1>كتاب وآراء</h1>
              <p>
                آراء وتحليلات من كتابنا المميزين
              </p>
            </div>
          </div>
          <div>
            <span>
              <span></span>
              {totalPosts} مقال
            </span>
            <span>
              <span></span>
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
              <div>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrevPage}
                >
                  السابق
                </button>
                
                <div>
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
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage}
                >
                  التالي
                </button>
              </div>
            </ScrollAnimation>
          )}
        </div>
      ) : (
        <ScrollAnimation animation="fade" once={false}>
          <div>
            <PenTool />
            <h3>
              لا توجد مقالات حالياً
            </h3>
            <p>
              لم يتم نشر أي مقالات من الكتاب بعد
            </p>
          </div>
        </ScrollAnimation>
      )}
    </div>
  );
}
