import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/Admin/Dashboard/DashboardSidebar/DashboardSidebar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <Outlet />
    </div>
  );
}
