import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";

export function Cart() {
  return (
    <div>
      <div>
        {/* Empty Cart Icon */}
        <div>
          <div>
            <div>
              <ShoppingCart />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1>
          بطاقة التسوق
        </h1>

        {/* Description */}
        <p>
          ليس لديك دورات مشتراة في حسابك المشتريات
        </p>

        <p>
          يمكنك الاستفادة من الدورات والمحاضرات والكتب الإلكترونية المتاحة
        </p>

        {/* CTA Button */}
        <Link 
          to="/"
        >
          الدورات
        </Link>
      </div>
    </div>
  );
}
