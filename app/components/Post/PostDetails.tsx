import type { ReactNode } from "react";
import { PostHeader } from "./PostHeader";
import { PostMeta } from "./PostHeader";
import { PostImage } from "./PostImage";
import { PostContent } from "./PostContent";
import { RelatedPosts } from "./RelatedPosts";
import { ScrollAnimation } from "../ScrollAnimation";

interface PostDetailsProps {
  // Header props
  category: string;
  categoryHref?: string;
  title: string;
  date: string;
  commentsCount: number;
  authorName?: string;
  authorHref?: string;

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

  // Author card rendered after the header
  authorCard?: ReactNode;
}

export function PostDetails({
  category,
  categoryHref,
  title,
  date,
  commentsCount,
  authorName,
  authorHref,
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
  authorCard,
}: PostDetailsProps) {
  return (
    <section className="min-h-screen">
      <article className="max-w-3xl mx-auto px-4">
        {/* Article Header */}
        <ScrollAnimation animation="slideUp" duration={0.6} immediate={true}>
          <PostHeader
            category={category}
            categoryHref={categoryHref}
            title={title}
          />
        </ScrollAnimation>

        {/* Author Card */}
        {authorCard}

        {/* Meta row: after author card dashed border */}
        <PostMeta
          date={date}
          commentsCount={commentsCount}
          authorName={authorName}
          authorHref={authorHref}
          title={title}
        />

        {/* Article Image */}
        {imageSrc && imageSrc !== "null" && imageSrc !== "undefined" && (
          <ScrollAnimation animation="scale" duration={0.7} delay={0.1}>
            <PostImage src={imageSrc} alt={imageAlt} />
          </ScrollAnimation>
        )}

        {/* Article Content */}
        <ScrollAnimation animation="fade" delay={0.2}>
          <PostContent content={content} />
        </ScrollAnimation>

        {/* Extra content before comments (e.g. audio player) */}
        {extraContentBeforeComments}
      </article>

      {/* Related Posts - Full Width */}
      {relatedPosts && (
        <RelatedPosts title={relatedPostsTitle}>
          {relatedPosts}
        </RelatedPosts>
      )}
    </section>
  );
}
