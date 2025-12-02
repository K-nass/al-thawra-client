import type { LoaderFunctionArgs } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
  const { issueNumber } = params;

  if (!issueNumber) {
    throw new Response("Issue number parameter is required", { status: 400 });
  }

  try {
    // Fetch all magazines to find the one with matching issue number
    const apiUrl = `${process.env.API_BASE_URL || "https://new-cms-dev.runasp.net/api/v1"}/magazines?PageSize=100&PageNumber=1`;
    
    const metadataResponse = await fetch(apiUrl);
    if (!metadataResponse.ok) {
      throw new Response("Failed to fetch magazines", { status: 500 });
    }

    const data = await metadataResponse.json();
    const magazine = data.items.find((m: any) => m.issueNumber === issueNumber);
    
    if (!magazine) {
      throw new Response("Magazine not found", { status: 404 });
    }
    
    // Fetch the actual PDF from the backend
    const pdfResponse = await fetch(magazine.pdfUrl);
    if (!pdfResponse.ok) {
      throw new Response("PDF not found", { status: 404 });
    }

    // Get the PDF as a buffer
    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Return the PDF with proper headers (no Content-Disposition to avoid Arabic character issues)
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error proxying PDF:", error);
    throw new Response("Failed to load PDF", { status: 500 });
  }
}
