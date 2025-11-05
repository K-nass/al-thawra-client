import { createBrowserRouter } from "react-router-dom";
import WebsiteLayout from "./layouts/WebsiteLayout";
import Home from "./components/Home/Home";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./components/Admin/Dashboard/DashboardHome/DashboardHome";
import DashboardAddPost from "./components/Admin/Dashboard/DashboardAddPost/DashboardAddPost";
import DashboardForm from "./components/Admin/Dashboard/DashboardAddPost/DashboardForm/DashboardForm";
import DashboardPosts from "./components/Admin/Dashboard/DashboardPosts/DashboardPosts";

export const routes = createBrowserRouter([
  {
    path: "",
    element: <WebsiteLayout />,
    children: [{ index: true, element: <Home /> }],
  },
  // {
  //   path: "admin",
  //   element: <DashboardLayout />,
  //   children: [
  //     {
  //       index: true,
  //       element: <DashboardHome />,
  //     },
  //     { path: "post-format", element: <DashboardAddPost /> },
  //     { path: "add-post", element: <DashboardForm /> },
  //     {
  //       path: "posts", element: <DashboardPosts />, children: [
  //         {
  //           path: "all", element: <DashboardPosts label="posts" />,
  //         }, {
  //           path: "slider-posts", element: <DashboardPosts label=" Slider Posts" />
  //         }
  //       ]
  //     }
  //   ],
  // },
  {
    path: "admin",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "post-format", element: <DashboardAddPost /> },
      { path: "add-post", element: <DashboardForm /> },
      { path: "posts/all", element: <DashboardPosts label="Posts" /> },
      { path: "posts/slider-posts", element: <DashboardPosts label="Slider Posts" /> },
      { path: "posts/featured-posts", element: <DashboardPosts label="Featured Posts" /> },
      { path: "posts/breaking-news", element: <DashboardPosts label="Breaking News" /> },

    ]
  }

]);
