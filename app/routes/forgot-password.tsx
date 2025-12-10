import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Mail } from "lucide-react";
import authService from "../services/authService";
import { ScrollAnimation } from "~/components/ScrollAnimation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!email) {
      setError("البريد الإلكتروني مطلوب");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("البريد الإلكتروني غير صالح");
      return;
    }

    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center p-4 bg-[var(--color-background-light)]">
        <ScrollAnimation animation="scale" duration={0.5}>
          <div className="max-w-md w-full bg-[var(--color-white)] rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
              تم إرسال الرابط
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك.
            </p>
            <Link
              to="/login"
              className="inline-block w-full py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium"
            >
              العودة إلى تسجيل الدخول
            </Link>
          </div>
          </div>
        </ScrollAnimation>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 bg-[var(--color-background-light)]">
      <ScrollAnimation animation="scale" duration={0.5}>
        <div className="max-w-md w-full bg-[var(--color-white)] rounded-2xl shadow-xl p-8">
        {/* Title */}
        <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2 text-center">
          نسيت كلمة المرور؟
        </h2>
        <p className="text-[var(--color-text-secondary)] text-center mb-8">
          أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 pl-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${
                  error ? "border-red-500" : "border-[var(--color-divider)]"
                }`}
                placeholder="example@email.com"
                dir="ltr"
                disabled={loading}
              />
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors text-sm"
          >
            العودة إلى تسجيل الدخول
          </Link>
        </div>
        </div>
      </ScrollAnimation>
    </div>
  );
}
