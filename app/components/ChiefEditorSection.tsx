import { Link } from "react-router";
import { ArrowLeft, Image } from "lucide-react";
import type { Post } from "../services/postsService";
import type { ChiefEditor } from "../services/userService";
import { ScrollAnimation } from "./ScrollAnimation";

interface ChiefEditorSectionProps {
  editor: ChiefEditor;
  posts: Post[];
}

export function ChiefEditorSection({ editor, posts }: ChiefEditorSectionProps) {
  if (!editor || posts.length === 0) return null;

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 5); // Take next 4 posts

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="relative rounded-[1.5rem] overflow-hidden bg-[var(--color-white)] transition-colors duration-300 shadow-sm border border-gray-100 dark:border-white/5">
          
          <div className="relative z-10 p-6 md:p-10">
            <ScrollAnimation animation="fade" once={false}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Column: Chief Editor Profile */}
                <div className="lg:col-span-4 flex flex-col items-center text-center lg:items-start lg:text-right">
                  <div className="relative group mb-6">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                      <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl p-1 bg-[var(--color-white)] ring-2 ring-gray-100 dark:ring-white/5 rotate-3 group-hover:rotate-0 transition-all duration-500">
                      {editor.avatarUrl ? (
                          <img
                          src={editor.avatarUrl}
                          alt={editor.fullName || "Chief Editor"}
                          className="w-full h-full rounded-2xl object-cover"
                          />
                      ) : (
                          <div className="w-full h-full rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                              <span className="text-4xl font-bold text-[var(--color-text-primary)] dark:text-white">{editor.fullName?.charAt(0)}</span>
                          </div>
                      )}
                      </div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white text-xs font-bold px-4 py-1 rounded-xl shadow-lg border-2 border-[var(--color-white)] whitespace-nowrap transform -rotate-3 group-hover:rotate-0 transition-all duration-500 z-20">
                      رئيس التحرير
                      </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[var(--color-text-primary)] dark:text-white">
                    {editor.fullName}
                  </h2>
                  <p className="text-[var(--color-text-secondary)] text-base mb-6 max-w-xs mx-auto lg:mx-0">
                    مقالات ورؤى حصرية وتحليلات معمقة في مختلف المجالات.
                  </p>

                  <Link
                    to="/chief-editor-articles"
                    className="group inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <span className="font-bold text-sm">عرض كل المقالات</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </div>

                {/* Right Column: Latest Article */}
                <div className="lg:col-span-8">
                  <Link
                    to={`/posts/categories/${featuredPost.categorySlug}/articles/${featuredPost.slug}`}
                    className="group block h-full"
                  >
                    <div className={`relative w-full min-h-[300px] md:min-h-[320px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${!featuredPost.image ? 'bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] border border-gray-100 dark:border-white/5 p-6 md:p-10 flex flex-col justify-center' : ''}`}>
                      {featuredPost.image ? (
                        <>
                          <div
                            className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${featuredPost.image})` }}
                            role="img"
                            aria-label={featuredPost.title}
                          />
                          {/* Overlay for Image */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                        </>
                      ) : (
                         /* Decorative Element for Text Only */
                         <div className="absolute top-6 left-6 text-[var(--color-primary)]/10 dark:text-white/5 text-8xl font-serif leading-none select-none rotate-180">
                           ”
                         </div>
                      )}

                      {/* Content */}
                      <div className={`${featuredPost.image ? 'absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white' : 'relative z-10'}`}>
                        <div className="flex items-center gap-3 mb-4">
                            <span className={`inline-block px-2.5 py-0.5 ${featuredPost.image ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] dark:bg-[var(--color-primary)] dark:text-white'} text-xs font-bold rounded-md`}>
                            الأحدث
                            </span>
                             <span className={`text-xs ${featuredPost.image ? 'text-gray-300' : 'text-[var(--color-text-secondary)]'}`}>
                                {new Date(featuredPost.publishedAt).toLocaleDateString("ar-KW", { day: "numeric", month: "long", year: "numeric" })}
                             </span>
                        </div>
                        
                        <h3 className={`text-xl md:text-3xl md:leading-tight font-bold mb-3 group-hover:text-[var(--color-primary)] dark:group-hover:text-[var(--color-primary-light)] transition-colors ${featuredPost.image ? 'text-white' : 'text-[var(--color-text-primary)] dark:text-white'}`}>
                          {featuredPost.title}
                        </h3>
                        <p className={`text-base leading-relaxed line-clamp-3 md:line-clamp-2 ${featuredPost.image ? 'text-gray-200' : 'text-[var(--color-text-secondary)]'}`}>
                          {featuredPost.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>

              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
}
