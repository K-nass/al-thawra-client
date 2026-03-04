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
        <div>
            {/* Podcast Slider */}
            {sliderPodcasts.length > 0 && (
                <Slider
                    posts={sliderPodcasts}
                    buildLink={(post) => `/posts/categories/${post.categorySlug}/audios/${post.slug}`}
                />
            )}

            {/* Podcast Header */}
            <div>
                <h1>
                    البودكاست
                </h1>
                <p>
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
                    <div>
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                        >
                            السابق
                        </button>

                        <div>
                            <span>
                                الصفحة {currentPage} من {data.totalPages}
                            </span>
                        </div>

                        <button
                            onClick={() =>
                                handlePageChange(Math.min(data.totalPages, currentPage + 1))
                            }
                            disabled={currentPage === data.totalPages}
                        >
                            التالي
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
