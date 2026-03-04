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
      <div>
        <ScrollAnimation animation="scale" duration={0.5}>
          <div>
          <div>
            <div>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2>
              تم إرسال الرابط
            </h2>
            <p>
              تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد الخاص بك.
            </p>
            <Link
              to="/login"
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
    <div>
      <ScrollAnimation animation="scale" duration={0.5}>
        <div>
        {/* Title */}
        <h2>
          نسيت كلمة المرور؟
        </h2>
        <p>
          أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                dir="ltr"
                disabled={loading}
              />
            </div>
            {error && (
              <p>{error}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
          </button>
        </form>

        {/* Back to Login */}
        <div>
          <Link
            to="/login"
          >
            العودة إلى تسجيل الدخول
          </Link>
        </div>
        </div>
      </ScrollAnimation>
    </div>
  );
}
