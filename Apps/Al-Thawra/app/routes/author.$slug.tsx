import { useParams, useNavigation } from "react-router";
import { PostsGrid } from "../components/PostsGrid";
import { PostsGridSkeleton } from "../components/LoadingSkeleton";
import type { Post } from "../components/PostCard";

// Dummy author data
const dummyAuthor = {
  id: "1",
  name: "أميرة بن طرف",
  email: "Amira@alqabas.com",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  bio: "كاتبة وصحفية متخصصة في الشؤون الاجتماعية والتعليمية",
  postsCount: 156,
  followersCount: 12500,
};

// Dummy posts data


export default function AuthorPage() {
  const params = useParams();
  const navigation = useNavigation();
  const authorSlug = params.slug;

  // Show loading skeleton during navigation
  if (navigation.state === "loading") {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-3">
              <div className="h-8 w-48 bg-gray-200 rounded"></div>
              <div className="h-4 w-64 bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
        <PostsGridSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Author Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Author Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--color-primary)] shadow-lg">
              <img
                src={dummyAuthor.avatar}
                alt={dummyAuthor.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Author Info */}
          <div className="flex-1 text-center md:text-right">
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
              {dummyAuthor.name}
            </h1>
            <a
              href={`mailto:${dummyAuthor.email}`}
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors mb-3 inline-block"
            >
              {dummyAuthor.email}
            </a>
            <p className="text-[var(--color-text-secondary)] text-lg mb-4 max-w-2xl">
              {dummyAuthor.bio}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center md:justify-start gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[var(--color-primary)]">
                  {dummyAuthor.postsCount}
                </span>
                <span className="text-[var(--color-text-secondary)]">مقال</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[var(--color-primary)]">
                  {dummyAuthor.followersCount.toLocaleString()}
                </span>
                <span className="text-[var(--color-text-secondary)]">متابع</span>
              </div>
            </div>
          </div>

          {/* Follow Button */}
          <div className="flex items-start">
            <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium shadow-md">
              متابعة +
            </button>
          </div>
        </div>
      </div>

      {/* Author Posts */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
          مقالات {dummyAuthor.name}
        </h2>
        <PostsGrid posts={[]} />
      </div>
    </div>
  );
}
