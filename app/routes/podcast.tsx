import { useLoaderData, useSearchParams } from "react-router";
import { PostsGrid } from "../components/PostsGrid";
import { Slider } from "../components/Slider";
import type { PaginatedPostsResponse, Post } from "../services/postsService";
import axiosInstance from "../lib/axios";
import { generateMetaTags } from "~/utils/seo";

// Loader function for SSR
export async function loader({ request }: { request: Request }) {
    const url = new URL(request.url);
    const pageNumber = parseInt(url.searchParams.get("page") || "1", 10);
    try {
        const response = await axiosInstance.get<PaginatedPostsResponse>(
            "/posts/categories/audios",
            {
                params: {
                    PageNumber: pageNumber,
                    PageSize: 15,
                },
            }
        );
        return {
            data: response.data,
            pageNumber,
        };
    } catch (error) {
        throw new Response("Failed to load podcasts", { status: 500 });
    }
}

export function meta() {
  return generateMetaTags({
    title: "البودكاست - الثورة",
    description: "استمع إلى أحدث الحوارات والنقاشات الشيقة. بودكاست الثورة يقدم محتوى صوتي متنوع يغطي مختلف القضايا",
    url: "/podcast",
    type: "website",
  });
}

export default function PodcastPage() {
    const { data, pageNumber: initialPageNumber } = useLoaderData<typeof loader>();
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || String(initialPageNumber), 10);

    const podcasts: Post[] = data?.items || [];
    const sliderPodcasts = podcasts.slice(0, 3);

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: String(newPage) });
    };

    return (
        <div className="space-y-6">
            {/* Podcast Slider */}
            {sliderPodcasts.length > 0 && (
                <Slider
                    posts={sliderPodcasts}
                    buildLink={(post) => `/posts/categories/${post.categorySlug}/audios/${post.slug}`}
                />
            )}

            {/* Podcast Header */}
            <div className="bg-[var(--color-white)] border border-[var(--color-divider)] rounded-lg p-4">
                <h1 className="text-2xl font-bold text-[var(--color-primary)]">
                    البودكاست
                </h1>
                <p className="text-[var(--color-text-secondary)] mt-2">
                    استمع إلى أحدث الحوارات والنقاشات الشيقة
                </p>
            </div>

            {/* Podcasts Grid */}
            <div>
                <PostsGrid
                    posts={podcasts}
                    showCategoryHeader={false}
                    buildLink={(post) => `/posts/categories/${post.categorySlug}/audios/${post.slug}`}
                />

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-6 py-2 bg-[var(--color-background-light)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-card)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            السابق
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-[var(--color-text-secondary)]">
                                الصفحة {currentPage} من {data.totalPages}
                            </span>
                        </div>

                        <button
                            onClick={() =>
                                handlePageChange(Math.min(data.totalPages, currentPage + 1))
                            }
                            disabled={currentPage === data.totalPages}
                            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md hover:shadow-lg"
                        >
                            التالي
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
