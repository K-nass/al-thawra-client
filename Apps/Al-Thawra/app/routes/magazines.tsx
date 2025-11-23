import { useState } from "react";
import { useLoaderData, useSearchParams } from "react-router";
import type { Route } from "./+types/magazines";
import axiosInstance from "~/lib/axios";
import { FileText, Calendar, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { cache, CacheTTL } from "~/lib/cache";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "~/components/ScrollAnimation";
import { generateMetaTags } from "~/utils/seo";

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
    description: "تصفح مجموعة متنوعة من المجلات الإلكترونية من الثورة. محتوى متخصص في مختلف المجالات",
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

    // Fetch with caching
    const response = await cache.getOrFetch(
      cacheKey,
      () => axiosInstance.get<MagazinesResponse>("/magazines", { params }),
      CacheTTL.MEDIUM
    );

    console.log("Magazines response:", response.data);

    return {
      magazines: response.data.items,
      pageNumber: response.data.pageNumber,
      pageSize: response.data.pageSize,
      totalCount: response.data.totalCount,
      totalPages: response.data.totalPages,
      itemsFrom: response.data.itemsFrom,
      itemsTo: response.data.itemsTo,
    };
  } catch (error: any) {
    console.error("Error loading magazines:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error details:", error.response?.data?.errors);
    
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
  const { magazines, pageNumber, totalPages, totalCount, itemsFrom, itemsTo } =
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <ScrollAnimation animation="slideUp">
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          أرشيف الثورة
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          تصفح جميع أعداد صحيفة الثورة
        </p>
        </div>
      </ScrollAnimation>

      {/* Results Info */}
      {totalCount > 0 && (
        <div className="mb-6 text-sm text-[var(--color-text-secondary)]">
          عرض {itemsFrom} - {itemsTo} من أصل {totalCount} عدد
        </div>
      )}

      {/* Magazines Grid */}
      {magazines.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8" staggerDelay={0.1}>
          {magazines.map((magazine) => (
            <StaggerItem key={magazine.issueNumber}>
            <div
              key={magazine.issueNumber}
              className="bg-[var(--color-white)] rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[3/4] bg-[var(--color-divider)] overflow-hidden">
                {magazine.thumbnailUrl ? (
                  <img
                    src={magazine.thumbnailUrl}
                    alt={`العدد ${magazine.issueNumber}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-16 h-16 text-[var(--color-text-secondary)]" />
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a
                    href={magazine.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-white)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-secondary-light)] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="font-medium">تحميل PDF</span>
                  </a>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                  العدد {magazine.issueNumber}
                </h3>
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(magazine.createdAt)}</span>
                </div>
              </div>
            </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-[var(--color-text-secondary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)] text-lg">
            لا توجد أعداد متاحة حالياً
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber === 1}
            className="p-2 rounded-lg border border-[var(--color-divider)] hover:bg-[var(--color-background-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="الصفحة السابقة"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    pageNumber === pageNum
                      ? "bg-[var(--color-primary)] text-white"
                      : "border border-[var(--color-divider)] hover:bg-[var(--color-background-light)]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={pageNumber === totalPages}
            className="p-2 rounded-lg border border-[var(--color-divider)] hover:bg-[var(--color-background-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="الصفحة التالية"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
