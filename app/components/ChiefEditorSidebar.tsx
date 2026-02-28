import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import type { Post } from "../services/postsService";
import type { ChiefEditor } from "../services/userService";

interface ChiefEditorSidebarProps {
    editor: ChiefEditor;
    posts: Post[];
}

export function ChiefEditorSidebar({ editor, posts }: ChiefEditorSidebarProps) {
    const recentPosts = posts.slice(0, 5); // Use all provided posts

    return (
        <div className="flex flex-col items-center text-center lg:items-start lg:text-right">
            <h3 className="text-xl font-bold mb-6 w-full pb-2 border-b border-dashed border-[var(--color-divider)] text-[var(--color-text-primary)] dark:text-white">
                مقالات رئيس التحرير
            </h3>

            <div className="w-full flex items-center gap-4 mb-8">
                <div className="relative group flex-shrink-0">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full opacity-20 blur transition duration-500"></div>
                    <div className="relative w-20 h-20 rounded-full p-0.5 bg-[var(--color-white)] ring-2 ring-gray-100 dark:ring-white/5 transition-all duration-500">
                        {editor.avatarUrl ? (
                            <img
                                src={editor.avatarUrl}
                                alt={editor.fullName || "Chief Editor"}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                                <span className="text-3xl font-bold text-[var(--color-text-primary)] dark:text-white">{editor.fullName?.charAt(0)}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)] dark:text-white leading-tight">
                        {editor.fullName}
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-sm mt-1">
                        رئيس التحرير
                    </p>
                </div>
            </div>

            {/* List of articles */}
            <div className="w-full space-y-4 mb-8">
                {recentPosts.map((post) => (
                    <Link
                        key={post.id}
                        to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                        className="group flex items-start gap-3 text-right"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                        <h4 className="text-base font-bold text-[var(--color-text-primary)] dark:text-white group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                            {post.title}
                        </h4>
                    </Link>
                ))}
            </div>

            <Link
                to="/chief-editor-articles"
                className="group inline-flex items-center gap-2 px-6 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-full transition-all duration-300"
            >
                <span className="font-bold text-sm">عرض كل المقالات</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
        </div>
    );
}
