import { useLoaderData, useSearchParams, Link } from "react-router";
import type { Route } from "./+types/magazines";
import axiosInstance from "~/lib/axios";
import { FileText, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cache, CacheTTL } from "~/lib/cache";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "~/components/ScrollAnimation";
import { generateMetaTags } from "~/utils/seo";
import { PdfFirstPageThumbnail } from "~/components/PdfFirstPageThumbnail";

interface Magazine {
  issueNumber: string;
  pdfUrl: string;
  thumbnailUrl: string;
  createdAt: string;
}

interface MagazinesResponse {
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  totalPages: number;
  itemsFrom: number;
  itemsTo: number;
  items: Magazine[];
}

export function meta({}: Route.MetaArgs) {
  return generateMetaTags({
    title: "المجلات",
    description:
      "تصفح مجموعة متنوعة من المجلات الإلكترونية من الثورة. محتوى متخصص في مختلف المجالات",
    url: "/magazines",
    type: "website",
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const pageNumber = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "15");
  const from = url.searchParams.get("from") || "";
  const to = url.searchParams.get("to") || "";
  const searchPhrase = url.searchParams.get("search") || "";
  const isUnfilteredFirstPage =
    pageNumber === 1 && !from && !to && !searchPhrase;
  const unfilteredFirstPageTTL = 60 * 1000; // 1 minute

  // Validate pageSize - must be one of [15, 30, 60, 90]
  const validPageSizes = [15, 30, 60, 90];
  const validatedPageSize = validPageSizes.includes(pageSize) ? pageSize : 15;

  try {
    const params: Record<string, any> = {
      PageNumber: pageNumber,
      PageSize: validatedPageSize,
    };

    if (from) params.From = from;
    if (to) params.To = to;
    if (searchPhrase) params.SearchPhrase = searchPhrase;

    // Generate cache key based on params
    const cacheKey = cache.generateKey("magazines", params);

    // Keep caching for first load, but with a short TTL so newly published
    // issues appear quickly in the archive.
    const response = await cache.getOrFetch(
      cacheKey,
      () => axiosInstance.get<MagazinesResponse>("/magazines", { params }),
      isUnfilteredFirstPage ? unfilteredFirstPageTTL : CacheTTL.MEDIUM
    );

    return {
      magazines: response.data.items,
      pageNumber: response.data.pageNumber,
      pageSize: response.data.pageSize,
      totalCount: response.data.totalCount,
      totalPages: response.data.totalPages,
      itemsFrom: response.data.itemsFrom,
      itemsTo: response.data.itemsTo,
    };
  } catch {
    // Return empty data on error
    return {
      magazines: [],
      pageNumber: 1,
      pageSize: 15,
      totalCount: 0,
      totalPages: 0,
      itemsFrom: 0,
      itemsTo: 0,
    };
  }
}

export default function MagazinesPage() {
  const { magazines, pageNumber, totalPages, itemsFrom, itemsTo } =
    useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-KW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <ScrollAnimation animation="slideUp">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center border-b border-dashed border-black/10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            أرشيف الثورة
          </h1>
          <p className="text-gray-700 text-lg">تصفح جميع أعداد صحيفة الثورة</p>
        </div>
      </ScrollAnimation>

      {/* Date Filter */}
      <div className="max-w-7xl mx-auto px-4 py-6 border-b border-dashed border-black/10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">تصفية حسب التاريخ</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="from-date" className="block text-sm font-medium text-gray-700 mb-2">
              من تاريخ
            </label>
            <input
              type="date"
              id="from-date"
              value={searchParams.get("from") || ""}
              onChange={(e) => {
                setSearchParams((prev) => {
                  if (e.target.value) {
                    prev.set("from", e.target.value);
                  } else {
                    prev.delete("from");
                  }
                  prev.set("page", "1");
                  return prev;
                });
              }}
              className="w-full px-4 py-2 border border-dashed border-black/10 rounded-lg bg-transparent text-gray-900 focus:outline-none"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label htmlFor="to-date" className="block text-sm font-medium text-gray-700 mb-2">
              إلى تاريخ
            </label>
            <input
              type="date"
              id="to-date"
              value={searchParams.get("to") || ""}
              onChange={(e) => {
                setSearchParams((prev) => {
                  if (e.target.value) {
                    prev.set("to", e.target.value);
                  } else {
                    prev.delete("to");
                  }
                  prev.set("page", "1");
                  return prev;
                });
              }}
              className="w-full px-4 py-2 border border-dashed border-black/10 rounded-lg bg-transparent text-gray-900 focus:outline-none"
            />
          </div>

          {(searchParams.get("from") || searchParams.get("to")) && (
            <button
              onClick={() => {
                setSearchParams((prev) => {
                  prev.delete("from");
                  prev.delete("to");
                  prev.set("page", "1");
                  return prev;
                });
              }}
              className="px-6 py-2 text-gray-900 font-medium border border-dashed border-black/20 rounded-lg hover:bg-black/5 transition-all"
            >
              مسح الفلتر
            </button>
          )}
        </div>
      </div>

      {/* Magazines Grid */}
      {magazines.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <StaggerContainer staggerDelay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {magazines.map((magazine) => (
                <StaggerItem key={magazine.issueNumber}>
                  <div className="group border border-dashed border-black/10 rounded-lg overflow-hidden hover:shadow-lg transition-all">
                    {/* Thumbnail */}
                    <div className="relative aspect-[3/4] bg-gray-100">
                      <PdfFirstPageThumbnail
                        pdfUrl={magazine.pdfUrl}
                        alt={`العدد ${magazine.issueNumber}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link
                          to={`/magazines/date/${magazine.createdAt.split("T")[0]}`}
                          className="flex flex-col items-center gap-2 text-white"
                        >
                          <FileText className="w-8 h-8" />
                          <span className="text-sm font-medium">تصفح العدد</span>
                        </Link>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 border-t border-dashed border-black/10">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        العدد {magazine.issueNumber}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(magazine.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 border border-dashed border-black/10 rounded-lg mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg">لا توجد أعداد متاحة حالياً</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto px-4 py-8 border-t border-dashed border-black/10">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(pageNumber - 1)}
              disabled={pageNumber === 1}
              aria-label="الصفحة السابقة"
              className="p-2 border border-dashed border-black/20 rounded-lg hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, Math.max(1, totalPages)) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pageNumber <= 3) {
                  pageNum = i + 1;
                } else if (pageNumber >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = pageNumber - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 border border-dashed rounded-lg font-medium transition-all ${
                      pageNum === pageNumber
                        ? "border-black/30 bg-black/5 text-gray-900"
                        : "border-black/20 text-gray-700 hover:bg-black/5"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pageNumber + 1)}
              disabled={pageNumber === totalPages || totalPages === 0}
              aria-label="الصفحة التالية"
              className="p-2 border border-dashed border-black/20 rounded-lg hover:bg-black/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* a11y: range summary */}
          <p className="sr-only" aria-live="polite">
            {itemsFrom} - {itemsTo}
          </p>
        </div>
      )}
    </div>
  );
}
