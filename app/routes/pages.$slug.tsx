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
    console.error(`Error loading page ${slug}:`, error.response?.data || error.message);
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
    <div className="space-y-6">
      {/* Breadcrumb */}
      {page.showBreadcrumb && (
        <ScrollAnimation animation="fade" once={true}>
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <a href="/" className="hover:text-blue-400 transition-colors">
              الرئيسية
            </a>
            <span>/</span>
            <span className="text-[var(--color-text-primary)] font-medium">
              {page.title}
            </span>
          </div>
        </ScrollAnimation>
      )}

      {/* Page Content */}
      <ScrollAnimation animation="slideUp" duration={0.6} once={true}>
        <div className="bg-[var(--color-white)] rounded-2xl p-8 shadow-sm border border-[var(--color-divider)]">
          {/* Page Title */}
          {page.showTitle && (
            <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-6">
              {page.title}
            </h1>
          )}

          {/* Page Description */}
          {page.description && (
            <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
              {page.description}
            </p>
          )}

          {/* Page Content (HTML) */}
          <div 
            className="prose prose-lg max-w-none
              prose-headings:text-[var(--color-text-primary)]
              prose-p:text-[var(--color-text-primary)]
              prose-a:text-blue-500 prose-a:hover:text-blue-400
              prose-strong:text-[var(--color-text-primary)]
              prose-ul:text-[var(--color-text-primary)]
              prose-ol:text-[var(--color-text-primary)]
              prose-li:text-[var(--color-text-primary)]"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />

          {/* Page Metadata */}
          <div className="mt-8 pt-6 border-t border-[var(--color-divider)] flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
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
