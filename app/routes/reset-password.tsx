import { useState, type FormEvent } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { Lock, Eye, EyeOff } from "lucide-react";
import authService from "../services/authService";
import { ScrollAnimation } from "~/components/ScrollAnimation";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.newPassword) {
      newErrors.newPassword = "كلمة المرور الجديدة مطلوبة";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "كلمة المرور غير متطابقة";
    }

    if (!token || !userId) {
      newErrors.general = "رابط غير صالح. يرجى طلب رابط جديد لإعادة تعيين كلمة المرور";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      
      try {
        await authService.resetPassword({
          token: token!,
          userId: userId!,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        });
        setSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (err: any) {
        setErrors({
          general: err.response?.data?.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور"
        });
      } finally {
        setLoading(false);
      }
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
              تم تغيير كلمة المرور بنجاح
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              تم إعادة تعيين كلمة المرور الخاصة بك بنجاح. سيتم توجيهك إلى صفحة تسجيل الدخول...
            </p>
            <Link
              to="/login"
              className="inline-block w-full py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium"
            >
              تسجيل الدخول الآن
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
          إعادة تعيين كلمة المرور
        </h2>
        <p className="text-[var(--color-text-secondary)] text-center mb-8">
          أدخل كلمة المرور الجديدة الخاصة بك
        </p>

        {/* General Error */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password Field */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${
                  errors.newPassword ? "border-red-500" : "border-[var(--color-divider)]"
                }`}
                placeholder="••••••••"
                dir="ltr"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--color-primary)] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
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
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all ${
                  errors.confirmPassword ? "border-red-500" : "border-[var(--color-divider)]"
                }`}
                placeholder="••••••••"
                dir="ltr"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--color-primary)] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
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
