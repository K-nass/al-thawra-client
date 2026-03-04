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
    <div>
      <div>
        <h1>
          Admin Dashboard
        </h1>
        <p>
          Welcome to the admin panel
        </p>
      </div>
    </div>
  );
}
