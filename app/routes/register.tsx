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
    <div>
      {/* Animated Background Pattern */}
      <div>
        {/* Geometric shapes */}
        <div></div>
        <div></div>
        <div></div>

        {/* Grid pattern */}
        <div></div>

        {/* Floating elements */}
        <div></div>
        <div></div>
        <div></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div>
          {/* Back to Home Link */}
          <Link
            to="/"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            العودة للرئيسية
          </Link>

          {/* Logo */}
          <div>
            <Link to="/">
              <img
                src="/formLogo.png"
                alt="الثورة"
              />
            </Link>
          </div>

          {/* Title */}
          <h2>
            إنشاء حساب جديد
          </h2>

          {/* General Error Message */}
          {generalError && (
            <div>
              <p>{generalError}</p>
            </div>
          )}

          {/* Register Form */}
          <Form method="post">
            <StaggerContainer staggerDelay={0.1} once={true} immediate={true}>
              {/* Username Field */}
              <StaggerItem>
                <label htmlFor="username">
                  اسم المستخدم
                </label>
                <div>
                  <div>
                    <User />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    defaultValue={previousValues.username}
                    placeholder="أدخل اسم المستخدم"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.username && (
                  <p>{errors.username}</p>
                )}
              </StaggerItem>

              {/* Email Field */}
              <StaggerItem>
                <label htmlFor="email">
                  البريد الإلكتروني
                </label>
                <div>
                  <div>
                    <Mail />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={previousValues.email}
                    placeholder="example@email.com"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p>{errors.email}</p>
                )}
              </StaggerItem>

              {/* Password Field */}
              <StaggerItem>
                <label htmlFor="password">
                  كلمة المرور
                </label>
                <div>
                  <div>
                    <Lock />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p>{errors.password}</p>
                )}
              </StaggerItem>

              {/* Confirm Password Field */}
              <StaggerItem>
                <label htmlFor="confirmPassword">
                  تأكيد كلمة المرور
                </label>
                <div>
                  <div>
                    <Lock />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p>{errors.confirmPassword}</p>
                )}
              </StaggerItem>

              {/* Submit Button */}
              <StaggerItem>
                <button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                </button>
              </StaggerItem>
            </StaggerContainer>
          </Form>

          {/* Login Link */}
          <ScrollAnimation animation="fade" delay={0.5} once={true}>
            <div>
              <Link
                to="/login"
              >
                لديك حساب بالفعل؟ <span>تسجيل الدخول</span>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </motion.div>
    </div>
  );
}
