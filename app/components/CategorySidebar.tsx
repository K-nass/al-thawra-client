import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { X } from "lucide-react";
import { useSidebar } from "../contexts/SidebarContext";
import type { Category } from "../services/categoriesService";
import { DateTimeDisplay } from "./DateTimeDisplay";

interface CategorySidebarProps {
  categories?: Category[];
}

export function CategorySidebar({ categories = [] }: CategorySidebarProps) {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const location = useLocation();

  // On mobile, scroll to top when opening the inline menu
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSidebarOpen]);

  // Close sidebar on Escape key (desktop)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) closeSidebar();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen, closeSidebar]);



  const menuCategories = categories
    .filter(cat => cat.showOnMenu && cat.isActive)
    .sort((a, b) => a.order - b.order)
    .slice(0, 11);

  return (
    <>
      {/* MOBILE: Normal flow section — pushes content down, no overlay */}
      <div
        className={`md:hidden relative w-full bg-[#d0e8f2] border-b border-dashed border-black/20 overflow-hidden transition-all duration-500 ease-in-out z-10 ${
          isSidebarOpen ? "max-h-[2000px] py-4" : "max-h-0"
        }`}
        dir="rtl"
      >
        <div className="flex flex-col px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-dashed border-black/10">
            <div className="text-sm font-sans font-medium text-gray-700">
              <DateTimeDisplay />
            </div>
            <button
              onClick={closeSidebar}
              className="p-1 hover:bg-black/5 rounded-full transition-colors"
              aria-label="إغلاق التبويب"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-[1fr_130px] gap-4 mb-8">
            {/* Main Category Links */}
            <nav className="border-l border-dashed border-black/10 pl-4">
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    onClick={closeSidebar}
                    className={`block text-3xl font-bold tracking-tight ${
                      location.pathname === "/" ? "text-blue-700" : "text-gray-900 hover:text-blue-600"
                    }`}
                  >
                    الرئيسية
                  </Link>
                </li>
                {menuCategories.map((category) => {
                  const isActive = location.pathname === `/category/${category.slug}`;
                  return (
                    <li key={category.id}>
                      <Link
                        to={`/category/${category.slug}`}
                        onClick={closeSidebar}
                        className={`block text-3xl font-bold tracking-tight ${
                          isActive ? "text-blue-700" : "text-gray-900 hover:text-blue-600"
                        }`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Secondary Links */}
            <div className="flex flex-col justify-between py-1">
              <div className="space-y-4">
                {["magazines", "contact", "tv"].map((slug) => (
                  <Link
                    key={slug}
                    to={`/${slug}`}
                    onClick={closeSidebar}
                    className="block text-sm font-semibold text-gray-800 hover:text-blue-700 transition-colors"
                  >
                    {slug === "magazines" ? "أرشيف الثورة" : slug === "contact" ? "اتصل بنا" : "التلفزيون"}
                  </Link>
                ))}
              </div>
              <div className="mt-8 space-y-2 border-t border-dashed border-black/10 pt-4">
                <Link to="/about" onClick={closeSidebar} className="block text-xs font-semibold text-gray-600">من نحن</Link>
                <Link to="/privacy" onClick={closeSidebar} className="block text-xs font-semibold text-gray-600">الخصوصية</Link>
              </div>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="flex flex-col items-center pt-6 border-t border-dashed border-black/10">
            <p className="text-[10px] font-medium text-gray-500">© 2026 صحيفة الثورة اليمنية</p>
          </div>
        </div>
      </div>

      {/* DESKTOP: Fixed slide-in overlay sidebar */}
      {isSidebarOpen && (
        <div
          className="hidden md:block fixed inset-0 bg-black/50 z-[60] transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`hidden md:flex fixed top-0 right-0 h-full w-80 bg-[#d0e8f2] shadow-2xl z-[70] flex-col transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        {/* Header with Logo */}
        <div className="relative flex flex-col items-center p-6 border-b border-dashed border-black/20">
          <Link to="/" onClick={closeSidebar}>
            <img src="/formLogo.png" alt="الثورة لوجو" className="h-16 mb-4" />
          </Link>
          <button
            onClick={closeSidebar}
            className="absolute top-6 left-6 p-2 hover:bg-black/5 rounded-full transition-colors"
            aria-label="إغلاق القائمة"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide">
          <ul className="py-4">
            <li>
              <Link
                to="/"
                onClick={closeSidebar}
                className={`flex items-center justify-between px-6 py-4 text-3xl text-gray-900 hover:bg-black/5 transition-colors border-b border-dashed border-black/10 ${
                  location.pathname === "/" ? "font-bold" : "font-normal"
                }`}
              >
                <span>الرئيسية</span>
                {location.pathname === "/" && <span className="text-sm text-gray-600 font-bold">← أنت هنا</span>}
              </Link>
            </li>
            {menuCategories.map((category) => {
              const isActive = location.pathname === `/category/${category.slug}`;
              return (
                <li key={category.id}>
                  <Link
                    to={`/category/${category.slug}`}
                    onClick={closeSidebar}
                    className={`flex items-center justify-between px-6 py-4 text-3xl text-gray-900 hover:bg-black/5 transition-colors border-b border-dashed border-black/10 ${
                      isActive ? "font-bold" : "font-normal"
                    }`}
                  >
                    <span>{category.name}</span>
                    {isActive && <span className="text-sm text-gray-600 font-bold">← أنت هنا</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-dashed border-black/20 mt-4">
            <ul className="py-4">
              {["magazines", "contact", "tv"].map((slug) => (
                <li key={slug}>
                  <Link
                    to={`/${slug}`}
                    onClick={closeSidebar}
                    className="block px-6 py-2 text-sm text-gray-700 hover:bg-black/5 transition-colors"
                  >
                    {slug === "magazines" ? "أرشيف الثورة" : slug === "contact" ? "اتصل بنا" : "التلفزيون"}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-dashed border-black/20 mt-4">
            <ul className="py-4">
              <li>
                <Link to="/about" onClick={closeSidebar} className="block px-6 py-2 text-sm text-gray-700 hover:bg-black/5 transition-colors">من نحن</Link>
              </li>
              <li>
                <Link to="/privacy" onClick={closeSidebar} className="block px-6 py-2 text-sm text-gray-700 hover:bg-black/5 transition-colors">الخصوصية</Link>
              </li>
            </ul>
          </div>

          <div className="px-6 py-4 text-xs text-gray-600">© 2026 الثورة اليمنية</div>
        </nav>
      </aside>
    </>
  );
}
