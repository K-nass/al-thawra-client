import type { LoaderFunctionArgs } from "react-router";

const ALLOWED_HOSTS = new Set(["www.ijirmf.com"]);

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
    const pdfResponse = await fetch(parsed.toString());
    if (!pdfResponse.ok) {
      throw new Response("PDF not found", { status: 404 });
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    throw new Response("Failed to load PDF", { status: 500 });
  }
}
