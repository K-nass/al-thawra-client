import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("posts/categories/:categorySlug/articles/:slug", "routes/article.tsx"),
  route("author/:slug", "routes/author.$slug.tsx"),
  route("category/:slug", "routes/category.$slug.tsx"),
  route("search", "routes/search.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("reset-password", "routes/reset-password.tsx"),
  route("profile", "routes/profile.tsx"),
<<<<<<< Updated upstream
=======
  route("admin", "routes/admin.tsx")
>>>>>>> Stashed changes
] satisfies RouteConfig;
