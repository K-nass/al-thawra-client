import type { LoaderFunctionArgs } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
  const { date } = params;

  if (!date) {
    throw new Response("Date parameter is required", { status: 400 });
  }

  try {
    // Fetch the magazine metadata to get the PDF URL
    const apiUrl = `${process.env.API_BASE_URL || "https://new-cms-dev.runasp.net/api/v1"}/magazines/by-date?Date=${date}`;
    
    const metadataResponse = await fetch(apiUrl);
    if (!metadataResponse.ok) {
      throw new Response("Magazine not found", { status: 404 });
    }

    const magazine = await metadataResponse.json();
    
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
