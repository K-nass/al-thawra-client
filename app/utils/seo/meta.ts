/**
 * Meta Tag Generators
 * Utilities for generating consistent meta tags
 */

import { SEO_CONFIG, TITLE_SEPARATOR, MAX_DESCRIPTION_LENGTH } from "./constants";
import { getCanonicalUrl } from "./canonical";

export interface MetaTagsOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
  
  // Article-specific
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

/**
 * Generate complete meta tags for a page
 */
export function generateMetaTags(options: MetaTagsOptions) {
  const {
    title,
    description = SEO_CONFIG.defaultDescription,
    image = SEO_CONFIG.ogImage,
    url,
    type = "website",
    noindex = false,
    publishedTime,
    modifiedTime,
    author,
    section,
    tags,
  } = options;

  // Build full title
  const fullTitle = title 
    ? `${title}${TITLE_SEPARATOR}${SEO_CONFIG.siteName}`
    : SEO_CONFIG.defaultTitle;

  // Truncate description if needed
  const truncatedDescription = description.length > MAX_DESCRIPTION_LENGTH
    ? description.substring(0, MAX_DESCRIPTION_LENGTH - 3) + "..."
    : description;

  // Build canonical URL
  const canonicalUrl = url ? getCanonicalUrl(url) : SEO_CONFIG.baseUrl;

  // Ensure image is absolute URL
  const absoluteImage = image.startsWith("http") 
    ? image 
    : `${SEO_CONFIG.baseUrl}${image}`;

  const metaTags: Array<{ name?: string; property?: string; content: string }> = [
    // Basic meta
    { name: "description", content: truncatedDescription },
    
    // Open Graph
    { property: "og:title", content: title || SEO_CONFIG.defaultTitle },
    { property: "og:description", content: truncatedDescription },
    { property: "og:image", content: absoluteImage },
    { property: "og:url", content: canonicalUrl },
    { property: "og:type", content: type },
    { property: "og:site_name", content: SEO_CONFIG.siteName },
    { property: "og:locale", content: SEO_CONFIG.ogLocale },
    
    // Twitter Card
    { name: "twitter:card", content: SEO_CONFIG.twitterCard },
    { name: "twitter:title", content: title || SEO_CONFIG.defaultTitle },
    { name: "twitter:description", content: truncatedDescription },
    { name: "twitter:image", content: absoluteImage },
  ];

  // Add Twitter site if configured
  if (SEO_CONFIG.twitterSite) {
    metaTags.push({ name: "twitter:site", content: SEO_CONFIG.twitterSite });
  }

  // Add article-specific meta
  if (type === "article") {
    if (publishedTime) {
      metaTags.push({ property: "article:published_time", content: publishedTime });
    }
    if (modifiedTime) {
      metaTags.push({ property: "article:modified_time", content: modifiedTime });
    }
    if (author) {
      metaTags.push({ property: "article:author", content: author });
    }
    if (section) {
      metaTags.push({ property: "article:section", content: section });
    }
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        metaTags.push({ property: "article:tag", content: tag });
      });
    }
  }

  // Add robots meta if noindex
  if (noindex) {
    metaTags.push({ name: "robots", content: "noindex, follow" });
  }

  return [
    { title: fullTitle },
    ...metaTags,
  ];
}
