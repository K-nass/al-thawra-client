import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { X } from "lucide-react";
import { useSidebar } from "../contexts/SidebarContext";
import type { Category } from "../services/categoriesService";

interface CategorySidebarProps {
  categories?: Category[];
}

export function CategorySidebar({ categories = [] }: CategorySidebarProps) {
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const location = useLocation();

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen, closeSidebar]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Filter and sort menu categories
  const menuCategories = categories
    .filter(cat => cat.showOnMenu && cat.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-[#d0e8f2] shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        <div className="flex flex-col h-full">
          {/* Header with Logo */}
          <div className="flex flex-col items-center p-6 border-b border-dashed border-black/20">
            <Link to="/" onClick={closeSidebar}>
              <img
                src="/formLogo.png"
                alt="الثورة لوجو"
                className="h-16 mb-4"
              />
            </Link>
            <button
              onClick={closeSidebar}
              className="absolute top-6 left-6 p-2 hover:bg-black/5 rounded-full transition-colors"
              aria-label="إغلاق القائمة"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto scrollbar-hide">
            <ul className="py-4">
              {/* Home Link */}
              <li>
                <Link
                  to="/"
                  onClick={closeSidebar}
                  className={`flex items-center justify-between px-6 py-4 text-3xl text-gray-900 hover:bg-black/5 transition-colors border-b border-dashed border-black/10 ${
                    location.pathname === "/" ? "font-bold" : "font-normal"
                  }`}
                >
                  <span>الرئيسية</span>
                  {location.pathname === "/" && (
                    <span className="text-sm text-gray-600 font-bold">← أنت هنا</span>
                  )}
                </Link>
              </li>

              {/* Categories */}
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
                      {isActive && (
                        <span className="text-sm text-gray-600 font-bold">← أنت هنا</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Additional Links Section */}
            <div className="border-t border-dashed border-black/20 mt-4">
              <ul className="py-4">
                <li>
                  <Link
                    to="/magazines"
                    onClick={closeSidebar}
                    className="block px-6 py-2 text-sm text-gray-700 hover:bg-black/5 transition-colors"
                  >
                    أرشيف الثورة
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    onClick={closeSidebar}
                    className="block px-6 py-2 text-sm text-gray-700 hover:bg-black/5 transition-colors"
                  >
                    اتصل بنا
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tv"
                    onClick={closeSidebar}
                    className="block px-6 py-2 text-sm text-gray-700 hover:bg-black/5 transition-colors"
                  >
                    التلفزيون
                  </Link>
                </li>
              </ul>
            </div>

            {/* Footer Section */}
            <div className="border-t border-dashed border-black/20 mt-4">
              <ul className="py-4">
                <li>
                  <Link
                    to="/about"
                    onClick={closeSidebar}
                    className="block px-6 py-2 text-sm text-gray-700 hover:bg-black/5 transition-colors"
                  >
                    من نحن
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    onClick={closeSidebar}
                    className="block px-6 py-2 text-sm text-gray-700 hover:bg-black/5 transition-colors"
                  >
                    الخصوصية
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div className="px-6 py-4 text-xs text-gray-600">
              © 2026 الثورة اليمنية
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
