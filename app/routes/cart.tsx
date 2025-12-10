import type { Route } from "./+types/cart";
import { Cart } from "../components/Cart";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "بطاقة التسوق - الثورة" },
    { name: "description", content: "عرض بطاقة التسوق والدورات المشتراة" },
  ];
}

export default function CartPage() {
  return <Cart />;
}
