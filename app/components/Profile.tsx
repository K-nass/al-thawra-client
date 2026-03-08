import { useState, useEffect } from "react";
import { useLoaderData, useActionData, useNavigation, useFetcher, Link } from "react-router";
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
  LogOut,
  Bookmark
} from "lucide-react";
import authService from "~/services/authService";
import profileService from "~/services/profileService";
import mediaService from "~/services/mediaService";
import type { UserProfile } from "~/services/profileService";
import type { Post } from "~/services/postsService";
import { showToast } from "~/components/Toast";
import { EmptyState } from "~/components/EmptyState";
import { PostCard } from "~/components/PostCard";

interface ProfileLoaderData {
  profile: UserProfile | null;
  savedPosts: Post[];
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
  const [activeTab, setActiveTab] = useState<'profile' | 'saved'>('profile');

  const isSubmitting = navigation.state === "submitting" || fetcher.state === "submitting" || isUploading;

  
  // Use updated profile from action if available, otherwise use loader data
  const profile = fetcher.data?.profile || actionData?.profile || loaderData?.profile;
  const savedPosts = loaderData?.savedPosts || [];
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
      <div dir="rtl" className="min-h-screen bg-[#d0e8f2] py-8">
        <div className="semafor-container">
          <div className="bg-[#d0e8f2] rounded-lg border border-red-200 p-8">
            <div className="text-center">
              <div className="text-red-600 text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">خطأ في تحميل الملف الشخصي</h2>
              <p className="text-gray-600">{loaderData.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#d0e8f2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">جاري التحميل...</p>
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
    <div dir="rtl" className="min-h-screen bg-[#d0e8f2] py-8">
      <div className="semafor-container">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-[#a8c5d4]/30 border border-green-600/30 rounded-lg flex items-center gap-3">
            <div className="text-green-700 text-xl">✓</div>
            <p className="text-gray-900 font-medium">{actionData?.message}</p>
          </div>
        )}

