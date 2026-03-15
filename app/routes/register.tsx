import { useState, useEffect } from "react";
import { Link, Form, useActionData, useNavigation, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import type { Route } from "./+types/register";
import authService from "~/services/authService";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "~/components/ScrollAnimation";

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return { error: "Invalid request method" };
  }

  const formData = await request.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validation
  const errors: Record<string, string> = {};

  if (!username) {
    errors.username = "اسم المستخدم مطلوب";
  } else if (username.length < 3) {
    errors.username = "اسم المستخدم يجب أن يكون 3 أحرف على الأقل";
  }

  if (!email) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "البريد الإلكتروني غير صالح";
  }

  if (!password) {
    errors.password = "كلمة المرور مطلوبة";
  } else if (password.length < 8) {
    errors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "كلمة المرور غير متطابقة";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { username, email } };
  }

  try {
    const authResponse = await authService.register({
      username,
      email,
      password,
      confirmPassword,
    });
    // Return success with auth data - cookies will be set client-side
    return { success: true, authData: authResponse };
  } catch (error: any) {
    const generalError =
      error.response?.data?.title ||
      error.response?.data?.message ||
      "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.";

    // Handle field-level validation errors
    if (error.response?.data?.errors) {
      const fieldErrors: Record<string, string> = {};
      const apiErrors = error.response.data.errors;

      for (const [field, messages] of Object.entries(apiErrors)) {
        const fieldKey = field.toLowerCase();
        if (Array.isArray(messages)) {
          fieldErrors[fieldKey] = (messages as string[])[0];
        } else {
          fieldErrors[fieldKey] = messages as string;
        }
      }

      return { errors: fieldErrors, values: { username, email }, generalError };
    }

    return { generalError, values: { username, email } };
  }
};

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSubmitting = navigation.state === "submitting";
  const errors = actionData?.errors || {};
  const generalError = actionData?.generalError || "";
  const previousValues = actionData?.values || { username: "", email: "" };

  // Handle successful registration on client-side (similar to login)
  useEffect(() => {
    if (actionData?.success && actionData?.authData) {
      const { accessToken, refreshToken, user, expiresAt } = actionData.authData;

      if (typeof document !== 'undefined') {
        const setCookie = (name: string, value: string, expiresAt?: string) => {
          let expires = '';
          if (expiresAt) {
            const expiryDate = new Date(expiresAt);
            const now = new Date();

            if (expiryDate <= now) {
              const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
              expires = `; expires=${futureDate.toUTCString()}`;
            } else {
              expires = `; expires=${expiryDate.toUTCString()}`;
            }
          } else {
            const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            expires = `; expires=${futureDate.toUTCString()}`;
          }

          const secure = window.location.protocol === 'https:' ? '; Secure' : '';
          document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Strict${secure}`;
        };

        setCookie('accessToken', accessToken, expiresAt);
        setCookie('refreshToken', refreshToken, expiresAt);
        setCookie('user', JSON.stringify(user), expiresAt);

        // Redirect to admin or home based on role
        setTimeout(() => {
          if (user.role === 'Admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 100);
      }
    }
  }, [actionData, navigate]);

  return (
    <div className="min-h-screen bg-[#d0e8f2] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border-2 border-dashed border-[#a8c5d4] rounded-lg p-8 shadow-sm">
          {/* Back to Home Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#5a8ca8] hover:text-[#4a7c98] mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            العودة للرئيسية
          </Link>

          {/* Logo */}
          <div className="text-center mb-6">
            <Link to="/">
              <img
                src="/formLogo.png"
                alt="الثورة"
                className="h-16 mx-auto"
              />
            </Link>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            إنشاء حساب جديد
          </h2>

          {/* General Error Message */}
          {generalError && (
            <div className="mb-4 p-3 bg-red-50 border border-dashed border-red-300 rounded text-red-700 text-sm text-center">
              <p>{generalError}</p>
            </div>
          )}

          {/* Register Form */}
          <Form method="post" className="space-y-4">
            <StaggerContainer staggerDelay={0.1} once={true} immediate={true}>
              {/* Username Field */}
              <StaggerItem>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    اسم المستخدم
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8c5d4]">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      defaultValue={previousValues.username}
                      placeholder="أدخل اسم المستخدم"
                      disabled={isSubmitting}
                      className="w-full pr-10 pl-4 py-2 border-2 border-dashed border-[#a8c5d4] rounded focus:outline-none focus:border-[#5a8ca8] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>
              </StaggerItem>

              {/* Email Field */}
              <StaggerItem>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8c5d4]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      defaultValue={previousValues.email}
                      placeholder="example@email.com"
                      dir="ltr"
                      disabled={isSubmitting}
                      className="w-full pr-10 pl-4 py-2 border-2 border-dashed border-[#a8c5d4] rounded focus:outline-none focus:border-[#5a8ca8] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </StaggerItem>

              {/* Password Field */}
              <StaggerItem>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8c5d4]">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="••••••••"
                      dir="ltr"
                      disabled={isSubmitting}
                      className="w-full pr-10 pl-10 py-2 border-2 border-dashed border-[#a8c5d4] rounded focus:outline-none focus:border-[#5a8ca8] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8c5d4] hover:text-[#5a8ca8] disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </StaggerItem>

              {/* Confirm Password Field */}
              <StaggerItem>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a8c5d4]">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="••••••••"
                      dir="ltr"
                      disabled={isSubmitting}
                      className="w-full pr-10 pl-10 py-2 border-2 border-dashed border-[#a8c5d4] rounded focus:outline-none focus:border-[#5a8ca8] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isSubmitting}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a8c5d4] hover:text-[#5a8ca8] disabled:opacity-50"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </StaggerItem>

              {/* Submit Button */}
              <StaggerItem>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#5a8ca8] text-white rounded border-2 border-dashed border-[#5a8ca8] hover:bg-[#4a7c98] hover:border-[#4a7c98] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                </button>
              </StaggerItem>
            </StaggerContainer>
          </Form>

          {/* Login Link */}
          <ScrollAnimation animation="fade" delay={0.5} once={true}>
            <div className="mt-6 text-center text-sm text-gray-600">
              <Link
                to="/login"
                className="hover:text-[#5a8ca8] transition-colors"
              >
                لديك حساب بالفعل؟ <span className="text-[#5a8ca8] font-medium">تسجيل الدخول</span>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
}
