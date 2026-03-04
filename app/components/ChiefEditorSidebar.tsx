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
        <div>
            <h3>
                مقالات رئيس التحرير
            </h3>

            <div>
                <div>
                    <div></div>
                    <div>
                        {editor.avatarUrl ? (
                            <img
                                src={editor.avatarUrl}
                                alt={editor.fullName || "Chief Editor"}
                            />
                        ) : (
                            <div>
                                <span>{editor.fullName?.charAt(0)}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h2>
                        {editor.fullName}
                    </h2>
                    <p>
                        رئيس التحرير
                    </p>
                </div>
            </div>

            {/* List of articles */}
            <div>
                {recentPosts.map((post) => (
                    <Link
                        key={post.id}
                        to={`/posts/categories/${post.categorySlug}/articles/${post.slug}`}
                    >
                        <div />
                        <h4>
                            {post.title}
                        </h4>
                    </Link>
                ))}
            </div>

            <Link
                to="/chief-editor-articles"
            >
                <span>عرض كل المقالات</span>
                <ArrowLeft />
            </Link>
        </div>
    );
}
