import type { Route } from "./+types/profile";
import { Profile } from "../components/Profile";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "الملف الشخصي - الثورة" },
    { name: "description", content: "عرض الملف الشخصي والدورات المشتراة" },
  ];
}

export default function ProfilePage() {
  return <Profile />;
}
