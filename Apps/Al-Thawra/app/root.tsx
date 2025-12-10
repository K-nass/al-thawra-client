import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useLoaderData,
  useMatches,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { Layout as PageLayout } from "./components/Layout";
import { Sidebar } from "./components/Sidebar";
import { NavigationLoader } from "./components/NavigationLoader";
import { ToastContainer } from "./components/Toast";
import NotFoundPage from "./routes/not-found";
import { categoriesService } from "./services/categoriesService";
import { postsService } from "./services/postsService";
import { userService, type ChiefEditor } from "./services/userService";
import { cache, CacheTTL } from "./lib/cache";
import { generateOrganizationSchema, generateWebSiteSchema } from "./utils/seo";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MiniViewContainer } from "./components/VideoPlayer/MiniView/MiniViewContainer";

export const links: Route.LinksFunction = () => {
  // Get current URL for canonical - will be set per-route if needed
  // For now, using a simple implementation
  return [
    // Favicon - using logo
    { rel: "icon", type: "image/png", href: "/logo.png" },
    { rel: "apple-touch-icon", href: "/logo.png" },
    // react-pdf CSS
    { rel: "stylesheet", href: "https://unpkg.com/react-pdf@9.1.1/dist/esm/Page/AnnotationLayer.css" },
    { rel: "stylesheet", href: "https://unpkg.com/react-pdf@9.1.1/dist/esm/Page/TextLayer.css" },
    // Preconnect to external domains for faster resource loading
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    // Load fonts with font-display: swap for better performance
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    },
  ];
};

// Loader function for root layout with caching
export async function loader() {
  // Each call has its own try-catch - failures don't block others
  let categories: any[] = [];
  let trendingPosts: any[] = [];
  let chiefEditor: ChiefEditor | null = null;
  let chiefEditorPosts: any[] = [];

  try {
    categories = await cache.getOrFetch(
      "categories:menu:Arabic",
      () => categoriesService.getMenuCategories("Arabic"),
      CacheTTL.LONG
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  try {
    trendingPosts = await cache.getOrFetch(
      "posts:featured:15",
      () => postsService.getFeaturedPosts(15, "Article"),
      CacheTTL.MEDIUM
    );
  } catch (error) {
    console.error("Error fetching trending posts:", error);
  }

  try {
    chiefEditor = await cache.getOrFetch(
      "chief-editor:info",
      () => userService.getChiefEditor(),
      CacheTTL.LONG
    );
  } catch (error) {
    console.error("Error fetching chief editor:", error);
  }

  try {
    chiefEditorPosts = await cache.getOrFetch(
      "chief-editor:posts",
      () => postsService.getChiefEditorPosts(15),
      CacheTTL.MEDIUM
    );
  } catch (error) {
    console.error("Error fetching chief editor posts:", error);
  }

  return { categories, trendingPosts, chiefEditor, chiefEditorPosts };
}

export function Layout({ children }: { children: React.ReactNode }) {
  // Generate global JSON-LD schemas
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Global JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <ToastContainer />
          <MiniViewContainer />
          {children}
          <ScrollRestoration />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const { categories, trendingPosts, chiefEditor, chiefEditorPosts } = useLoaderData<typeof loader>();

  // Check if current route has disableLayout handle
  const matches = useMatches();
  const disableLayout = matches.some((match: any) => match.handle?.disableLayout);
  const disableSidebar = matches.some((match: any) => match.handle?.disableSidebar);

  // Routes that should not have sidebar
  const noSidebarRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname) && !disableSidebar;

  return (
    <>
      <NavigationLoader />
      {disableLayout ? (
        // Full-width layout for PDF viewer (no header, sidebar, footer)
        <Outlet context={{ categories }} />
      ) : (
        <PageLayout categories={categories}>
          {shouldShowSidebar ? (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                  <Outlet context={{ categories }} />
                </div>
                {/* Sidebar */}
                <div className="lg:w-72 flex-shrink-0">
                  <Sidebar
                    trendingPosts={trendingPosts}
                    chiefEditor={chiefEditor}
                    chiefEditorPosts={chiefEditorPosts}
                  />
                </div>
              </div>
            </div>
          ) : (
            <Outlet context={{ categories }} />
          )}
        </PageLayout>
      )}
    </>
  );
}


export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFoundPage />;
    }
    message = error.statusText || "Error";
    details = error.data || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
