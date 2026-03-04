import { useState, useEffect } from "react";
import { Link, Form, useActionData, useNavigation, redirect, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import type { Route } from "./+types/login";
import authService from "~/services/authService";
import { motion } from "framer-motion";
import { ScrollAnimation, StaggerContainer, StaggerItem } from "~/components/ScrollAnimation";

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return { error: "Invalid request method" };
  }

  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validation
  const errors: Record<string, string> = {};

  if (!email) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "البريد الإلكتروني غير صالح";
  }

  if (!password) {
    errors.password = "كلمة المرور مطلوبة";
  } else if (password.length < 6) {
    errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { email } };
  }

  try {
    const authResponse = await authService.login({ email, password });
    // Return success with auth data - cookies will be set client-side
    return { success: true, authData: authResponse };
  } catch (error: any) {
    const generalError =
      error.response?.data?.title ||
      error.response?.data?.message ||
      "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.";

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

      return { errors: fieldErrors, values: { email }, generalError };
    }

    return { generalError, values: { email } };
  }
};

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const isSubmitting = navigation.state === "submitting";
  const errors = actionData?.errors || {};
  const generalError = actionData?.generalError || "";
  const previousValues = actionData?.values || { email: "" };

  // Handle successful login on client-side
  useEffect(() => {
    if (actionData?.success && actionData?.authData) {
      // Set cookies on client-side
      const { accessToken, refreshToken, user, expiresAt } = actionData.authData;

      // Use a helper to set cookies (will work because we're on client now)
      if (typeof document !== 'undefined') {
        const setCookie = (name: string, value: string, expiresAt?: string, httpOnly: boolean = false) => {
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

          // Note: HttpOnly cannot be set from JavaScript for security reasons
          // It must be set by the server in HTTP response headers
          // We can only set Secure and SameSite from client-side
          const secure = window.location.protocol === 'https:' ? '; Secure' : '';
          document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Strict${secure}`;
        };

        // Set tokens (ideally these should be HttpOnly from backend)
        setCookie('accessToken', accessToken, expiresAt, true);
        setCookie('refreshToken', refreshToken, expiresAt, true);
        // User data can be non-HttpOnly since it's not sensitive
        setCookie('user', JSON.stringify(user), expiresAt, false);


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
            تسجيل الدخول
          </h2>

          {/* General Error Message */}
          {generalError && (
            <div>
              <p>{generalError}</p>
            </div>
          )}

          {/* Login Form */}
          <Form method="post">
            <StaggerContainer staggerDelay={0.1} once={true} immediate={true}>
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

              {/* Forgot Password */}
              <StaggerItem>
                <div>
                  <Link
                    to="/forgot-password"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
              </StaggerItem>

              {/* Submit Button */}
              <StaggerItem>
                <button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "جاري تسجيل الدخول..." : "الدخول"}
                </button>
              </StaggerItem>
            </StaggerContainer>
          </Form>

          {/* Register Link */}
          <ScrollAnimation animation="fade" delay={0.5} once={true}>
            <div>
              <Link
                to="/register"
              >
                ليس لديك حساب؟ <span>سجل الآن</span>
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </motion.div>
    </div>
  );
}
