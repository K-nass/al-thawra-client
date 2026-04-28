import { Link } from "react-router";
import { Home, ArrowRight } from "lucide-react";

export const handle = {
  disableLayout: true,
};

export function meta() {
  return [
    { title: "الصفحة غير موجودة - الثورة" },
    { name: "description", content: "الصفحة التي تبحث عنها غير موجودة" },
  ];
}

export default function NotFoundPage() {
  return (
    <div dir="rtl" className="min-h-screen px-4 py-8 sm:py-10">
      <div className="semafor-container">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center">
          <div className="flex w-full max-w-3xl flex-col items-center text-center">
            <p className="latin-numerals mb-6 text-xs font-medium uppercase tracking-[0.35em] text-gray-700 sm:mb-8">
              Error: 404 Page Not Found
            </p>

            <div className="relative mb-8 w-full max-w-2xl px-2 sm:mb-10">
              <div className="pointer-events-none absolute left-0 right-0 top-1/2 hidden -translate-y-1/2 sm:block">
                <div className="mx-auto h-px w-full max-w-xl bg-black/10" />
              </div>
              <div className="relative mx-auto flex h-44 w-44 items-center justify-center rounded-full border-2 border-dashed border-black/30 bg-[#b8d4e0]/35 sm:h-56 sm:w-56">
                <div className="absolute -top-4 right-4 h-6 w-6 rounded-full border border-black/15 bg-[#a8c5d4]/70 sm:-top-5 sm:right-6" />
                <div className="absolute -bottom-3 left-5 h-4 w-4 rounded-full bg-black/10 sm:left-8" />
                <div className="relative text-center">
                  <div className="latin-numerals text-5xl font-black tracking-[0.22em] text-gray-900 sm:text-7xl">
                    404
                  </div>
                  <div className="mx-auto mt-3 h-px w-16 bg-black/20 sm:w-20" />
                </div>
              </div>
            </div>

            <div className="w-full max-w-3xl space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-black leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                  الصفحة غير موجودة
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
