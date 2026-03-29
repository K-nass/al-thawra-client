/**
 * Dev-only test route for the new PDF viewer.
 * Access at: /test-pdf-viewer
 * Uses a hardcoded public PDF URL so no backend API is needed.
 */
import { MagazineViewer } from "~/components/MagazineViewer/index";

// Disable the site layout (header/footer) for full-viewport experience
export const handle = {
  disableLayout: true,
};

export default function TestPdfViewer() {
  return (
    <MagazineViewer
      pdfUrl="https://www.ijirmf.com/wp-content/uploads/IJIRMF201908054.pdf"
      issueNumber="TEST"
      date="2025-01-01"
    />
  );
}
