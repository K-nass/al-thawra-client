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
import { pagesService } from "./services/pagesService";
import { userService, type ChiefEditor } from "./services/userService";
import { settingsService, type LogoSettings } from "./services/settingsService";
import { cache, CacheTTL } from "./lib/cache";
import { generateOrganizationSchema, generateWebSiteSchema } from "./utils/seo";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SidebarProvider } from "./contexts/SidebarContext";
import { CategorySidebar } from "./components/CategorySidebar";
import { MiniViewContainer } from "./components/VideoPlayer/MiniView/MiniViewContainer";
import { useArabicNumbersFix } from "./utils/fixArabicNumbers";

// Loader function for root layout with caching
export async function loader() {
  // Each call has its own try-catch - failures don't block others
  let categories: any[] = [];
  let trendingPosts: any[] = [];
  let breakingNews: any[] = [];
  let chiefEditor: ChiefEditor | null = null;
  let chiefEditorPosts: any[] = [];
  let footerPages: any[] = [];
  let logoSettings: LogoSettings = { ceoName: "" };

  try {
    categories = await cache.getOrFetch(
      "categories:menu",
      () => categoriesService.getMenuCategories(),
      CacheTTL.LONG
    );
  } catch (error) {
    // Error fetching categories
  }

  try {
    footerPages = await cache.getOrFetch(
      "pages:footer:Arabic:v2",
      () => pagesService.getFooterPages("Arabic"),
      CacheTTL.LONG
    );
  } catch (error) {
    // Error fetching footer pages
  }

  try {
    trendingPosts = await cache.getOrFetch(
      "posts:featured:15",
      () => postsService.getFeaturedPosts(15, "Article"),
      CacheTTL.MEDIUM
    );
  } catch (error) {
    // Error fetching trending posts
  }

  try {
    chiefEditor = await cache.getOrFetch(
      "chief-editor:info",
      () => userService.getChiefEditor(),
      CacheTTL.LONG
    );
  } catch (error) {
    // Error fetching chief editor
  }

  try {
    chiefEditorPosts = await cache.getOrFetch(
      "chief-editor:posts",
      () => postsService.getChiefEditorPosts(15),
      CacheTTL.MEDIUM
    );
  } catch (error) {
    // Error fetching chief editor posts
  }

  try {
    logoSettings = await cache.getOrFetch(
      "settings:logo",
      () => settingsService.getLogoSettings(),
      CacheTTL.LONG
    );
  } catch (error) {
    // Error fetching logo settings
  }

  try {
    breakingNews = await cache.getOrFetch(
      "posts:breaking:15:Article",
      () => postsService.getBreakingNews(15, "Article"),
      CacheTTL.SHORT
    );
  } catch (error) {
    // Error fetching breaking news
  }

  return { categories, trendingPosts, breakingNews, chiefEditor, chiefEditorPosts, footerPages, logoSettings };
}

// ... existing Layout component ...
export function Layout({ children }: { children: React.ReactNode }) {
  // Generate global JSON-LD schemas
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Favicon */}
        <link rel="icon" href="/favIcon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favIcon.png" />

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
          <SidebarProvider>
            <ToastContainer />
            <MiniViewContainer />
            {children}
            <ScrollRestoration />
            <Scripts />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const { categories, trendingPosts, breakingNews, chiefEditor, chiefEditorPosts, footerPages, logoSettings } = useLoaderData<typeof loader>();

  // Fix Arabic numbers display issues
  useArabicNumbersFix();

  // Check if current route has disableLayout handle
  const matches = useMatches();
  const disableLayout = matches.some((match: any) => match.handle?.disableLayout);
  const disableSidebar = matches.some((match: any) => match.handle?.disableSidebar);

  // Routes that should not have sidebar
  const noSidebarRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname) && !disableSidebar;

  return (
    <div className="min-h-screen">
      <NavigationLoader />
      {/* Category Sidebar — fixed overlay, out of flow */}
      <CategorySidebar categories={categories} />
      <div className="w-full min-w-0">
        {disableLayout ? (
          // Full-width layout for PDF viewer (no header, sidebar, footer)
          <Outlet context={{ categories }} />
        ) : (
          <PageLayout categories={categories} footerPages={footerPages} logoSettings={logoSettings} breakingNews={breakingNews}>
            <Outlet context={{ categories }} />
          </PageLayout>
        )}
      </div>
    </div>
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
    <main>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
