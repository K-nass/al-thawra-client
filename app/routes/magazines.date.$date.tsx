import { useLoaderData } from "react-router";
import { magazinesService, type Magazine } from "../services/magazinesService";
import { cache, CacheTTL } from "../lib/cache";
import { generateMetaTags } from "~/utils/seo";
import { EmptyState } from "../components/EmptyState";
import { MagazineViewer } from "~/components/MagazineViewer/index";

// Loader function to fetch magazine by date
export async function loader({ params }: { params: { date: string } }) {
  const { date } = params;

  try {
    // Fetch magazine from cache or API
    const magazine = await cache.getOrFetch(
      `magazine:date:${date}`,
      () => magazinesService.getMagazineByDate(date),
      CacheTTL.MEDIUM
    );

    if (!magazine) {
      console.error(`[Magazine Loader] No magazine found for date: ${date}`);
      throw new Response("Magazine not found", { status: 404 });
    }

    // Log the magazine data for debugging
    console.log(`[Magazine Loader] Magazine found:`, {
      issueNumber: magazine.issueNumber,
      pdfUrl: magazine.pdfUrl,
      thumbnailUrl: magazine.thumbnailUrl,
      createdAt: magazine.createdAt,
    });

    // Validate PDF URL
    if (!magazine.pdfUrl) {
      console.error(`[Magazine Loader] Magazine has no PDF URL`);
      throw new Response("Magazine PDF URL is missing", { status: 500 });
    }

    // Test if PDF URL is accessible (HEAD request)
    try {
      console.log(`[Magazine Loader] Testing PDF URL accessibility: ${magazine.pdfUrl}`);
      const pdfTest = await fetch(magazine.pdfUrl, { 
        method: 'HEAD',
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        }
      });
      console.log(`[Magazine Loader] PDF URL test result: ${pdfTest.status} ${pdfTest.statusText}`);
      
      if (!pdfTest.ok) {
        console.warn(`[Magazine Loader] PDF URL is not accessible (${pdfTest.status}), but continuing anyway`);
      }
    } catch (testError) {
      console.warn(`[Magazine Loader] Failed to test PDF URL:`, testError);
    }

    return { magazine, date };
  } catch (error) {
    console.error(`[Magazine Loader] Error loading magazine:`, error);
    throw new Response("Magazine not found", { status: 404 });
  }
}

// Meta tags for SEO
export function meta({ data }: { data?: { magazine?: Magazine; date?: string } }) {
  if (!data?.magazine) {
    return generateMetaTags({
      title: "العدد غير موجود",
      description: "لم يتم العثور على العدد المطلوب",
      url: "/magazines",
    });
  }

  const { magazine, date } = data;
  const formattedDate = new Date(date!).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return generateMetaTags({
    title: `الثورة - العدد ${magazine.issueNumber}`,
    description: `عدد جريدة الثورة رقم ${magazine.issueNumber} - ${formattedDate}`,
    image: magazine.thumbnailUrl,
    url: `/magazines/date/${date}`,
    type: "article",
  });
}

// Disable layout (no header, sidebar, footer) for full-width PDF viewer
export const handle = {
  disableLayout: true,
};

export default function MagazineDatePage() {
  const { magazine, date } = useLoaderData<typeof loader>();

  if (!magazine) {
    return (
      <EmptyState
        title="العدد غير موجود"
        description="لم يتم العثور على العدد المطلوب"
        showRefresh={false}
      />
    );
  }

  // Show a warning in development if PDF URL might not be accessible
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    console.warn('[MagazineViewer] Loading PDF:', magazine.pdfUrl);
    console.warn('[MagazineViewer] If the PDF fails to load, the file may not exist on the server.');
  }

  return <MagazineViewer pdfUrl={magazine.pdfUrl} issueNumber={magazine.issueNumber} date={date} />;
}
