import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("article/:id", "routes/article.tsx"),
  route("author/:slug", "routes/author.$slug.tsx"),
  route("category/:slug", "routes/category.$slug.tsx"),
  route("cart", "routes/cart.tsx"),
  route("profile", "routes/profile.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
