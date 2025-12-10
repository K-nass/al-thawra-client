import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";

export function Cart() {
  return (
    <div className="flex items-center justify-center mt-30" style={{ backgroundColor: "var(--color-background-light)" }}>
      <div className="text-center max-w-md mx-auto px-4">
        {/* Empty Cart Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-[var(--color-white)] rounded-lg shadow-md flex items-center justify-center">
              <ShoppingCart className="w-12 h-12" style={{ color: "var(--color-primary)" }} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>
          بطاقة التسوق
        </h1>

        {/* Description */}
        <p className="text-lg font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
          ليس لديك دورات مشتراة في حسابك المشتريات
        </p>

        <p className="text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>
          يمكنك الاستفادة من الدورات والمحاضرات والكتب الإلكترونية المتاحة
        </p>

        {/* CTA Button */}
        <Link 
          to="/"
          className="inline-block px-8 py-3 rounded-lg font-bold text-white transition-colors hover:opacity-90 full"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          الدورات
        </Link>
      </div>
    </div>
  );
}
