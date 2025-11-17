import { useLoaderData, useNavigation } from "react-router";
import { PostsGrid } from "../components/PostsGrid";
import { AuthorPageSkeleton } from "../components/skeletons";
import type { Post } from "../components/PostCard";
import axiosInstance from "../lib/axios";

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

    // Fetch author profile with posts
    const profileResponse = await axiosInstance.get<AuthorProfile>(
      `/users/profile/${username}?UserName=${username}`
    );
    const author = profileResponse.data;

    // Transform posts from author profile to match Post interface
    const posts: Post[] = (author.posts.items || []).map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      image: post.image,
      categoryName: post.categoryName || "",
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
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Author Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-primary)] shadow-lg bg-gray-100">
              {author.profileImageUrl ? (
                <img
                  src={author.profileImageUrl}
                  alt={author.userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                  <span className="text-4xl font-bold text-white">
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
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--color-text-secondary)]">
                  منذ {new Date(author.memberSince).toLocaleDateString("ar-EG")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author Posts */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
          مقالات {author.userName}
        </h2>
        <PostsGrid posts={posts} showCategoryHeader={false} />
      </div>
    </div>
  );
}
