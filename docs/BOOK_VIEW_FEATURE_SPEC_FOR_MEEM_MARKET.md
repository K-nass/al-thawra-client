# Book View Feature Spec (Parity Copy of `MagazineViewer`)

This document describes exactly how the current Magazine Viewer is implemented in this project, so the `meem-market` Offers feature can replicate the same Book View UI and behavior.

## 1) Source of Truth in This Project

Feature files:
- `app/components/MagazineViewer/MagazineViewer.tsx`
- `app/components/MagazineViewer/ThumbnailSidebar.tsx`
- `app/components/MagazineViewer/ViewerLoadingState.tsx`
- `app/components/MagazineViewer/magazine-viewer.css`
- `app/components/MagazineViewer/index.ts`

Integration routes:
- `app/routes/magazines.issue.$issueNumber.tsx`
- `app/routes/magazines.date.$date.tsx`
- `app/routes/test-pdf-viewer.tsx`

Backend helper routes used by viewer controls/loader:
- `app/routes/api.pdf.proxy.tsx`
- `app/routes/api.pdf.issue.$issueNumber.tsx`
- `app/routes/api.pdf.date.$date.tsx`

## 2) Dependency and Library Requirements

Install these runtime dependencies (same versions used here for maximum parity):

```bash
npm i react-pageflip@2.0.3 page-flip@2.0.7 pdfjs-dist@5.5.207 @tanstack/react-virtual@3.13.21 lucide-react@0.454.0
```

Framework/runtime assumptions in this implementation:
- React 19 (`react@19.1.1`, `react-dom@19.1.1`)
- React Router v7 (`react-router@7.9.2`)

Why each dependency is required:
- `pdfjs-dist`: Loads PDF and rasterizes each page to high-res image DataURL.
- `react-pageflip` + `page-flip`: Realistic page-turn animation/book physics.
- `@tanstack/react-virtual`: Virtualized thumbnail sidebar for large page counts.
- `lucide-react`: Toolbar/controls icons.

## 3) Feature Architecture (Exact Behavior)

### Render pipeline
1. Viewer receives `pdfUrl`.
2. `usePdfToImages` dynamically imports `pdfjs-dist`.
3. Worker is set to:
   - `https://unpkg.com/pdfjs-dist@5.5.207/build/pdf.worker.min.mjs`
4. PDF is fetched through proxy endpoint:
   - `/api/pdf/proxy?url=<encodedOriginalPdfUrl>`
5. Each PDF page is rendered into canvas at `scale = 2` for retina quality.
6. Canvas is converted to JPEG DataURL (`quality=0.92`) and stored in memory.
7. `react-pageflip` renders these page images as a 2-page book spread.

### Core design decisions that must stay identical
- `showCover={true}` to enforce single-page cover behavior.
- Flipbook uses `size="fixed"` with explicit width/height computed from viewport.
- `usePortrait={false}` to keep spread mode.
- Book wrapper width is always `2 * pageWidth` (critical for spread rendering).
- `dir="ltr"` is forced on root viewer to avoid pageflip RTL layout breakage.

## 4) Component Contract

Current component props:

```ts
interface MagazineViewerProps {
  pdfUrl: string;
  issueNumber: string;
  date?: string;
}
```

For `meem-market`, you can rename to offer semantics, but keep equivalent values:
- `pdfUrl`: Offer booklet PDF URL.
- `issueNumber` equivalent: Offer edition code/ID used in UI label + download filename.
- `date` optional: used by download endpoint selection.

## 5) UI/UX Feature Parity Checklist

To be a true visual/behavioral copy, preserve all of the below.

### A) Layout and visuals
- Full viewport reader (`100vh` + `100dvh`).
- Light blue radial-gradient background.
- Photorealistic stacked paper shadow around book.
- Center gutter shadow for depth when spread is visible.
- Side nav arrows at viewport edges.
- Bottom glass toolbar (fixed, dark translucent bar).
- Optional collapsible left thumbnail sidebar (190px width when open).

### B) Reading and navigation
- Previous/next side arrows.
- Toolbar controls:
  - First page
  - Previous page
  - Page number input (jump on submit/blur)
  - Next page
  - Last page
  - Range slider scrubber
- Cover/last-page centering offset when spread is incomplete.

### C) Zoom and pan
- Zoom in/out/reset buttons.
- Double click toggles between 1x and 2x zoom.
- Cursor-aware zoom focal math (zooms into click point).
- Pointer drag pan only when zoomed.
- Pan clamped so book cannot be dragged fully off-screen.
- While zoomed, flip-by-click is disabled (`useMouseEvents={zoomLevel === 1}`).

### D) Keyboard shortcuts
- `ArrowRight` -> previous spread
- `ArrowLeft` -> next spread
- `Home` -> first page
- `End` -> last page
- `+` / `=` -> zoom in
- `-` -> zoom out
- `0` -> reset zoom
- `Escape` -> exit fullscreen

