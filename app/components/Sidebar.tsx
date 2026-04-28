import { Link } from "react-router";
import type { Post } from "../services/postsService";
import type { ChiefEditor } from "../services/userService";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "./ScrollAnimation";
import { Image, User } from "lucide-react";
import { cleanPlainText } from "../utils/arabicTextUtils";
import { buildArticlePath } from "~/lib/articleRoutes";

interface SidebarProps {
  trendingPosts: Post[];
  chiefEditor: ChiefEditor | null;
  chiefEditorPosts: Post[];
}
export function Sidebar({ trendingPosts, chiefEditor, chiefEditorPosts }: SidebarProps) {
  return (
    <aside>
      {/* Editor's Article Section - Only show if we have chief editor data */}
      {chiefEditor && chiefEditorPosts.length > 0 && (
        <ScrollAnimation animation="slideLeft" once={false}>
          <div>
            <h3>
              مقالات رئيس التحرير
            </h3>
            <span>
              {chiefEditor.avatarUrl ? (
                <img
                  src={chiefEditor.avatarUrl}
                  alt={chiefEditor.slug || ""}
                />
              ) : (
                 <div>
                    <User />
                 </div>
              )}
              <span>
                {chiefEditor.fullName}
              </span>
            </span>

            {/* Featured post (first one) */}
            <Link
              to={buildArticlePath(chiefEditorPosts[0])}
            >
              <div>
                {chiefEditorPosts[0].image ? (
                  <img
                    src={chiefEditorPosts[0].image}
                    alt={chiefEditorPosts[0].title}
                  />
                ) : (
                  <div>
                    <Image />
                  </div>
                )}
              </div>
              <h4>
                {chiefEditorPosts[0].title}
              </h4>
              <p>
                {cleanPlainText(chiefEditorPosts[0].summary).slice(0, 50) + "..."}
              </p>
            </Link>

            {/* Additional posts as numbered list */}
            {chiefEditorPosts.length > 1 && (
              <div>
                 <div>
                  {chiefEditorPosts.slice(1, 6).map((post, index) => (
                    <Link
                      key={post.id}
                      to={buildArticlePath(post)}
                    >
                      <span>
                        {index + 1}
                      </span>
                      <div>
                        <h4>
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                 </div>
                {chiefEditor.slug && (
                  <Link
                    to={`/writers-opinions/${chiefEditor.slug}`}
                  >
                    عرض الكل ←
                  </Link>
                )}
              </div>
            )}
          </div>
        </ScrollAnimation>
      )}
    </aside>
  );
}
