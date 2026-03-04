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
    <div>
      <div>
        {/* 404 Icon */}
        <div>
          <div>
            404
          </div>
        </div>

        {/* Title */}
        <h1>
          الصفحة غير موجودة
        </h1>

        {/* Description */}
        <p>
          عذراً، الصفحة التي تبحث عنها غير موجودة أو قد تم حذفها. يرجى التحقق من الرابط والمحاولة مرة أخرى.
        </p>

        {/* CTA Buttons */}
        <div>
          {/* Home Button */}
          <Link
            to="/"
          >
            <Home />
            <span>العودة للرئيسية</span>
          </Link>

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
          >
            <ArrowRight />
            <span>العودة للخلف</span>
          </button>
        </div>

        {/* Suggestions */}
        <div>
          <p>
            قد تكون مهتماً بـ:
          </p>
          <div>
            <Link
              to="/"
            >
              → الأخبار الرئيسية
            </Link>
            <Link
              to="/category/local"
            >
              → أخبار محلية
            </Link>
            <Link
              to="/cart"
            >
              → الاشتراكات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
