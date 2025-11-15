import { Link } from "react-router";
import { Edit, LogOut } from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
}

interface ProfileProps {
  user?: ProfileData;
}

export function Profile({ user }: ProfileProps) {
  // Mock user data if not provided
  const userData: ProfileData = user || {
    name: "Karim Maser",
    email: "karimmasert@gmail.com",
    initials: "K",
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = userData.initials || getInitials(userData.name);

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
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg"
                style={{ backgroundColor: "var(--color-secondary)" }}
              >
                {initials}
              </div>
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
                {userData.name}
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                {userData.email}
              </p>
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

            {/* Navigation Tabs */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: "rgba(108, 117, 125, 0.2)" }}>
              <div className="flex justify-around text-center gap-2">
                <Link
                  to="/profile/courses"
                  className="flex-1 py-2 text-sm font-medium transition-colors"
                  style={{ color: "var(--color-primary)" }}
                >
                  دوراتي
                </Link>
                <Link
                  to="/profile/wishlist"
                  className="flex-1 py-2 text-sm font-medium transition-colors"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  المفضلة
                </Link>
                <Link
                  to="/profile/certificates"
                  className="flex-1 py-2 text-sm font-medium transition-colors"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  الشهادات
                </Link>
                <Link
                  to="/profile/settings"
                  className="flex-1 py-2 text-sm font-medium transition-colors"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  الإعدادات
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
