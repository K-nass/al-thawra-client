import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ArticleImage from "../components/ArticleImage";
import { cleanPlainText } from "~/utils/arabicTextUtils";
import ColoredTitle from "~/components/ColoredTitle";
import type { Post } from "~/services/postsService";



export default function DualSwiperLayout({ posts }: { posts: Post[] }) {
    const firstRowPosts = posts.slice(0, 10);
    const secondRowPosts = posts.slice(4, 8);

    return (
        <div className="min-h-[600px] md:min-h-[700px] space-y-4 bg-red-500">
            {/* First Row: Articles Swiper */}
            <Swiper
                spaceBetween={16}
                breakpoints={{
                    0: { slidesPerView: 2 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                }}
                style={{ height: "auto" }}
            >
                {firstRowPosts.map((post) => (
                    <SwiperSlide key={post.id} style={{ height: "auto" }}>
                        <Link
                            to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                            className="block group h-full"
                        >
                            <article className="h-full flex flex-col border border-dashed border-black/10 overflow-hidden">
                                <div className="p-3 min-h-[180px] flex flex-col">
                                    <ColoredTitle
                                        title={post.title}
                                        coloredWordsCount={0}
                                        className="semafor-section-title hover:text-blue-700 transition-colors mb-2"
                                    />
                                    {post.summary && (
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                            {cleanPlainText(post.summary)}
                                        </p>
                                    )}
                                </div>
                                <ArticleImage
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full flex-none h-52 md:h-48 lg:h-44 mt-auto"
                                />
                            </article>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Second Row: Articles Swiper */}
            <Swiper
                spaceBetween={16}
                breakpoints={{
                    0: { slidesPerView: 2 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                }}
                style={{ height: "auto" }}
            >
                {secondRowPosts.map((post) => (
                    <SwiperSlide key={post.id} style={{ height: "auto" }}>
                        <Link
                            to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                            className="block group h-full"
                        >
                            <article className="h-full flex flex-col border border-dashed border-black/10 overflow-hidden">
                                <div className="p-3 min-h-[180px] flex flex-col">
                                    <ColoredTitle
                                        title={post.title}
                                        coloredWordsCount={0}
                                        className="semafor-section-title hover:text-blue-700 transition-colors mb-2"
                                    />
                                    {post.summary && (
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                            {cleanPlainText(post.summary)}
                                        </p>
                                    )}
                                </div>
                                <ArticleImage
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full flex-none h-52 md:h-48 lg:h-44 mt-auto"
                                />
                            </article>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
