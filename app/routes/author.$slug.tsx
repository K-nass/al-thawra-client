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
      summary: post.summary || "",
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
    throw new Response("Author not found", { status: 404 });
  }
}

import { generateMetaTags, generatePersonSchema } from "~/utils/seo";
import type { Route } from "./+types/author.$slug";

export function meta({ data, params }: Route.MetaArgs) {
  if (!data) {
    return [
      { title: "كاتب غير موجود | الثورة" },
      { name: "robots", content: "noindex" },
    ];
  }

  const { author, posts } = data as AuthorLoaderData;
  
  return [
    ...generateMetaTags({
      title: author.userName,
      description: author.aboutMe || `اقرأ جميع مقالات ${author.userName} على موقع الثورة. ${posts.length} مقال منشور`,
      image: author.profileImageUrl,
      url: `/author/${params.slug}`,
      type: "profile",
    }),
    {
      "script:ld+json": generatePersonSchema({
        name: author.userName,
        slug: params.slug || "",
        bio: author.aboutMe,
        image: author.profileImageUrl,
        socialAccounts: author.socialAccounts,
      }),
    },
  ];
}

export default function AuthorPage() {
  const { author, posts } = useLoaderData<AuthorLoaderData>();
  const navigation = useNavigation();

  // Show loading skeleton during navigation
  if (navigation.state === "loading") {
    return <AuthorPageSkeleton />;
  }

  return (
    <div>
      {/* Author Header */}
      <ScrollAnimation animation="slideUp" duration={0.6}>
        <div>
        <div>
          {/* Author Avatar */}
          <div>
            <div>
              {author.profileImageUrl ? (
                <img
                  src={author.profileImageUrl}
                  alt={author.userName}
                />
              ) : (
                <div>
                  <span>
                    {author.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Author Info */}
          <div>
            <h1>
              {author.userName}
            </h1>
            <a
              href={`mailto:${author.email}`}
            >
              {author.email}
            </a>
            {author.aboutMe && (
              <p>
                {author.aboutMe}
              </p>
            )}

            {/* Stats */}
            <div>
              <div>
                <span>
                  {posts.length}
                </span>
                <span>مقال</span>
              </div>
              <div></div>
              <div>
                <span>
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
        <div>
          <h2>
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
