import { useLoaderData } from "react-router";
import { magazinesService, type Magazine } from "../services/magazinesService";
import { cache, CacheTTL } from "../lib/cache";
import { generateMetaTags } from "~/utils/seo";
import { EmptyState } from "../components/EmptyState";
import { MagazineViewer } from "../components/MagazineViewer";

// Loader function to fetch magazine by issue number
export async function loader({ params }: { params: { issueNumber: string } }) {
  const { issueNumber } = params;

  try {
    // Fetch magazine from cache or API
    const magazine = await cache.getOrFetch(
      `magazine:issue:${issueNumber}`,
      () => magazinesService.getMagazineByIssueNumber(issueNumber),
      CacheTTL.MEDIUM
    );

    if (!magazine) {
      throw new Response("Magazine not found", { status: 404 });
    }

    return { magazine };
  } catch (error) {
    console.error("Error loading magazine:", error);
    throw new Response("Magazine not found", { status: 404 });
  }
}

// Meta tags for SEO
export function meta({ data }: { data?: { magazine?: Magazine } }) {
  if (!data?.magazine) {
    return generateMetaTags({
      title: "العدد غير موجود",
      description: "لم يتم العثور على العدد المطلوب",
      url: "/magazines",
    });
  }

  const { magazine } = data;

  return generateMetaTags({
    title: `الثورة - العدد ${magazine.issueNumber}`,
    description: `عدد جريدة الثورة رقم ${magazine.issueNumber}`,
    image: magazine.thumbnailUrl,
    url: `/magazines/issue/${magazine.issueNumber}`,
    type: "article",
  });
}

// Disable layout (no header, sidebar, footer) for full-width PDF viewer
export const handle = {
  disableLayout: true,
};

export default function MagazineIssuePage() {
  const { magazine } = useLoaderData<typeof loader>();

  if (!magazine) {
    return (
      <EmptyState
        title="العدد غير موجود"
        description="لم يتم العثور على العدد المطلوب"
        showRefresh={false}
      />
    );
  }

  return <MagazineViewer pdfUrl={magazine.pdfUrl} issueNumber={magazine.issueNumber} />;
}