### E) Utilities
- Fullscreen toggle.
- Download button (fetches server endpoint, creates blob, triggers file save).
- Print button (opens new window with all page images, invokes `print()`).

### F) Loading + error states
- Skeleton page animation.
- Progress bar during page rasterization.
- Error state with retry button.

## 6) Backend/API Contracts Needed for Same Behavior

Current implementation expects these server routes:

1. Proxy for PDF.js loading
- `GET /api/pdf/proxy?url=<https-url>`
- Validates URL and host allow-list.
- Returns PDF bytes with `Content-Type: application/pdf`.

2. Download by issue
- `GET /api/pdf/issue/:issueNumber`
- Returns resolved PDF bytes.

3. Download by date
- `GET /api/pdf/date/:date`
- Returns resolved PDF bytes.

For `meem-market`, create equivalent Offer endpoints, for example:
- `/api/offers-book/proxy?url=...`
- `/api/offers-book/id/:offerBookId`
- `/api/offers-book/date/:date`

Then update viewer URLs accordingly.

## 7) Implementation Notes by File

### `MagazineViewer.tsx`
Responsibilities:
- PDF-to-image conversion hook (`usePdfToImages`).
- Error/loading/success branching.
- `FlipBookViewer` for rendering, navigation, zoom/pan, toolbar actions.
- Dynamic import of `react-pageflip` for SSR safety.

Critical config in `FlipBookComp`:

```tsx
size="fixed"
showCover={true}
drawShadow={true}
maxShadowOpacity={0.5}
flippingTime={700}
usePortrait={false}
autoSize={true}
mobileScrollSupport={true}
clickEventForward={true}
disableFlipByClick={true}
useMouseEvents={zoomLevel === 1}
```

### `ThumbnailSidebar.tsx`
Responsibilities:
- Virtualized thumbnail list.
- Auto-scroll to active page on change.
- Click-to-jump navigation.

### `ViewerLoadingState.tsx`
Responsibilities:
- Skeleton loading visual.
- Optional progress bar when conversion progress available.

### `magazine-viewer.css`
Responsibilities:
- Entire visual identity and responsive behavior of reader.
- Toolbar, arrows, sidebar, loading, error, and animation styling.

### `ViewerToolbar.tsx`
- Deprecated/no-op in current project.
- Toolbar is fully inlined inside `MagazineViewer.tsx`.

## 8) Integration Pattern in Route/Page

Current route-level integration does:
- Fetch magazine metadata in loader.
- Render full-screen viewer route with `handle.disableLayout = true`.
- Pass `pdfUrl`, `issueNumber`, and optional `date`.

Example pattern to keep in `meem-market`:

```tsx
export const handle = { disableLayout: true };

export default function OfferBookPage() {
  return (
    <BookViewer
      pdfUrl={offer.pdfUrl}
      issueNumber={offer.offerCode}
      date={offer.date}
    />
  );
}
```

## 9) Copy Plan for `meem-market` (Recommended)

1. Copy `app/components/MagazineViewer` folder into `meem-market` as `BookViewer` (or keep same name and alias).
2. Copy CSS exactly first; only brand colors/text after parity is verified.
3. Install exact dependency versions listed above.
4. Implement proxy + download endpoints matching expected contract.
5. Create full-screen route/page and pass equivalent props.
6. Verify behavior against parity checklist below.

## 10) Parity QA Checklist (Must Pass)

- Viewer opens full viewport with no parent layout chrome.
- First view shows single cover page, not 2-page spread.
- Middle pages show 2-page spread with realistic flip.
- Side arrows work and disable correctly at limits.
- Page input, slider, first/last navigation all work.
- Thumbnail sidebar opens, virtualizes, and jumps to page.
- Zoom in/out/reset works; panning only when zoomed.
- Double-click zooms in to cursor focal point, double-click again resets.
- Fullscreen toggle works.
- Download returns actual PDF file.
- Print opens printable image pages.
- Loading state + progress visible during conversion.
- Error state appears on invalid/unavailable PDF.
- Mobile responsive behavior matches breakpoints (`1024px`, `640px`).

## 11) Known Implementation Caveats (Current Source)

- Retry button increments `retryKey`, but PDF reload hook currently depends only on `pdfUrl`; if URL does not change, retry may not fully re-run loading in some failure scenarios.
- Arrow key mapping is intentionally configured for this reader orientation (`ArrowRight` goes previous, `ArrowLeft` goes next).
- Viewer keeps all page DataURLs in memory for fast flips; very large PDFs can increase memory usage.

## 12) Minimal Rename Map for Offers Domain

If you want domain naming without behavior changes:
- `MagazineViewer` -> `OfferBookViewer`
- `issueNumber` -> `offerBookCode` (or `offerId`)
- Route `/magazines/...` -> `/offers/...`
- API `/api/pdf/...` -> `/api/offers-book/...`

No internal algorithm changes are required for parity.

---

If you follow this spec exactly, `meem-market` will achieve near-1:1 behavior and UI with the current magazine book viewer implementation.
