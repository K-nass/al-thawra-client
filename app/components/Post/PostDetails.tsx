import type { ReactNode } from "react";
import { PostHeader } from "./PostHeader";
import { PostImage } from "./PostImage";
import { PostContent } from "./PostContent";
import { CommentsSection } from "./CommentsSection";
import { RelatedPosts } from "./RelatedPosts";
import { ScrollAnimation } from "../ScrollAnimation";

interface PostDetailsProps {
  // Header props
  category: string;
  categoryHref?: string;
  title: string;
  date: string;
  commentsCount: number;

  // Image props
  imageSrc: string;
  imageAlt: string;

  // Content props
  content: string;

  // Comments section props
  onRegister?: () => void;
  onLogin?: () => void;
  registerHref?: string;
  loginHref?: string;

  // Related posts
  relatedPosts?: ReactNode;
  relatedPostsTitle?: string;

  // Optional extra content before comments (e.g. audio player)
  extraContentBeforeComments?: ReactNode;
}

export function PostDetails({
  category,
  categoryHref,
  title,
  date,
  commentsCount,
  imageSrc,
  imageAlt,
  content,
  onRegister,
  onLogin,
  registerHref,
  loginHref,
  relatedPosts,
  relatedPostsTitle,
  extraContentBeforeComments,
}: PostDetailsProps) {
  return (
    <section className="lg:col-span-2">
      <article className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: "var(--color-background-light)", color: "var(--color-text-primary)" }}>
        {/* Article Header */}
        <ScrollAnimation animation="slideUp" duration={0.6}>
          <PostHeader
          category={category}
          categoryHref={categoryHref}
          title={title}
          date={date}
          commentsCount={commentsCount}
          />
        </ScrollAnimation>

        {/* Article Image */}
        {imageSrc && (
          <ScrollAnimation animation="scale" duration={0.7} delay={0.1}>
            <PostImage src={imageSrc} alt={imageAlt} />
          </ScrollAnimation>
        )}

        {/* Article Content */}
        <ScrollAnimation animation="fade" delay={0.2}>
          <PostContent content={content} />
        </ScrollAnimation>

        {/* Comments Display */}

        {/* Related Posts */}
        {relatedPosts && (
          <RelatedPosts title={relatedPostsTitle}>
            {relatedPosts}
          </RelatedPosts>
        )}

        {/* Extra content before comments (e.g. audio player) */}
        {extraContentBeforeComments}

        {/* Comments Section - Login/Register Prompt */}
        <CommentsSection
          onRegister={onRegister}
          onLogin={onLogin}
          registerHref={registerHref}
          loginHref={loginHref}
        />
      </article>
    </section>
  );
}
