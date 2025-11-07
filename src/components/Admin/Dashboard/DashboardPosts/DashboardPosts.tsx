import Loader from "@/components/Loader/Loader";
import { useCategories } from "@/hooks/useCategories";
import { useFetchPosts } from "@/hooks/useFetchPosts";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DashboardPosts({ label }: { label?: string }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { data: categories } = useCategories();
    const [category, setCategory] = useState<string | null>(null);
    const [language, setLanguage] = useState<string | null>(null);
    const [searchPhrase, setSearchPhrase] = useState<string | null>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(15);
    let isSlider = false;
    let isFeatured = false;
    let isBreaking = false;

    
    if (label == "Slider Posts") isSlider = true;
    if (label === "Featured Posts") isFeatured = true
    if (label === "Breaking News") isBreaking = true
    
    const { data: posts, isLoading } = useFetchPosts({
        category: category ?? undefined,
        language,
        searchPhrase,
        pageNumber,
        pageSize,
        isSlider,
        isFeatured,
        isBreaking,
    });

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pageNumber]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">{label}</h2>
                    <button
                        type="button"
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold bg-[#13967B] hover:bg-[#0e7a64] text-white rounded-lg shadow-md transition-all"
                        onClick={()=>navigate("/admin/add-post")}
                    >
                        <span>{t('post.addPost')}</span>
                    </button>
                </div>

                {/* Filters */}
                <form className="bg-white p-5 rounded-lg shadow-sm mb-6 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {/* Page size */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">{t('filter.show')}</label>
                            <select
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 focus:ring-[#13967B] focus:border-[#13967B] sm:text-sm text-gray-900"
                            >
                                {[15, 30, 60, 90].map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Language */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">{t('filter.language')}</label>
                            <select
                                onChange={(e) => setLanguage(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 focus:ring-[#13967B] focus:border-[#13967B] sm:text-sm text-gray-900"
                            >
                                <option value="all">{t('common.all')}</option>
                                <option value="English">{t('post.english')}</option>
                                <option value="Arabic">{t('post.arabic')}</option>
                            </select>
                        </div>

                        {/* Post Type */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">{t('filter.postType')}</label>
                            <select className="mt-1 block w-full rounded-md border-gray-300 focus:ring-[#13967B] focus:border-[#13967B] sm:text-sm text-gray-900">
                                <option>{t('common.all')}</option>
                                <option>{t('post.article')}</option>
                                <option>{t('post.video')}</option>
                            </select>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">{t('filter.category')}</label>
                            <select
                                value={category ?? ""}
                                onChange={(e) => setCategory(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 focus:ring-[#13967B] focus:border-[#13967B] sm:text-sm text-gray-900"
                            >
                                <option value="all">{t('common.all')}</option>
                                {categories?.data.map((option: { id: string; slug: string; name: string }) => (
                                    <option key={option.id} value={option.slug}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Subcategory */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">{t('filter.subcategory')}</label>
                            <select className="mt-1 block w-full rounded-md border-gray-300 focus:ring-[#13967B] focus:border-[#13967B] sm:text-sm text-gray-900">
                                <option>{t('common.all')}</option>
                            </select>
                        </div>

                        {/* User */}
                        <div>
                            <label className="text-sm font-medium text-gray-700">{t('filter.user')}</label>
                            <select className="mt-1 block w-full rounded-md border-gray-300 focus:ring-[#13967B] focus:border-[#13967B] sm:text-sm text-gray-900">
                                <option>{t('common.select')}</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div className="col-span-2 flex items-end space-x-2">
                            <input
                                id="search"
                                placeholder={t('filter.search')}
                                value={searchPhrase ?? ""}
                                onChange={(e) => setSearchPhrase(e.target.value)}
                                className="grow mt-1 block p-2 border-gray-300 rounded-md focus:ring-[#13967B] focus:border-[#13967B] sm:text-sm"
                                type="text"
                            />
                        </div>
                    </div>
                </form>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600 border-collapse table-auto">
                            <thead className="text-xs uppercase text-gray-700 bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="p-4"><input type="checkbox" className="rounded border-gray-300 text-[#13967B]" /></th>
                                    <th className="px-6 py-3">{t('post.id')}</th>
                                    <th className="px-6 py-3 min-w-[300px]">{t('post.posts')}</th>
                                    <th className="px-6 py-3">{t('post.language')}</th>
                                    <th className="px-6 py-3">{t('post.type')}</th>
                                    <th className="px-6 py-3">{t('post.category')}</th>
                                    <th className="px-6 py-3">{t('post.author')}</th>
                                    <th className="px-6 py-3">{t('post.views')}</th>
                                    <th className="px-6 py-3">{t('post.date')}</th>
                                    <th className="px-6 py-3 text-right">{t('post.options')}</th>
                                </tr>
                            </thead>

                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.tbody
                                        key="loader"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <tr>
                                            <td colSpan={10} className="text-center py-10">
                                                <Loader />
                                            </td>
                                        </tr>
                                    </motion.tbody>
                                ) : (
                                    <motion.tbody
                                        key="table"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                    >
                                        {posts?.data.items.map((item: any) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="p-4"><input type="checkbox" className="rounded border-gray-300 text-[#13967B]" /></td>
                                                <td className="px-6 py-4 text-gray-700">
                                                <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', maxWidth:"150px"}}>
                                                    {item.id}
                                                </div>
                                                </td>
                                                <td className="px-6 py-4 flex items-center space-x-3 cursor-pointer">
                                                    <img
                                                        src={item.image}
                                                        alt={item.imageDescription}
                                                        className="w-24 h-16 object-cover rounded-md shadow-sm"
                                                    />
                                                    <span className="font-medium text-gray-900">{item.title}</span>
                                                </td>
                                                <td className="px-6 py-4">{item.language}</td>
                                                <td className="px-6 py-4">Article</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 text-xs font-medium text-white bg-[#13967B] rounded-full">
                                                        {item.categoryName}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{item.authorName || "Created by"}</td>
                                                <td className="px-6 py-4">{item.viewsCount}</td>
                                                <td className="px-6 py-4">
                                                    {new Date(item.updatedAt).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="px-3 py-2 text-xs bg-[#13967B] text-white rounded-md hover:bg-[#0e7a64] transition-all">
                                                        {t('common.manage')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </motion.tbody>
                                )}
                            </AnimatePresence>
                        </table>
                    </div>

                    {/* Pagination */}
                    {posts?.data && posts.data.totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-2 py-4 bg-gray-50 cursor-pointer">
                            <button
                                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                                disabled={pageNumber === 1}
                                className={`px-3 py-1 border rounded-md cursor-pointer ${pageNumber === 1
                                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                ‹
                            </button>
                            {Array.from({ length: posts.data.totalPages }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setPageNumber(num)}
                                    className={`px-3 py-1 border rounded-md cursor-pointer ${pageNumber === num
                                        ? "bg-[#13967B] text-white border-[#13967B]"
                                        : "text-gray-700 hover:bg-gray-100 border-gray-200"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                            <button
                                onClick={() =>
                                    setPageNumber((prev) =>
                                        posts?.data.totalPages ? Math.min(prev + 1, posts.data.totalPages) : prev
                                    )
                                }
                                disabled={pageNumber === posts?.data.totalPages}
                                className={`px-3 py-1 border rounded-md cursor-pointer ${pageNumber === posts?.data.totalPages
                                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                ›
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
