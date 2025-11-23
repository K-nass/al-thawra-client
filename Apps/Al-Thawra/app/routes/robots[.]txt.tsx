import type { LoaderFunctionArgs } from "react-router";

// Base URL - will be replaced with production domain later
const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

export async function loader({ request }: LoaderFunctionArgs) {
  const robotsTxt = `# Robots.txt for Al-Thawra (الثورة)
# Generated: ${new Date().toISOString()}

# Allow all crawlers by default
User-agent: *
Allow: /

# Disallow private/auth pages
Disallow: /admin
Disallow: /profile
Disallow: /cart
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /logout

# Disallow search results (prevent duplicate content)
Disallow: /search?*
Disallow: /search

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl-delay for specific bots (optional)
User-agent: Googlebot
Crawl-delay: 0
Allow: /

User-agent: Bingbot
Crawl-delay: 1
Allow: /

# Block bad bots (optional - uncomment if needed)
# User-agent: AhrefsBot
# Disallow: /

# User-agent: SemrushBot
# Disallow: /
`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400", // Cache for 24 hours
    },
  });
}
