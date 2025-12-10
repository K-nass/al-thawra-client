import { useNavigate } from "react-router";

interface CommentsSectionProps {
  onRegister?: () => void;
  onLogin?: () => void;
  registerHref?: string;
  loginHref?: string;
}

export function CommentsSection({
  onRegister,
  onLogin,
  registerHref = "/register",
  loginHref = "/login",
}: CommentsSectionProps) {
  const navigate = useNavigate();

  const handleRegister = () => {
    if (onRegister) {
      onRegister();
    } else {
      navigate(registerHref);
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate(loginHref);
    }
  };

  return (
    <div className="my-12 py-8 border-t border-b" style={{ borderColor: "rgba(108, 117, 125, 0.2)" }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <p className="text-base leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
            قسم التعليقات متوفّر لجميع قرّاء{" "}
            <span className="font-bold">
              الثورة
            </span>{" "}
            عبر حساب مجّاني. شاركنا رأيك في الأخبار والتحليلات.
          </p>
        </div>
        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center gap-4 flex-row">
          <button
            onClick={handleRegister}
            className="px-6 py-2 text-center text-white rounded-md font-bold transition-colors duration-300 hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            تسجيل حساب مجاني
          </button>
          <div className="flex items-center justify-center gap-2 flex-row">
            <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              لديك حساب؟
            </span>
            <button
              onClick={handleLogin}
              className="text-sm font-bold hover:underline transition-colors"
              style={{ color: "var(--color-primary)" }}
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
