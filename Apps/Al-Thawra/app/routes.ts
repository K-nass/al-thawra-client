import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("posts/categories/:categorySlug/articles/:slug", "routes/article.tsx"),
  route("posts/categories/:categorySlug/audios/:slug", "routes/audio.tsx"),
  route("posts/categories/:categorySlug/videos/:slug", "routes/video.tsx"),
  route("writers-opinions/:slug", "routes/writers-opinions.$slug.tsx"),
  route("writers-opinions", "routes/writers-opinions.tsx"),
  route("author/:slug", "routes/author.$slug.tsx"),
  route("category/:slug", "routes/category.$slug.tsx"),
  route("search", "routes/search.tsx"),
  route("magazines", "routes/magazines.tsx"),
  route("contact", "routes/contact.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("logout", "routes/logout.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("reset-password", "routes/reset-password.tsx"),
  route("profile", "routes/profile.tsx"),
  route("cart", "routes/cart.tsx"),
  route("admin", "routes/admin.tsx"),
  route("podcast", "routes/podcast.tsx"),
  route("tv", "routes/tv.tsx")
] satisfies RouteConfig;