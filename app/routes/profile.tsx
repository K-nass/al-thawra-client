import type { Route } from "./+types/profile";
import { Profile } from "../components/Profile";
import { requireAuth } from "~/lib/protectedRoute";
import profileService from "~/services/profileService";
import type { UpdateProfileData } from "~/services/profileService";
import { getCookiesFromRequest } from "~/utils/cookies";
import { cache, CacheTTL } from "~/lib/cache";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "الملف الشخصي - الثورة" },
    { name: "description", content: "عرض وتعديل الملف الشخصي" },
  ];
}

// Loader to fetch profile data
export async function loader({ request }: Route.LoaderArgs) {
  // Check authentication - will redirect to /login if not authenticated
  requireAuth(request);
  
  // Extract access token from cookies for server-side request
  const cookies = getCookiesFromRequest(request);
  const accessToken = cookies.accessToken;
  
  try {
    // Fetch profile from API with caching and ETag validation
    // validateAlways: true ensures we check ETag even if cache is fresh (for testing)
    const profile = await cache.getOrFetch(
      'profile:current',
      () => profileService.getCurrentProfile(accessToken),
      CacheTTL.MEDIUM, // 15 minutes
      '/profile', // URL for ETag validation
      true // validateAlways - check ETag even if cache is fresh
    );

    // Fetch saved posts
    let savedPosts = [];
    try {
      const savedPostsResponse = await profileService.getSavedPosts(1, 30);
      savedPosts = savedPostsResponse.items || [];
    } catch (error) {
      // If fetching saved posts fails, just return empty array
      console.error('Failed to fetch saved posts:', error);
    }

    return { profile, savedPosts, error: null };
  } catch (error: any) {
    return { 
      profile: null,
      savedPosts: [],
      error: error.response?.data?.message || 'فشل تحميل الملف الشخصي' 
    };
  }
}

// Action to handle profile updates
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "PUT" && request.method !== "POST") {
    return { error: "Invalid request method" };
  }

  // Extract access token and user from cookies for server-side request
  const cookies = getCookiesFromRequest(request);
  const accessToken = cookies.accessToken;
  const userStr = cookies.user;
  
  let userId: string;
  try {
    const user = JSON.parse(userStr);
    userId = user.id;
  } catch (error) {
    return { error: "User not found", success: false };
  }

  const formData = await request.formData();
  const userName = formData.get("userName") as string;
  const aboutMe = formData.get("aboutMe") as string;
  const avatarImage = formData.get("AvatarImage") as File | null;
  const facebook = formData.get("facebook") as string;
  const twitter = formData.get("twitter") as string;
  const instagram = formData.get("instagram") as string;
  const linkedin = formData.get("linkedin") as string;

  // Validation
  const errors: Record<string, string> = {};

  if (!userName || userName.trim().length < 2) {
    errors.userName = "اسم المستخدم يجب أن يكون حرفين على الأقل";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, success: false };
  }

  try {
    const updateData: UpdateProfileData = {
      userName: userName.trim(),
      aboutMe: aboutMe.trim(),
      ...(avatarImage && { avatarImage }), // Pass the file if present
      socialAccounts: {
        ...(facebook && { facebook }),
        ...(twitter && { twitter }),
        ...(instagram && { instagram }),
        ...(linkedin && { linkedin }),
      },
    };

    try {
      // Pass userId and token to update function for server-side requests
      // Backend returns 204 No Content, so no profile data is returned
      await profileService.updateProfile(userId, updateData, accessToken);
      
      // Invalidate profile cache after update
      cache.delete('profile:current');
      
      return { 
        success: true,
        message: "تم تحديث الملف الشخصي بنجاح" 
      };
    } catch (updateError: any) {
      throw updateError;
    }
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.title ||
      error.response?.data?.message ||
      "حدث خطأ أثناء تحديث الملف الشخصي";

    return { 
      error: errorMessage, 
      success: false 
    };
  }
}

export default function ProfilePage() {
  return <Profile />;
}
