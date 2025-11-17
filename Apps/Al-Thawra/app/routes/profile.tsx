import type { Route } from "./+types/profile";
import { useLoaderData } from "react-router";
import { Profile, type UserProfile } from "../components/Profile";
import axiosInstance from "~/lib/axios";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "الملف الشخصي - الثورة" },
    { name: "description", content: "عرض الملف الشخصي والدورات المشتراة" },
  ];
}

// Loader to fetch user profile data
export async function loader() {
  // TODO: Replace with actual API call when authentication is ready
  // const response = await axiosInstance.get<UserProfile>("/users/profile");
  // return { user: response.data };
  
  // Return mock data for now
  return {
    user: {
      id: "1",
      userName: "Karim Maser",
      email: "karimmasert@gmail.com",
      avatarImageUrl: null,
      slug: "karim-maser",
      aboutMe: "صحفي ومحرر في صحيفة الثورة",
      socialAccounts: {},
      permissions: [],
      hasAllPermissions: false,
    },
  };
}

export default function ProfilePage() {
  const { user } = useLoaderData<typeof loader>();
  return <Profile user={user} />;
}
