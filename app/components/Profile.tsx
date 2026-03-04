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
      <div dir="rtl">
        <div>
          <div>
            <div>⚠️</div>
            <h2>خطأ في تحميل الملف الشخصي</h2>
            <p>{loaderData.error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <div>
          <div></div>
          <p>جاري التحميل...</p>
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
    <div dir="rtl">
      <div>
        {/* Success Message */}
        {showSuccess && (
          <div>
            <div>✓</div>
            <p>{actionData?.message}</p>
          </div>
        )}

        {/* Error Message */}
        {actionData?.error && (
          <div>
            <div>⚠</div>
            <p>{actionData.error}</p>
          </div>
        )}

        {/* Profile Card */}
        <div>
          {/* Header Background */}
          <div>
            <div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                >
                  <Edit />
                  <span>تعديل الملف</span>
                </button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div>
              {/* Avatar */}
            <div>
              <div>
                {avatarPreview || profile.avatarImageUrl ? (
                  <div>
                    <img
                      src={avatarPreview || profile.avatarImageUrl!}
                      alt={profile.userName}
                      loading="lazy"
                      decoding="async"
                    />
                    {isUploading && (
                      <div>
                        <div></div>
                        <span>
                          {uploadProgress === 100 ? 'جاري المعالجة...' : `${uploadProgress}%`}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                  >
                    {initials}
                    {isUploading && (
                      <div>
                         <div></div>
                         <span>
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
                      title="تغيير الصورة الشخصية"
                    >
                      <Camera />
                    </label>
                  </>
                )}
              </div>
            </div>

            {!isEditing ? (
              // View Mode
              <div>
                {/* User Info */}
                <div>
                  <h1>{profile.userName}</h1>
                  <div>
                    <Mail />
                    <span>{profile.email}</span>
                  </div>
                  {profile.slug && (
                    <p>@{profile.slug}</p>
                  )}
                </div>

                {/* About Me */}
                {profile.aboutMe && (
                  <div>
                    <h3>نبذة عني</h3>
                    <p>{profile.aboutMe}</p>
                  </div>
                )}

                {/* Social Accounts */}
                {Object.keys(profile.socialAccounts || {}).length > 0 && (
                  <div>
                    <h3>حسابات التواصل الاجتماعي</h3>
                    <div>
                      {(profile.socialAccounts.Facebook || profile.socialAccounts.facebook) && (
                        <a
                          href={profile.socialAccounts.Facebook || profile.socialAccounts.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Facebook />
                          <span>Facebook</span>
                        </a>
                      )}
                      {(profile.socialAccounts.Twitter || profile.socialAccounts.twitter) && (
                        <a
                          href={profile.socialAccounts.Twitter || profile.socialAccounts.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Twitter />
                          <span>Twitter</span>
                        </a>
                      )}
                      {(profile.socialAccounts.Instagram || profile.socialAccounts.instagram) && (
                        <a
                          href={profile.socialAccounts.Instagram || profile.socialAccounts.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram />
                          <span>Instagram</span>
                        </a>
                      )}
                      {(profile.socialAccounts.LinkedIn || profile.socialAccounts.linkedin) && (
                        <a
                          href={profile.socialAccounts.LinkedIn || profile.socialAccounts.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin />
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Permissions Badge */}
                {profile.hasAllPermissions && (
                  <div>
                    <p>
                      🔑 لديك صلاحيات كاملة
                    </p>
                  </div>
                )}

                {/* Logout Button */}
                <div>
                  <button
                    onClick={handleLogout}
                  >
                    <LogOut />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            ) : (
              // Edit Mode
              <fetcher.Form 
                method="post" 
                encType="multipart/form-data"
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
                  <label htmlFor="userName">
                    اسم المستخدم *
                  </label>
                  <div>
                    <div>
                      <User />
                    </div>
                    <input
                      type="text"
                      id="userName"
                      name="userName"
                      defaultValue={profile.userName}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.userName && (
                    <p>{errors.userName}</p>
                  )}
                </div>

                {/* About Me */}
                <div>
                  <label htmlFor="aboutMe">
                    نبذة عني
                  </label>
                  <textarea
                    id="aboutMe"
                    name="aboutMe"
                    rows={4}
                    defaultValue={profile.aboutMe}
                    placeholder="اكتب نبذة مختصرة عنك..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Social Accounts */}
                <div>
                  <h3>حسابات التواصل الاجتماعي</h3>
                  
                  <div>
                    <label htmlFor="facebook">
                      Facebook
                    </label>
                    <input
                      type="url"
                      id="facebook"
                      name="facebook"
                      defaultValue={profile.socialAccounts?.Facebook || profile.socialAccounts?.facebook || ""}
                      placeholder="https://facebook.com/username"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="twitter">
                      Twitter
                    </label>
                    <input
                      type="url"
                      id="twitter"
                      name="twitter"
                      defaultValue={profile.socialAccounts?.Twitter || profile.socialAccounts?.twitter || ""}
                      placeholder="https://twitter.com/username"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="instagram">
                      Instagram
                    </label>
                    <input
                      type="url"
                      id="instagram"
                      name="instagram"
                      defaultValue={profile.socialAccounts?.Instagram || profile.socialAccounts?.instagram || ""}
                      placeholder="https://instagram.com/username"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="linkedin">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      defaultValue={profile.socialAccounts?.LinkedIn || profile.socialAccounts?.linkedin || ""}
                      placeholder="https://linkedin.com/in/username"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <Save />
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
                  >
                    <X />
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
