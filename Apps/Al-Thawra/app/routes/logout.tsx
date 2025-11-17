import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import authService from "~/services/authService";

export const action = async ({ request }: Route.ActionArgs) => {
  // Logout using auth service (clears cookies on client)
  authService.logout();
  
  // Redirect to login page
  return redirect("/login");
};

// This route only handles POST requests for logout
export const loader = async () => {
  return redirect("/");
};
