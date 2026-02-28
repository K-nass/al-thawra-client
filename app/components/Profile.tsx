import { useState, useEffect } from "react";
import { useLoaderData, useActionData, useNavigation, useFetcher } from "react-router";
import { 
  User, 
  Mail, 
  Edit, 
  Save, 
  X, 
  Camera,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  LogOut
} from "lucide-react";
import authService from "~/services/authService";
import profileService from "~/services/profileService";
import mediaService from "~/services/mediaService";
import type { UserProfile } from "~/services/profileService";
import { showToast } from "~/components/Toast";

interface ProfileLoaderData {
  profile: UserProfile | null;
  error: string | null;
}

interface ProfileActionData {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string>;
  profile?: UserProfile;
}

export function Profile() {
  const loaderData = useLoaderData<ProfileLoaderData>();
  const actionData = useActionData<ProfileActionData>();
  const navigation = useNavigation();
  const fetcher = useFetcher<ProfileActionData>();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const isSubmitting = navigation.state === "submitting" || fetcher.state === "submitting" || isUploading;

  
  // Use updated profile from action if available, otherwise use loader data
  const profile = fetcher.data?.profile || actionData?.profile || loaderData?.profile;
  const errors = fetcher.data?.errors || actionData?.errors || {};

  // Show success/error messages when profile is updated
  useEffect(() => {
    if (fetcher.data?.success || actionData?.success) {
      showToast('تم حفظ التغييرات بنجاح', 'success');
      setShowSuccess(true);
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      // Reload to fetch updated profile with server-side cookies
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else if (fetcher.data?.error || actionData?.error) {
      const errorMsg = fetcher.data?.error || actionData?.error || 'حدث خطأ أثناء حفظ التغييرات';
      showToast(errorMsg, 'error');
    }
  }, [fetcher.data, actionData]);

  if (loaderData?.error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-light)]" dir="rtl">
        <div className="bg-[var(--color-white)] p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">خطأ في تحميل الملف الشخصي</h2>
            <p className="text-gray-600">{loaderData.error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-light)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(profile.userName);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-light)] py-12 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <div className="text-green-500 text-2xl">✓</div>
            <p className="text-green-700 font-medium">{actionData?.message}</p>
          </div>
        )}

        {/* Error Message */}
        {actionData?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <div className="text-red-500 text-2xl">⚠</div>
            <p className="text-red-700">{actionData.error}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-[var(--color-white)] rounded-2xl shadow-xl overflow-hidden">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] relative">
            <div className="absolute top-4 left-4">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--color-white)]/90 hover:bg-[var(--color-white)] text-[var(--color-primary)] rounded-lg transition-colors shadow-md"
                >
                  <Edit className="w-4 h-4" />
                  <span className="font-medium">تعديل الملف</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
              {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-6">
              <div className="relative">
                {avatarPreview || profile.avatarImageUrl ? (
                  <div className="relative">
                    <img
                      src={avatarPreview || profile.avatarImageUrl!}
                      alt={profile.userName}
                      className={`w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover ${isUploading ? 'opacity-50' : ''}`}
                      loading="lazy"
                      decoding="async"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                        <div className="w-32 h-32 rounded-full border-4 border-t-[var(--color-primary)] border-r-transparent border-b-[var(--color-primary)] border-l-transparent animate-spin absolute -top-1 -left-1"></div>
                        <span className="text-[var(--color-primary)] font-bold text-sm bg-white/80 px-2 py-1 rounded-full">
                          {uploadProgress === 100 ? 'جاري المعالجة...' : `${uploadProgress}%`}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-bold relative"
                    style={{ backgroundColor: "var(--color-secondary)" }}
                  >
                    {initials}
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                         <div className="w-32 h-32 rounded-full border-4 border-t-white border-r-transparent border-b-white border-l-transparent animate-spin absolute -top-1 -left-1"></div>
                         <span className="text-white font-bold text-sm bg-black/20 px-2 py-1 rounded-full">
                           {uploadProgress === 100 ? 'جاري المعالجة...' : `${uploadProgress}%`}
                         </span>
                      </div>
                    )}
                  </div>
                )}
                {isEditing && !isUploading && (
                  <>

                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 p-2 bg-[var(--color-primary)] text-white rounded-full shadow-lg hover:bg-[var(--color-primary-dark)] transition-colors cursor-pointer"
                      title="تغيير الصورة الشخصية"
                    >
                      <Camera className="w-5 h-5" />
                    </label>
                  </>
                )}
              </div>
            </div>

            {!isEditing ? (
              // View Mode
              <div>
                {/* User Info */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile.userName}</h1>
                  <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.slug && (
                    <p className="text-sm text-gray-500">@{profile.slug}</p>
                  )}
                </div>

                {/* About Me */}
                {profile.aboutMe && (
                  <div className="mb-8 p-6 bg-[var(--color-white)] rounded-lg border border-[var(--color-divider)]">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">نبذة عني</h3>
                    <p className="text-gray-700 leading-relaxed">{profile.aboutMe}</p>
                  </div>
                )}

                {/* Social Accounts */}
                {Object.keys(profile.socialAccounts || {}).length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">حسابات التواصل الاجتماعي</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(profile.socialAccounts.Facebook || profile.socialAccounts.facebook) && (
                        <a
                          href={profile.socialAccounts.Facebook || profile.socialAccounts.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Facebook className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">Facebook</span>
                        </a>
                      )}
                      {(profile.socialAccounts.Twitter || profile.socialAccounts.twitter) && (
                        <a
                          href={profile.socialAccounts.Twitter || profile.socialAccounts.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                        >
                          <Twitter className="w-5 h-5 text-sky-600" />
                          <span className="text-sm font-medium text-sky-600">Twitter</span>
                        </a>
                      )}
                      {(profile.socialAccounts.Instagram || profile.socialAccounts.instagram) && (
                        <a
                          href={profile.socialAccounts.Instagram || profile.socialAccounts.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
                        >
                          <Instagram className="w-5 h-5 text-pink-600" />
                          <span className="text-sm font-medium text-pink-600">Instagram</span>
                        </a>
                      )}
                      {(profile.socialAccounts.LinkedIn || profile.socialAccounts.linkedin) && (
                        <a
                          href={profile.socialAccounts.LinkedIn || profile.socialAccounts.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Linkedin className="w-5 h-5 text-blue-700" />
                          <span className="text-sm font-medium text-blue-700">LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Permissions Badge */}
                {profile.hasAllPermissions && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                    <p className="text-center text-yellow-800 font-medium">
                      🔑 لديك صلاحيات كاملة
                    </p>
                  </div>
                )}

                {/* Logout Button */}
                <div className="pt-6 border-t border-[var(--color-divider)]">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            ) : (
              // Edit Mode
              <fetcher.Form 
                method="post" 
                encType="multipart/form-data"
                className="space-y-6"
                onSubmit={() => {
                  // Form submits naturally with the file input inside
                }}
              >
                {/* Hidden File Input - Moved inside form for native submission */}
                <input
                  type="file"
                  id="avatar-upload"
                  name="AvatarImage"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Validate file size (max 5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        showToast('حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت.', 'error');
                        return;
                      }
                      
                      // Validate file type
                      if (!file.type.startsWith('image/')) {
                        showToast('يرجى اختيار ملف صورة صالح.', 'error');
                        return;
                      }
                      
                      // Set file and create preview
                      setAvatarFile(file);
                      const previewUrl = URL.createObjectURL(file);
                      setAvatarPreview(previewUrl);
                    }
                  }}
                />
                {/* Username */}
                <div>
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المستخدم *
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      id="userName"
                      name="userName"
                      defaultValue={profile.userName}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] ${
                        errors.userName ? "border-red-500" : "border-[var(--color-divider)]"
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.userName && (
                    <p className="mt-1 text-sm text-red-500">{errors.userName}</p>
                  )}
                </div>

                {/* About Me */}
                <div>
                  <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700 mb-2">
                    نبذة عني
                  </label>
                  <textarea
                    id="aboutMe"
                    name="aboutMe"
                    rows={4}
                    defaultValue={profile.aboutMe}
                    className="w-full px-4 py-3 border border-[var(--color-divider)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
                    placeholder="اكتب نبذة مختصرة عنك..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Social Accounts */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">حسابات التواصل الاجتماعي</h3>
                  
                  <div>
                    <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      id="facebook"
                      name="facebook"
                      defaultValue={profile.socialAccounts?.Facebook || profile.socialAccounts?.facebook || ""}
                      className="w-full px-4 py-3 border border-[var(--color-divider)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      placeholder="https://facebook.com/username"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input
                      type="url"
                      id="twitter"
                      name="twitter"
                      defaultValue={profile.socialAccounts?.Twitter || profile.socialAccounts?.twitter || ""}
                      className="w-full px-4 py-3 border border-[var(--color-divider)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      placeholder="https://twitter.com/username"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      id="instagram"
                      name="instagram"
                      defaultValue={profile.socialAccounts?.Instagram || profile.socialAccounts?.instagram || ""}
                      className="w-full px-4 py-3 border border-[var(--color-divider)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      placeholder="https://instagram.com/username"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      defaultValue={profile.socialAccounts?.LinkedIn || profile.socialAccounts?.linkedin || ""}
                      className="w-full px-4 py-3 border border-[var(--color-divider)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                      placeholder="https://linkedin.com/in/username"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-[var(--color-divider)]">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    <span>
                      {isUploading 
                        ? `جاري الرفع ${uploadProgress}%...` 
                        : isSubmitting 
                          ? "جاري الحفظ..." 
                          : "حفظ التغييرات"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-background-light)] hover:bg-[var(--color-card)] text-[var(--color-text-primary)] rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-[var(--color-divider)]"
                  >
                    <X className="w-5 h-5" />
                    <span>إلغاء</span>
                  </button>
                </div>
              </fetcher.Form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
