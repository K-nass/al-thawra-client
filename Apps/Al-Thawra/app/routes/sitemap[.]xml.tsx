import type { LoaderFunctionArgs } from "react-router";
import { postsService } from "~/services/postsService";
import { categoriesService } from "~/services/categoriesService";

// Base URL - will be replaced with production domain later
const BASE_URL = process.env.BASE_URL || "http://localhost:5173";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Fetch all data for sitemap
    const [categories, featuredPosts] = await Promise.all([
      categoriesService.getMenuCategories("Arabic"),
      postsService.getFeaturedPosts(100, "Article"), // Get more posts for sitemap
    ]);

    // Build sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>

  <!-- Static Pages -->
  <url>
    <loc>${BASE_URL}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${BASE_URL}/tv</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${BASE_URL}/magazines</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${BASE_URL}/writers-opinions</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Categories -->
${categories
  .map(
    (category) => `  <url>
    <loc>${BASE_URL}/category/${category.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`
  )
  .join("\n")}

  <!-- Articles -->
${featuredPosts
  .map(
    (post) => `  <url>
    <loc>${BASE_URL}/posts/categories/${post.categorySlug}/articles/${post.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <lastmod>${post.publishedAt || post.createdAt}</lastmod>
    ${
      post.image
        ? `<image:image>
      <image:loc>${post.image}</image:loc>
      <image:title>${escapeXml(post.title)}</image:title>
    </image:image>`
        : ""
    }
  </url>`
  )
  .join("\n")}

</urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "X-Robots-Tag": "noindex", // Don't index the sitemap itself
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    
    // Return minimal sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(fallbackSitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  }
}

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
