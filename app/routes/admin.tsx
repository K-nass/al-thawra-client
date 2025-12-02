import type { Route } from "./+types/admin";
import { requireAuth, getCurrentUserFromRequest } from "~/lib/protectedRoute";

export const loader = async ({ request }: Route.LoaderArgs) => {
  // Check authentication and require Admin role
  requireAuth(request, ['Admin']);
  
  // Get current user from request cookies
  const user = getCurrentUserFromRequest(request);
  
  return { user };
};

export default function AdminPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          Admin Dashboard
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Welcome to the admin panel
        </p>
      </div>
    </div>
  );
}
