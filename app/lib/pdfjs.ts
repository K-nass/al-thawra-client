let pdfjsPromise: Promise<typeof import("pdfjs-dist")> | null = null;

export async function getPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((pdfjs) => {
      // Keep worker on a CDN for now to avoid bundler/asset config churn.
      // Viewer + thumbnails share this single initialization.
      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@4.9.155/build/pdf.worker.min.mjs";
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

