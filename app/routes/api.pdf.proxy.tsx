import type { LoaderFunctionArgs } from "react-router";

const ALLOWED_HOSTS = new Set([
  "www.ijirmf.com",
  "pdfobject.com",
  "elthoura.tryasp.net",
  "res.cloudinary.com",
]);

function buildUrlCandidates(parsed: URL): string[] {
  const original = parsed.toString();

  // Some upstream servers have quirky decoding expectations for spaces/commas in
  // path segments. Keep this generic (no hard-coded filenames).
  const candidates = new Set<string>([original]);
  candidates.add(original.replace(/%20/g, "+"));
  candidates.add(original.replace(/%2C/gi, ","));
  candidates.add(original.replace(/,/g, "%2C"));

  return [...candidates];
}

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
    const range = request.headers.get("range") || undefined;

    const upstreamHeaders = new Headers();
    upstreamHeaders.set(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    );
    upstreamHeaders.set("Accept", "application/pdf,*/*");
    if (range) upstreamHeaders.set("Range", range);

    const urlsToTry = buildUrlCandidates(parsed);

    let pdfResponse: Response | null = null;
    for (const urlToTry of urlsToTry) {
      const response = await fetch(urlToTry, { headers: upstreamHeaders });
      if (response.ok || response.status === 206) {
        pdfResponse = response;
        break;
      }
    }

    if (!pdfResponse) {
      throw new Response("PDF not found", { status: 404 });
    }

    const headers = new Headers();
    headers.set("Content-Type", pdfResponse.headers.get("Content-Type") || "application/pdf");
    headers.set("Cache-Control", "public, max-age=3600");
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Vary", "Range");

    for (const name of ["Content-Length", "Content-Range", "Accept-Ranges", "ETag", "Last-Modified"]) {
      const value = pdfResponse.headers.get(name);
      if (value) headers.set(name, value);
    }

    return new Response(pdfResponse.body ?? (await pdfResponse.arrayBuffer()), {
      status: pdfResponse.status,
      headers,
    });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }

    console.error("[PDF Proxy] Error:", error);
    throw new Response(
      `Failed to load PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    );
  }
}
