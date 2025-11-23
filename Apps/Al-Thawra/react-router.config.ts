import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  
  // Static pre-rendering for specific routes
  async prerender() {
    return [
      "/login",
      "/register",
    ];
  },
} satisfies Config;
