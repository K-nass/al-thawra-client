import { Link } from "react-router";
import { Home, ArrowRight } from "lucide-react";

export function meta() {
  return [
    { title: "الصفحة غير موجودة - الثورة" },
    { name: "description", content: "الصفحة التي تبحث عنها غير موجودة" },
  ];
}

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center mt-30" style={{ backgroundColor: "var(--color-background-light)" }}>
      <div className="text-center max-w-md mx-auto px-4">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="text-9xl font-black" style={{ color: "var(--color-primary)" }}>
            404
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
          الصفحة غير موجودة
        </h1>

        {/* Description */}
        <p className="text-lg mb-8" style={{ color: "var(--color-text-secondary)" }}>
          عذراً، الصفحة التي تبحث عنها غير موجودة أو قد تم حذفها. يرجى التحقق من الرابط والمحاولة مرة أخرى.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {/* Home Button */}
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Home className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-colors border"
            style={{
              borderColor: "var(--color-primary)",
              color: "var(--color-primary)",
            }}
          >
            <ArrowRight className="w-5 h-5" />
            <span>العودة للخلف</span>
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: "rgba(108, 117, 125, 0.2)" }}>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
            قد تكون مهتماً بـ:
          </p>
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="text-sm transition-colors hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              → الأخبار الرئيسية
            </Link>
            <Link
              to="/category/local"
              className="text-sm transition-colors hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              → أخبار محلية
            </Link>
            <Link
              to="/cart"
              className="text-sm transition-colors hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              → الاشتراكات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
