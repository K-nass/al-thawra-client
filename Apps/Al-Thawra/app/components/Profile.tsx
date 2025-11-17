import { Link } from "react-router";
import { Edit, LogOut } from "lucide-react";

export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  avatarImageUrl: string | null;
  slug: string;
  aboutMe: string;
  socialAccounts: Record<string, string>;
  permissions: string[];
  hasAllPermissions: boolean;
}

interface ProfileProps {
  user: UserProfile;
}

export function Profile({ user }: ProfileProps) {
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(user.userName);

  return (
    <div className="flex items-center justify-center py-12" style={{ backgroundColor: "var(--color-background-light)" }}>
      <div className="w-full max-w-sm mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Background */}
          <div className="h-24" style={{ backgroundColor: "var(--color-primary)" }}></div>

          {/* Profile Content */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="flex justify-center -mt-12 mb-4">
              {user.avatarImageUrl ? (
                <img
                  src={user.avatarImageUrl}
                  alt={user.userName}
                  className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                  style={{ backgroundColor: "var(--color-secondary)" }}
                >
                  {initials}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                {user.userName}
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                {user.email}
              </p>
              {user.aboutMe && (
                <p className="text-sm mt-2 text-gray-600">
                  {user.aboutMe}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Edit Profile Button */}
              <Link
                to="/edit-profile"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-medium transition-colors border"
                style={{
                  borderColor: "var(--color-primary)",
                  color: "var(--color-primary)",
                }}
              >
                <Edit className="w-4 h-4" />
                <span>تعديل الملف الشخصي</span>
              </Link>

              {/* Logout Button */}
              <button
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل خروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
