import { useLoaderData } from "react-router";
import { magazinesService, type Magazine } from "../services/magazinesService";
import { cache, CacheTTL } from "../lib/cache";
import { generateMetaTags } from "~/utils/seo";
import { EmptyState } from "../components/EmptyState";
import { MagazineViewer } from "../components/MagazineViewer";

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
      throw new Response("Magazine not found", { status: 404 });
    }

    return { magazine, date };
  } catch (error) {
    console.error("Error loading magazine:", error);
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

  return <MagazineViewer pdfUrl={magazine.pdfUrl} issueNumber={magazine.issueNumber} date={date} />;
}
