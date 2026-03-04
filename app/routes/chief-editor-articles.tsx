import { useLoaderData, Link } from "react-router";
import { ArrowLeft, User } from "lucide-react";
import { userService } from "../services/userService";
import { postsService } from "../services/postsService";
import type { Post } from "../services/postsService";
import type { ChiefEditor } from "../services/userService";
import { WritersOpinionsGrid } from "../components/WritersOpinionsGrid";
import { ScrollAnimation } from "../components/ScrollAnimation";
import { generateMetaTags } from "~/utils/seo";

interface LoaderData {
  editor: ChiefEditor;
  posts: Post[];
}

export const loader = async () => {
  try {
    const [editor, posts] = await Promise.all([
      userService.getChiefEditor(),
      postsService.getChiefEditorPosts(30) // Fetch top 30 posts initially
    ]);

    return { editor, posts };
  } catch (error) {
    throw new Response("Failed to load articles", { status: 500 });
  }
};

export const meta = () => {
  return [
    ...generateMetaTags({
      title: "مقالات رئيس التحرير",
      description: "اقرأ جميع مقالات وآراء رئيس التحرير في صحيفة الثورة",
      url: "/chief-editor-articles",
    }),
  ];
};

export default function ChiefEditorArticlesPage() {
  const { editor, posts } = useLoaderData<LoaderData>();

  return (
    <div>
      {/* Header Section */}
      <section>
        {/* Background Image with Blur and Overlay */}
        <div>
          {editor?.avatarUrl && (
            <div
            />
          )}
          <div />
        </div>

        <div>
          <div>
            <ScrollAnimation animation="fade">
                <div>
                    <div>
                        <div></div>
                        <div>
                        {editor?.avatarUrl ? (
                            <img
                            src={editor.avatarUrl}
                            alt={editor.fullName || "Chief Editor"}
                            />
                        ) : (
                            <div>
                                <User />
                            </div>
                        )}
                        </div>
                        <div>
                        رئيس التحرير
                        </div>
                    </div>
                </div>

                <h1>
                    {editor?.fullName || "رئيس التحرير"}
                </h1>
                <p>
                    جميع المقالات والآراء والتحليلات الحصرية
                </p>
                
                 <div>
                    <Link
                        to="/"
                    >
                        <ArrowLeft />
                        <span>العودة للرئيسية</span>
                    </Link>
                </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <div>
        {posts.length > 0 ? (
            <WritersOpinionsGrid posts={posts} showHeader={false} postsPerPage={99} />
        ) : (
             <div>
                <p>لا توجد مقالات منشورة حالياً.</p>
             </div>
        )}
      </div>
    </div>
  );
}
