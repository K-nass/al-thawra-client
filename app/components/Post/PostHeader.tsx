import { Check, Facebook, Link2, Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

interface PostHeaderProps {
  category: string;
  categoryHref?: string;
  title: string;
  date: string;
  commentsCount: number;
  authorName?: string;
  authorHref?: string;
}

export function PostHeader({
  category,
  categoryHref = "#",
  title,
  date,
  commentsCount,
  authorName,
  authorHref,
}: PostHeaderProps) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = title;
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="mb-6">
      {/* Category Badge */}
      <a
        href={categoryHref}
        className="inline-block text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors mb-3"
      >
        {category}
      </a>

      {/* Article Title - large serif style */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight font-serif">
        {title}
      </h1>

      {/* Dashed separator */}
      <hr className="border-dashed border-gray-300 mb-4" />

      {/* Meta row: date left, share actions right */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 pb-4 mb-4">
         {/* Right: share actions */}
        <div className="flex items-center gap-4 text-sm">
          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-gray-900 transition-colors"
            aria-label="Share on Facebook"
          >
            <Facebook className="w-3.5 h-3.5" />
            <span>Facebook</span>
          </a>

          {/* X / Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-gray-900 transition-colors"
            aria-label="Share on X"
          >
            {/* X logo */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Post</span>
          </a>
          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-gray-900 transition-colors"
            aria-label="Share on WhatsApp"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Whatsapp</span>
          </a>

          {/* Copy link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 hover:text-gray-900 transition-colors cursor-pointer"
            aria-label="Copy link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Link copied</span>
              </>
            ) : (
              <>
                <Link2 className="w-3.5 h-3.5" />
                <span>Copy link</span>
              </>
            )}
          </button>
        </div>
        {/* Left: date + author + comments */}
        <div className="flex flex-wrap items-center gap-3">
          <span>{date}</span>

          {authorName && (
            <>
              <span className="text-gray-300">|</span>
              <span className="font-serif italic text-gray-700">
                —{" "}
                {authorHref ? (
                  <a href={authorHref} className="underline hover:text-gray-900 transition-colors">
                    {authorName}
                  </a>
                ) : (
                  <span className="underline">{authorName}</span>
                )}
              </span>
            </>
          )}

          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{commentsCount} تعليق</span>
          </div>
        </div>
      </div>
    </div>
  );
}
