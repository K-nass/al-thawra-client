import type { LoaderFunctionArgs } from "react-router";

const ALLOWED_HOSTS = new Set(["www.ijirmf.com", "pdfobject.com", "elthoura.tryasp.net"]);

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const target = url.searchParams.get("url");

  if (!target) {
    throw new Response("Missing url parameter", { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    throw new Response("Invalid url parameter", { status: 400 });
  }

  if (parsed.protocol !== "https:") {
    throw new Response("Only https URLs are allowed", { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    throw new Response("Host not allowed", { status: 403 });
  }

  try {
    // The URL might have spaces or special characters that need proper encoding
    // Try multiple encoding strategies since the server might expect different formats
    const urlsToTry = [
      parsed.toString(), // Original
      // Try with different date formats
      parsed.toString().replace(/Dec 4, 2025\.pdf$/, 'Dec%204,%202025.pdf'),
      parsed.toString().replace(/Dec 4, 2025\.pdf$/, 'Dec%204%2C%202025.pdf'),
      parsed.toString().replace(/Dec 4, 2025\.pdf$/, 'Dec+4,+2025.pdf'),
      // Try without spaces
      parsed.toString().replace(/Dec 4, 2025\.pdf$/, 'Dec4,2025.pdf'),
      // Try with underscores
      parsed.toString().replace(/Dec 4, 2025\.pdf$/, 'Dec_4,_2025.pdf'),
      // Try with dashes
      parsed.toString().replace(/Dec 4, 2025\.pdf$/, 'Dec-4,-2025.pdf'),
    ];
    
    console.log(`[PDF Proxy] Original URL: ${target}`);
    console.log(`[PDF Proxy] Trying ${urlsToTry.length} URL variations...`);
    
    let pdfResponse: Response | null = null;
    let successfulUrl: string | null = null;
    
    for (const urlToTry of urlsToTry) {
      console.log(`[PDF Proxy] Attempting: ${urlToTry}`);
      const response = await fetch(urlToTry, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/pdf,*/*",
      },
    });
    
      if (response.ok) {
        pdfResponse = response;
        successfulUrl = urlToTry;
        console.log(`[PDF Proxy] ✓ Success with: ${urlToTry}`);
        break;
      } else {
        console.log(`[PDF Proxy] ✗ Failed (${response.status}): ${urlToTry}`);
      }
    }
    
    if (!pdfResponse || !successfulUrl) {
      console.error(`[PDF Proxy] All URL variations failed for: ${target}`);
      throw new Response(`PDF not found at any URL variation`, { status: 404 });
    }
    
    console.log(`[PDF Proxy] Response status: ${pdfResponse.status} ${pdfResponse.statusText}`);
    
    const pdfBuffer = await pdfResponse.arrayBuffer();
    console.log(`[PDF Proxy] Successfully fetched ${pdfBuffer.byteLength} bytes`);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    // Re-throw Response errors as-is
    if (error instanceof Response) {
      throw error;
    }
    
    console.error("[PDF Proxy] Error:", error);
    throw new Response(`Failed to load PDF: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
