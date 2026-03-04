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
              تم تغيير كلمة المرور بنجاح
            </h2>
            <p>
              تم إعادة تعيين كلمة المرور الخاصة بك بنجاح. سيتم توجيهك إلى صفحة تسجيل الدخول...
            </p>
            <Link
              to="/login"
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
    <div>
      <ScrollAnimation animation="scale" duration={0.5}>
        <div>
        {/* Title */}
        <h2>
          إعادة تعيين كلمة المرور
        </h2>
        <p>
          أدخل كلمة المرور الجديدة الخاصة بك
        </p>

        {/* General Error */}
        {errors.general && (
          <div>
            <p>{errors.general}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div>
            <label htmlFor="newPassword">
              كلمة المرور الجديدة
            </label>
            <div>
              <div>
                <Lock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="••••••••"
                dir="ltr"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.newPassword && (
              <p>{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
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
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                dir="ltr"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p>{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
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
