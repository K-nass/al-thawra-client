/**
 * JSON-LD Schema Generators
 * Generate structured data for search engines
 */

import { SEO_CONFIG } from "./constants";

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SEO_CONFIG.organization.name,
    url: SEO_CONFIG.organization.url,
    logo: {
      "@type": "ImageObject",
      url: `${SEO_CONFIG.baseUrl}${SEO_CONFIG.organization.logo}`,
    },
    sameAs: SEO_CONFIG.organization.sameAs,
  };
}

/**
 * Generate NewsArticle schema
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  authorSlug?: string;
  categoryName: string;
  content: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Person",
      name: article.authorName,
      ...(article.authorSlug && {
        url: `${SEO_CONFIG.baseUrl}/author/${article.authorSlug}`,
      }),
    },
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${SEO_CONFIG.baseUrl}${SEO_CONFIG.organization.logo}`,
      },
    },
    articleSection: article.categoryName,
    articleBody: article.content,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  };
}

/**
 * Generate Person schema (for author pages)
 */
export function generatePersonSchema(author: {
  name: string;
  slug: string;
  bio?: string;
  image?: string;
  socialAccounts?: Record<string, string>;
}) {
  const sameAs = author.socialAccounts 
    ? Object.values(author.socialAccounts).filter(Boolean)
    : [];

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${SEO_CONFIG.baseUrl}/author/${author.slug}`,
    ...(author.bio && { description: author.bio }),
    ...(author.image && { image: author.image }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/**
 * Generate CollectionPage schema (for category pages)
 */
export function generateCollectionPageSchema(category: {
  name: string;
  slug: string;
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    url: `${SEO_CONFIG.baseUrl}/category/${category.slug}`,
    ...(category.description && { description: category.description }),
  };
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SEO_CONFIG.baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}
