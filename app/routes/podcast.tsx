import { useLoaderData, useSearchParams } from "react-router";
import { PostCard } from "../components/PostCard";
import type { PaginatedPostsResponse, Post } from "../services/postsService";
import axiosInstance from "../lib/axios";
import { generateMetaTags } from "~/utils/seo";

// Loader function for SSR
export async function loader({ request }: { request: Request }) {
    const url = new URL(request.url);
    const pageNumber = parseInt(url.searchParams.get("page") || "1", 10);
    try {
        const response = await axiosInstance.get<PaginatedPostsResponse>(
            "/posts",
            {
                params: {
                    PageNumber: pageNumber,
                    PageSize: 15,
                    Type: "Audio",
                },
            }
        );
        return {
            data: response.data,
            pageNumber,
        };
    } catch (error) {
        console.error("Failed to load podcasts:", error);
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
    const featuredPodcasts = podcasts.slice(0, 4);
    const remainingPodcasts = podcasts.slice(4);

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: String(newPage) });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8" dir="rtl">
            {/* Podcast Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                    البودكاست
                </h1>
                <p className="text-gray-600">
                    استمع إلى أحدث الحوارات والنقاشات الشيقة
                </p>
            </div>

            {/* Empty State */}
            {podcasts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">لا يوجد بودكاست</p>
                </div>
            ) : (
                <>
                    {/* Featured Podcasts - 4 Column Grid */}
                    {featuredPodcasts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {featuredPodcasts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    buildLink={(post) => `/posts/categories/${post.categorySlug}/audios/${post.slug}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Remaining Podcasts - 3 Column Grid */}
                    {remainingPodcasts.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {remainingPodcasts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    buildLink={(post) => `/posts/categories/${post.categorySlug}/audios/${post.slug}`}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    >
                        السابق
                    </button>

                    <span className="text-gray-700">
                        الصفحة {currentPage} من {data.totalPages}
                    </span>

                    <button
                        onClick={() =>
                            handlePageChange(Math.min(data.totalPages, currentPage + 1))
                        }
                        disabled={currentPage === data.totalPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                    >
                        التالي
                    </button>
                </div>
            )}
        </div>
    );
}
