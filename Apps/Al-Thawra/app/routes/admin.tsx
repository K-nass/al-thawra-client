import { redirect } from "react-router";
import type { Route } from "./+types/admin";
import authService from "~/services/authService";

export const loader = async ({}: Route.LoaderArgs) => {
  // Get current user from memory
  const user = authService.getCurrentUser();

  // If no user is logged in, redirect to login
  if (!user) {
    return redirect("/login");
  }

  // If user is Member or Author, redirect to home
  if (user.role === "Member" || user.role === "Author") {
    return redirect("/");
  }

  // Only Admin users can access this page
  return null;
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
