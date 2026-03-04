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
    <div className="mt-12 pt-8 border-t border-dashed border-black/10">
      <div className="border border-dashed border-black/10 rounded-lg p-6 text-center">
        <div className="mb-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            قسم التعليقات متوفّر لجميع قرّاء{" "}
            <span className="font-bold text-gray-900">
              الثورة
            </span>{" "}
            عبر حساب مجّاني. شاركنا رأيك في الأخبار والتحليلات.
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleRegister}
            className="px-6 py-2 text-sm text-gray-900 font-medium border border-dashed border-black/20 rounded-lg hover:bg-black/5 transition-all"
          >
            تسجيل حساب مجاني
          </button>
          
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>
              لديك حساب؟
            </span>
            <button
              onClick={handleLogin}
              className="text-gray-900 underline underline-offset-4 hover:text-gray-700 transition-colors"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