        {/* Error Message */}
        {actionData?.error && (
          <div className="mb-6 p-4 bg-[#a8c5d4]/30 border border-red-600/30 rounded-lg flex items-center gap-3">
            <div className="text-red-600 text-xl">⚠</div>
            <p className="text-gray-900 font-medium">{actionData.error}</p>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="mb-6 border-b border-dashed border-black/10">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 px-2 font-medium transition-colors relative ${
                activeTab === 'profile'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-4 h-4 inline-block ml-2" />
              الملف الشخصي
              {activeTab === 'profile' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-3 px-2 font-medium transition-colors relative ${
                activeTab === 'saved'
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Bookmark className="w-4 h-4 inline-block ml-2" />
              المقالات المحفوظة
              {savedPosts.length > 0 && (
                <span className="mr-2 text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">
                  {savedPosts.length}
                </span>
              )}
              {activeTab === 'saved' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
          </div>
        </div>

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-[#d0e8f2] rounded-lg border border-black/10 overflow-hidden">
            {/* Header Background */}
            <div className="h-32 bg-gradient-to-r from-[#a8c5d4] to-[#79a8bd] relative">
              <div className="absolute top-4 left-4">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#d0e8f2] hover:bg-[#a8c5d4] text-gray-900 rounded-lg transition-colors border border-black/10 font-medium text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    <span>تعديل الملف</span>
                  </button>
                )}
              </div>
            </div>

            {/* Profile Content */}
            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="flex justify-center -mt-16 mb-6">
                <div className="relative">
                  {avatarPreview || profile.avatarImageUrl ? (
                    <div className="relative">
                      <img
                        src={avatarPreview || profile.avatarImageUrl!}
                        alt={profile.userName}
                        loading="lazy"
                        decoding="async"
                        className="w-32 h-32 rounded-full object-cover border-4 border-[#d0e8f2] shadow-lg"
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <span className="text-xs">
                              {uploadProgress === 100 ? 'جاري المعالجة...' : `${uploadProgress}%`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#a8c5d4] to-[#79a8bd] flex items-center justify-center text-3xl font-bold text-gray-900 border-4 border-[#d0e8f2] shadow-lg relative">
                      {initials}
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <div className="text-white text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                            <span className="text-xs">
                              {uploadProgress === 100 ? 'جاري المعالجة...' : `${uploadProgress}%`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {isEditing && !isUploading && (
                    <label
                      htmlFor="avatar-upload"
                      title="تغيير الصورة الشخصية"
                      className="absolute bottom-0 left-0 w-10 h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-full flex items-center justify-center cursor-pointer transition-colors border-2 border-[#d0e8f2] shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                    </label>
                  )}
                </div>
              </div>

              {!isEditing ? (
                // View Mode
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.userName}</h1>
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-2">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                    {profile.slug && (
                      <p className="text-gray-500 text-sm">@{profile.slug}</p>
                    )}
                  </div>

                  {/* About Me */}
                  {profile.aboutMe && (
                    <div className="border-t border-dashed border-black/10 pt-6">
                      <h3 className="semafor-section-title text-gray-900 border-b border-black/10">نبذة عني</h3>
                      <p className="text-gray-700 leading-relaxed">{profile.aboutMe}</p>
                    </div>
                  )}

                  {/* Social Accounts */}
                  {Object.keys(profile.socialAccounts || {}).length > 0 && (
                    <div className="border-t border-dashed border-black/10 pt-6">
                      <h3 className="semafor-section-title text-gray-900 border-b border-black/10">حسابات التواصل الاجتماعي</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {(profile.socialAccounts.Facebook || profile.socialAccounts.facebook) && (
                          <a
                            href={profile.socialAccounts.Facebook || profile.socialAccounts.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 border border-dashed border-black/10 rounded-lg hover:bg-[#d0e8f2] transition-colors text-gray-700 hover:text-gray-900"
                          >
                            <Facebook className="w-5 h-5" />
                            <span className="text-sm font-medium">Facebook</span>
                          </a>
                        )}
                        {(profile.socialAccounts.Twitter || profile.socialAccounts.twitter) && (
                          <a
                            href={profile.socialAccounts.Twitter || profile.socialAccounts.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 border border-dashed border-black/10 rounded-lg hover:bg-[#d0e8f2] transition-colors text-gray-700 hover:text-gray-900"
                          >
                            <Twitter className="w-5 h-5" />
                            <span className="text-sm font-medium">Twitter</span>
                          </a>
                        )}
                        {(profile.socialAccounts.Instagram || profile.socialAccounts.instagram) && (
                          <a
                            href={profile.socialAccounts.Instagram || profile.socialAccounts.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 border border-dashed border-black/10 rounded-lg hover:bg-[#d0e8f2] transition-colors text-gray-700 hover:text-gray-900"
                          >
                            <Instagram className="w-5 h-5" />
                            <span className="text-sm font-medium">Instagram</span>
                          </a>
                        )}
                        {(profile.socialAccounts.LinkedIn || profile.socialAccounts.linkedin) && (
                          <a
                            href={profile.socialAccounts.LinkedIn || profile.socialAccounts.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-3 border border-dashed border-black/10 rounded-lg hover:bg-[#d0e8f2] transition-colors text-gray-700 hover:text-gray-900"
                          >
                            <Linkedin className="w-5 h-5" />
                            <span className="text-sm font-medium">LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Permissions Badge */}
                  {profile.hasAllPermissions && (
                    <div className="border-t border-dashed border-black/10 pt-6">
                      <p className="text-center p-3 bg-[#d0e8f2] border border-dashed border-black/10 rounded-lg text-gray-900 font-medium">
                        🔑 لديك صلاحيات كاملة
                      </p>
                    </div>
                  )}

                  {/* Logout Button */}
                  <div className="border-t border-dashed border-black/10 pt-6">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
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
                  <label htmlFor="userName" className="block text-sm font-medium text-gray-900 mb-2">
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
                      disabled={isSubmitting}
                      className="w-full pr-11 pl-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8c5d4] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  {errors.userName && (
                    <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
                  )}
                </div>

                {/* About Me */}
                <div>
                  <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-900 mb-2">
                    نبذة عني
                  </label>
                  <textarea
                    id="aboutMe"
                    name="aboutMe"
                    rows={4}
                    defaultValue={profile.aboutMe}
                    placeholder="اكتب نبذة مختصرة عنك..."
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8c5d4] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                  />
                </div>

                {/* Social Accounts */}
                <div className="border-t border-dashed border-black/10 pt-6">
                  <h3 className="semafor-section-title text-gray-900 border-b border-black/10 mb-4">حسابات التواصل الاجتماعي</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                        Facebook
                      </label>
                      <input
                        type="url"
                        id="facebook"
                        name="facebook"
                        defaultValue={profile.socialAccounts?.Facebook || profile.socialAccounts?.facebook || ""}
                        placeholder="https://facebook.com/username"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8c5d4] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-sm"
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
                        placeholder="https://twitter.com/username"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8c5d4] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-sm"
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
                        placeholder="https://instagram.com/username"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8c5d4] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-sm"
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
                        placeholder="https://linkedin.com/in/username"
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8c5d4] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 border-t border-dashed border-black/10 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                    onClick={() => {
                      setIsEditing(false);
                      setAvatarFile(null);
                      setAvatarPreview(null);
                    }}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-black/10 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5" />
                    <span>إلغاء</span>
                  </button>
                </div>
              </fetcher.Form>
            )}
          </div>
        </div>
        )}

        {/* Saved Articles Tab Content */}
        {activeTab === 'saved' && (
          <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-6">
            {savedPosts.length > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <Bookmark className="w-5 h-5 text-gray-900" />
                  <h2 className="text-xl font-bold text-gray-900">
                    المقالات المحفوظة ({savedPosts.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                title="لا توجد مقالات محفوظة"
                description="لم تقم بحفظ أي مقالات بعد. يمكنك حفظ المقالات المفضلة لديك للرجوع إليها لاحقاً."
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
