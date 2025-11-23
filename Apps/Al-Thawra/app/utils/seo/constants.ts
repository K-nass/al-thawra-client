/**
 * SEO Constants
 * Centralized SEO configuration for the application
 */

export const SEO_CONFIG = {
  // Site Information
  siteName: "الثورة",
  siteNameEn: "Al-Thawra",
  tagline: "أخبار ومقالات عربية موثوقة",
  
  // URLs (will be updated for production)
  baseUrl: typeof window !== 'undefined' 
    ? window.location.origin 
    : "http://localhost:5173",
  
  // Default Meta
  defaultTitle: "الثورة | أخبار ومقالات عربية موثوقة",
  defaultDescription: "موقع الثورة - مصدرك الموثوق للأخبار العربية، المقالات، التحليلات السياسية، والآراء",
  
  // Open Graph
  ogImage: "/og-default.jpg", // Default OG image
  ogType: "website",
  ogLocale: "ar_AR",
  
  // Twitter
  twitterCard: "summary_large_image",
  twitterSite: "@althawra", // Update with actual handle
  
  // Organization Info (for JSON-LD)
  organization: {
    name: "الثورة",
    url: typeof window !== 'undefined' 
      ? window.location.origin 
      : "http://localhost:5173",
    logo: "/logo.png",
    sameAs: [
      // Add social media URLs when available
      // "https://facebook.com/althawra",
      // "https://twitter.com/althawra",
    ],
  },
} as const;

export const TITLE_SEPARATOR = " | ";
export const MAX_TITLE_LENGTH = 60;
export const MAX_DESCRIPTION_LENGTH = 160;
