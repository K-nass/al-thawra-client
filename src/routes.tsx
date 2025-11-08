import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./components/Admin/Dashboard/DashboardHome/DashboardHome";
import DashboardAddPost from "./components/Admin/Dashboard/DashboardAddPost/DashboardAddPost";
import DashboardForm from "./components/Admin/Dashboard/DashboardAddPost/DashboardForm/DashboardForm";
import DashboardPosts from "./components/Admin/Dashboard/DashboardPosts/DashboardPosts";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { getAuthToken } from "./api/client";
import { useDocumentTitle } from "./hooks/useDocumentTitle";

// Wrapper component to redirect authenticated users away from login/register
function AuthPageWrapper({ children }: { children: React.ReactNode }) {
  const token = getAuthToken();
  if (token) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}

// Root layout component that handles document title
function RootLayout() {
  useDocumentTitle();
  return <Outlet />;
}

export const routes = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "login",
        element: <AuthPageWrapper><Login /></AuthPageWrapper>,
      },
      {
        path: "register",
        element: <AuthPageWrapper><Register /></AuthPageWrapper>,
      },
      {
        path: "",
        element: <AuthPageWrapper><Login /></AuthPageWrapper>,
      },
      {
        path: "admin",
        element: <ProtectedRoute><ErrorBoundary><DashboardLayout /></ErrorBoundary></ProtectedRoute>,
        children: [
          { index: true, element: <DashboardHome /> },
          { path: "post-format", element: <DashboardAddPost /> },
          { path: "add-post", element: <DashboardForm /> },
          { path: "posts/all", element: <DashboardPosts label="Posts" /> },
          { path: "posts/slider-posts", element: <DashboardPosts label="Slider Posts" /> },
          { path: "posts/featured-posts", element: <DashboardPosts label="Featured Posts" /> },
          { path: "posts/breaking-news", element: <DashboardPosts label="Breaking News" /> },
          { path: "pages", element: <DashboardPosts label="pages"/> },
        ]
      }
    ]
  }
]);
