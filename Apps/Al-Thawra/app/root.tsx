import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { Layout as PageLayout } from "./components/Layout";
import { Sidebar } from "./components/Sidebar";
import { NavigationLoader } from "./components/NavigationLoader";
import { categoriesService } from "./services/categoriesService";
import { postsService } from "./services/postsService";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// Loader function for root layout
export async function loader() {
  try {
    const [categories, trendingPosts] = await Promise.all([
      categoriesService.getMenuCategories("Arabic"),
      postsService.getFeaturedPosts(15), // API only accepts 15, 30, 60, or 90
    ]);

    return { categories, trendingPosts };
  } catch (error) {
    console.error("Error loading data in root:", error);
    return { categories: [], trendingPosts: [] };
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const { categories, trendingPosts } = useLoaderData<typeof loader>();
  
  // Pages that should not show sidebar
  const noSidebarPages = ['/login', '/register', '/forgot-password', '/reset-password'];
  const showSidebar = !noSidebarPages.includes(location.pathname);

  return (
    <>
      <NavigationLoader />
      <PageLayout categories={categories}>
      {showSidebar ? (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              <Outlet />
            </div>
            {/* Sidebar */}
            <div className="lg:w-72 flex-shrink-0">
              <Sidebar trendingPosts={trendingPosts} />
            </div>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
      </PageLayout>
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
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
