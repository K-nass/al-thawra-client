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
    console.error("Error loading chief editor articles:", error);
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
    <div className="min-h-screen bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]">
      {/* Header Section */}
      <section className="relative py-20 mb-8 overflow-hidden bg-gray-900">
        {/* Background Image with Blur and Overlay */}
        <div className="absolute inset-0 z-0">
          {editor?.avatarUrl && (
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale-50 opacity-40 blur-sm scale-110"
              style={{ backgroundImage: `url(${editor.avatarUrl})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollAnimation animation="fade">
                <div className="mb-8 flex justify-center">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl opacity-75 group-hover:opacity-100 blur transition duration-500"></div>
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl p-1 bg-gray-900 ring-4 ring-white/10 rotate-3 group-hover:rotate-0 transition-all duration-500">
                        {editor?.avatarUrl ? (
                            <img
                            src={editor.avatarUrl}
                            alt={editor.fullName || "Chief Editor"}
                            className="w-full h-full rounded-2xl object-cover"
                            />
                        ) : (
                            <div className="w-full h-full rounded-2xl bg-gray-800 flex items-center justify-center">
                                <User className="w-16 h-16 text-gray-400" />
                            </div>
                        )}
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white text-sm font-bold px-6 py-1.5 rounded-xl shadow-xl border-4 border-gray-900 whitespace-nowrap transform -rotate-3 group-hover:rotate-0 transition-all duration-500 z-20">
                        رئيس التحرير
                        </div>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-sm">
                    {editor?.fullName || "رئيس التحرير"}
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    جميع المقالات والآراء والتحليلات الحصرية
                </p>
                
                 <div className="flex justify-center">
                    <Link
                        to="/"
                        className="group flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/10 text-white"
                    >
                        <ArrowLeft className="w-4 h-4 ml-1 group-hover:-translate-x-1 transition-transform" />
                        <span>العودة للرئيسية</span>
                    </Link>
                </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 pb-16">
        {posts.length > 0 ? (
            <WritersOpinionsGrid posts={posts} showHeader={false} postsPerPage={99} />
        ) : (
             <div className="text-center py-20">
                <p className="text-xl text-[var(--color-text-secondary)]">لا توجد مقالات منشورة حالياً.</p>
             </div>
        )}
      </div>
    </div>
  );
}
