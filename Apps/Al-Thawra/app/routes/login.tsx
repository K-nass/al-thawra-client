import { useState } from "react";
import { Link, Form, useActionData, useNavigation, redirect } from "react-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import type { Route } from "./+types/login";
import authService from "~/services/authService";

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
    await authService.login({ email, password });
    // Redirect to admin on successful login
    return redirect("/admin");
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
  const [showPassword, setShowPassword] = useState(false);

  const isSubmitting = navigation.state === "submitting";
  const errors = actionData?.errors || {};
  const generalError = actionData?.generalError || "";
  const previousValues = actionData?.values || { email: "" };

  return (
    <div className="flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
            {/* Title */}
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-8 text-center">
              تسجيل الدخول
            </h2>

            {/* General Error Message */}
            {generalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{generalError}</p>
              </div>
            )}

            {/* Login Form */}
            <Form method="post" className="space-y-5">
              {/* Email Field */}
              <div>
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
                    className={`w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="example@email.com"
                    dir="ltr"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
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
                    className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${
                      errors.password ? "border-red-500" : "border-gray-300"
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
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "جاري تسجيل الدخول..." : "الدخول"}
              </button>
            </Form>

          {/* Register Link */}
          <div className="text-center mt-6">
            <Link
              to="/register"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors text-sm"
            >
              ليس لديك حساب؟ <span className="font-medium">سجل الآن</span>
            </Link>
        </div>
      </div>
    </div>
  );
}
