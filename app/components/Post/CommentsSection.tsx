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
    <div>
      <div>
        <div>
          <p>
            قسم التعليقات متوفّر لجميع قرّاء{" "}
            <span>
              الثورة
            </span>{" "}
            عبر حساب مجّاني. شاركنا رأيك في الأخبار والتحليلات.
          </p>
        </div>
        <div>
          <button
            onClick={handleRegister}
          >
            تسجيل حساب مجاني
          </button>
          <div>
            <span>
              لديك حساب؟
            </span>
            <button
              onClick={handleLogin}
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
