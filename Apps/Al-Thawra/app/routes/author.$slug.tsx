import { useLoaderData, useNavigation } from "react-router";
import { AuthorCategoryGroup } from "../components/AuthorCategoryFilter";
import { AuthorPageSkeleton } from "../components/skeletons";
import type { Post } from "../components/PostCard";
import axiosInstance from "../lib/axios";
import { cache, CacheTTL } from "../lib/cache";
import { ScrollAnimation } from "../components/ScrollAnimation";

interface AuthorProfile {
  userName: string;
  email: string;
  profileImageUrl?: string;
  aboutMe?: string;
  memberSince: string;
  lastSeen: string;
  socialAccounts?: Record<string, any>;
  posts: {
    pageSize: number;
    pageNumber: number;
    totalCount: number;
    totalPages: number;
    itemsFrom: number;
    itemsTo: number;
    items: any[];
  };
}

interface AuthorLoaderData {
  author: AuthorProfile;
  posts: Post[];
}

export async function loader({ params }: { params: { slug: string } }) {
  try {
    const username = params.slug;

    // Fetch author profile with posts using cache
    const author = await cache.getOrFetch<AuthorProfile>(
      `author-profile-${username}`,
      async () => {
        const profileResponse = await axiosInstance.get<AuthorProfile>(
          `/users/profile/${username}?UserName=${username}`
        );
        return profileResponse.data;
      },
      CacheTTL.MEDIUM
    );

    // Transform posts from author profile to match Post interface
    const posts: Post[] = (author.posts.items || []).map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      image: post.image,
      categoryName: post.categorySlug, // Use the actual categorySlug as the display name
      categorySlug: post.categorySlug,
      publishedAt: post.publishedAt,
      createdAt: post.publishedAt,
      authorName: author.userName,
      authorSlug: username,
      authorImage: author.profileImageUrl || "",
      description: post.description || "",
      status: "Published",
      language: "Arabic",
      postType: "Article",
      isFeatured: false,
      isBreaking: false,
      isSlider: false,
      isRecommended: false,
      viewsCount: post.viewsCount || 0,
      likesCount: post.likesCount || 0,
      createdBy: author.userName,
      authorId: username,
      ownerIsAuthor: true,
      categoryId: "",
      tags: [],
    }));

    return { author, posts };
  } catch (error) {
    console.error("Failed to load author data:", error);
    throw new Response("Author not found", { status: 404 });
  }
}

export default function AuthorPage() {
  const { author, posts } = useLoaderData<AuthorLoaderData>();
  const navigation = useNavigation();

  // Show loading skeleton during navigation
  if (navigation.state === "loading") {
    return <AuthorPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Author Header */}
      <ScrollAnimation animation="slideUp" duration={0.6}>
        <div className="bg-[var(--color-white)] border border-[var(--color-divider)] rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Author Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-primary)] shadow-lg bg-[var(--color-divider)]">
              {author.profileImageUrl ? (
                <img
                  src={author.profileImageUrl}
                  alt={author.userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, var(--color-primary-light), var(--color-primary))'}}>
                  <span className="text-4xl font-bold text-[var(--color-text-light)]">
                    {author.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Author Info */}
          <div className="flex-1 text-center md:text-right">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
              {author.userName}
            </h1>
            <a
              href={`mailto:${author.email}`}
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors mb-3 inline-block"
            >
              {author.email}
            </a>
            {author.aboutMe && (
              <p className="text-[var(--color-text-secondary)] text-lg mb-4 max-w-2xl">
                {author.aboutMe}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[var(--color-primary)]">
                  {posts.length}
                </span>
                <span className="text-[var(--color-text-secondary)]">مقال</span>
              </div>
              <div className="w-px h-6 bg-[var(--color-divider)]"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-text-secondary)]">
                  منذ {new Date(author.memberSince).toLocaleDateString("ar-EG")}
                </span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </ScrollAnimation>

      {/* Author Posts Grouped by Category */}
      <ScrollAnimation animation="slideUp" delay={0.2}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            مقالات {author.userName} - {posts.length} مقال
          </h2>
        </div>
      </ScrollAnimation>
      
      <ScrollAnimation animation="slideUp" delay={0.3}>
        <AuthorCategoryGroup posts={posts} authorName={author.userName} />
      </ScrollAnimation>
    </div>
  );
}
