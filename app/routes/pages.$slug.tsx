import { useLoaderData } from "react-router";
import { pagesService } from "~/services/pagesService";
import { cache, CacheTTL } from "~/lib/cache";
import { generateMetaTags } from "~/utils/seo";
import { ScrollAnimation } from "~/components/ScrollAnimation";

// Loader function for server-side data fetching
export async function loader({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  
  if (!slug) {
    throw new Response("Page slug required", { status: 404 });
  }

  try {
    // Fetch page with caching
    const page = await cache.getOrFetch(
      `page:${slug}`,
      () => pagesService.getPageBySlug(slug),
      CacheTTL.LONG
    );
    
    return { page };
  } catch (error: any) {
    throw new Response("Page not found", { status: 404 });
  }
}

// Meta tags for SEO
export function meta({ data }: { data?: { page?: any } }) {
  if (!data?.page) {
    return [
      { title: "صفحة غير موجودة | الثورة" },
      { name: "robots", content: "noindex" },
    ];
  }

  const page = data.page;
  
  return generateMetaTags({
    title: page.title,
    description: page.description,
    url: `/pages/${page.slug}`,
    type: "website",
  });
}

export default function PageDetailPage() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <div>
      {/* Breadcrumb */}
      {page.showBreadcrumb && (
        <ScrollAnimation animation="fade" once={true}>
          <div>
            <a href="/">
              الرئيسية
            </a>
            <span>/</span>
            <span>
              {page.title}
            </span>
          </div>
        </ScrollAnimation>
      )}

      {/* Page Content */}
      <ScrollAnimation animation="slideUp" duration={0.6} once={true}>
        <div>
          {/* Page Title */}
          {page.showTitle && (
            <h1>
              {page.title}
            </h1>
          )}

          {/* Page Description */}
          {page.description && (
            <p>
              {page.description}
            </p>
          )}

          {/* Page Content (HTML) */}
          <div
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          {/* Page Metadata */}
          <div>
            <span>
              آخر تحديث: {new Date(page.updatedAt).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
}
