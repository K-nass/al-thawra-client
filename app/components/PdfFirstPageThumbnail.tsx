import { useEffect, useMemo, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { getPdfjs } from "~/lib/pdfjs";

type PdfFirstPageThumbnailProps = {
  pdfUrl: string;
  alt: string;
  className?: string;
  /**
   * Target render width in CSS pixels. Higher values = sharper but heavier.
   * Default tuned for magazine grid cards.
   */
  targetWidth?: number;
};

const memoryThumbCache = new Map<string, string>();

function useInView<T extends Element>(rootMargin: string = "250px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

export function PdfFirstPageThumbnail({
  pdfUrl,
  alt,
  className,
  targetWidth = 420,
}: PdfFirstPageThumbnailProps) {
  const cacheKey = useMemo(() => `pdf:firstpage:${pdfUrl}`, [pdfUrl]);
  const cached = useMemo(() => memoryThumbCache.get(cacheKey) ?? null, [cacheKey]);
  const [thumb, setThumb] = useState<string | null>(cached);
  const [failed, setFailed] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>();

  useEffect(() => {
    if (!inView) return;
    if (thumb) return;
    if (!pdfUrl) return;

    let cancelled = false;
    let loadingTask: any | null = null;

    (async () => {
      try {
        const pdfjs = await getPdfjs();
        const resolvedUrl = `/api/pdf/proxy?url=${encodeURIComponent(pdfUrl)}`;

        loadingTask = pdfjs.getDocument({
          url: resolvedUrl,
          disableRange: false,
          disableAutoFetch: false,
        });

        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const page = await pdf.getPage(1);
        if (cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const scale = Math.max(0.2, Math.min(2, targetWidth / baseViewport.width));
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) throw new Error("Canvas 2D context unavailable");

        await page.render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);

        page.cleanup();
        pdf.destroy();

        if (cancelled) return;
        memoryThumbCache.set(cacheKey, dataUrl);
        setThumb(dataUrl);
      } catch (err) {
        if (cancelled) return;
        console.error("[PdfFirstPageThumbnail] Failed to render thumbnail:", err);
        setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      try {
        loadingTask?.destroy?.();
      } catch {
        // ignore
      }
    };
  }, [cacheKey, inView, pdfUrl, targetWidth, thumb]);

  return (
    <div ref={ref} className="w-full h-full">
      {thumb ? (
        <img src={thumb} alt={alt} className={className} loading="lazy" decoding="async" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <FileText className="w-16 h-16 text-gray-400" />
          <span className="sr-only">{failed ? alt : "Loading thumbnail"}</span>
        </div>
      )}
    </div>
  );
}

