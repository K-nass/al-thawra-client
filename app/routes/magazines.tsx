import { useState } from "react";
import { useLoaderData, useSearchParams, Link } from "react-router";
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
    <div>
      {/* Header */}
      <ScrollAnimation animation="slideUp">
        <div>
        <h1>
          أرشيف الثورة
        </h1>
        <p>
          تصفح جميع أعداد صحيفة الثورة
        </p>
        </div>
      </ScrollAnimation>

      {/* Date Filter */}
      <div>
        <h2>
          تصفية حسب التاريخ
        </h2>
        <div>
          <div>
            <label htmlFor="from-date">
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
                  prev.set("page", "1"); // Reset to page 1
                  return prev;
                });
              }}
            />
          </div>
          <div>
            <label htmlFor="to-date">
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
                  prev.set("page", "1"); // Reset to page 1
                  return prev;
                });
              }}
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
            >
              مسح الفلتر
            </button>
          )}
        </div>
      </div>

      {/* Magazines Grid */}
      {magazines.length > 0 ? (
        <StaggerContainer staggerDelay={0.1}>
          {magazines.map((magazine) => (
            <StaggerItem key={magazine.issueNumber}>
            <div
              key={magazine.issueNumber}
            >
              {/* Thumbnail */}
              <div>
                {magazine.thumbnailUrl ? (
                  <img
                    src={magazine.thumbnailUrl}
                    alt={`العدد ${magazine.issueNumber}`}
                  />
                ) : (
                  <div>
                    <FileText />
                  </div>
                )}
                {/* Overlay on hover */}
                <div>
                  <Link
                    to={`/magazines/date/${magazine.createdAt.split('T')[0]}`}
                  >
                    <FileText />
                    <span>تصفح العدد</span>
                  </Link>
                </div>
              </div>

              {/* Info */}
              <div>
                <h3>
                  العدد {magazine.issueNumber}
                </h3>
                <div>
                  <Calendar />
                  <span>{formatDate(magazine.createdAt)}</span>
                </div>
              </div>
            </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div>
          <FileText />
          <p>
            لا توجد أعداد متاحة حالياً
          </p>
        </div>
      )}

      {/* Pagination */}
      <div>
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
          aria-label="الصفحة السابقة"
        >
          <ChevronRight />
        </button>

        <div>
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
        >
          <ChevronLeft />
        </button>
      </div>
    </div>
  );
}
