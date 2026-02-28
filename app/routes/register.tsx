import { useState, useEffect } from "react";
import { Link, Form, useActionData, useNavigation, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import type { Route } from "./+types/register";
import authService from "~/services/authService";
import { motion } from "framer-motion";
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
      console.log('✅ Registration successful! Setting cookies on client-side...');

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

        console.log('✅ Cookies set successfully on client-side!');

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background-light)] overflow-hidden relative">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Geometric shapes */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-md w-full bg-[var(--color-white)]/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-h-[calc(100vh-4rem)] overflow-y-auto relative z-10 border border-[var(--color-divider)]/20">
          {/* Back to Home Link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            العودة للرئيسية
          </Link>

          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Link to="/">
              <img
                src="/formLogo.png"
                alt="الثورة"
                className="h-16 w-auto"
              />
            </Link>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6 text-center">
            إنشاء حساب جديد
          </h2>

          {/* General Error Message */}
          {generalError && (
            <div className="mb-4 p-3 bg-[var(--color-error)]/10 border border-[var(--color-error)] rounded-lg">
              <p className="text-sm text-[var(--color-error)]">{generalError}</p>
            </div>
          )}

          {/* Register Form */}
          <Form method="post">
            <StaggerContainer className="space-y-4" staggerDelay={0.1} once={true} immediate={true}>
              {/* Username Field */}
              <StaggerItem>
                <label htmlFor="username" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  اسم المستخدم
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    defaultValue={previousValues.username}
                    className={`w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${errors.username ? "border-[var(--color-error)]" : "border-[var(--color-divider)]"
                      }`}
                    placeholder="أدخل اسم المستخدم"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-[var(--color-error)]">{errors.username}</p>
                )}
              </StaggerItem>

              {/* Email Field */}
              <StaggerItem>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={previousValues.email}
                    className={`w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${errors.email ? "border-[var(--color-error)]" : "border-[var(--color-divider)]"
                      }`}
                    placeholder="example@email.com"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-[var(--color-error)]">{errors.email}</p>
                )}
              </StaggerItem>

              {/* Password Field */}
              <StaggerItem>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${errors.password ? "border-[var(--color-error)]" : "border-[var(--color-divider)]"
                      }`}
                    placeholder="••••••••"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--color-primary)] transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-[var(--color-error)]">{errors.password}</p>
                )}
              </StaggerItem>

              {/* Confirm Password Field */}
              <StaggerItem>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${errors.confirmPassword ? "border-[var(--color-error)]" : "border-[var(--color-divider)]"
                      }`}
                    placeholder="••••••••"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--color-primary)] transition-colors"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-[var(--color-error)]">{errors.confirmPassword}</p>
                )}
              </StaggerItem>

              {/* Submit Button */}
              <StaggerItem>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                </button>
              </StaggerItem>
            </StaggerContainer>
          </Form>

          {/* Login Link */}
          <ScrollAnimation animation="fade" delay={0.5} once={true}>
            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-[var(--color-text-primary)] hover:text-white transition-colors text-sm"
              >
                لديك حساب بالفعل؟ <span className="font-medium">تسجيل الدخول</span>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </motion.div>
    </div>
  );
}
