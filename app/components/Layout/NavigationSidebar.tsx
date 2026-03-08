import { Link } from "react-router";
import { X } from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";
import type { Category } from "../../services/categoriesService";

interface NavigationSidebarProps {
  categories: Category[];
}

export function NavigationSidebar({ categories }: NavigationSidebarProps) {
  const { isSidebarOpen, closeSidebar } = useSidebar();

  const allMenuCategories = categories
    .filter(cat => cat.showOnMenu && cat.isActive)
    .sort((a, b) => a.order - b.order);

  if (!isSidebarOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={closeSidebar}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-80 bg-[#d0e8f2] z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dashed border-black/10">
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-[#a8c5d4] rounded transition-colors"
            aria-label="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-gray-800">الثورة</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col h-full overflow-y-auto">
          {/* Main Page Link */}
          <Link
            to="/"
            onClick={closeSidebar}
            className="px-4 py-3 text-gray-800 hover:bg-[#a8c5d4] transition-colors border-b border-dashed border-black/5"
          >
            الرئيسية
          </Link>

          {/* Categories */}
          {allMenuCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              onClick={closeSidebar}
              className="px-4 py-3 text-gray-800 hover:bg-[#a8c5d4] transition-colors border-b border-dashed border-black/5"
            >
              {category.name}
            </Link>
          ))}

          {/* Additional Links */}
          <div className="mt-4 border-t border-dashed border-black/10">
            <Link
              to="/magazines"
              onClick={closeSidebar}
              className="px-4 py-3 text-gray-800 hover:bg-[#a8c5d4] transition-colors border-b border-dashed border-black/5"
            >
              أرشيف الثورة
            </Link>
            <Link
              to="/tv"
              onClick={closeSidebar}
              className="px-4 py-3 text-gray-800 hover:bg-[#a8c5d4] transition-colors border-b border-dashed border-black/5"
            >
              التلفزيون
            </Link>
            <Link
              to="/reels"
              onClick={closeSidebar}
              className="px-4 py-3 text-gray-800 hover:bg-[#a8c5d4] transition-colors border-b border-dashed border-black/5"
            >
              ريلز
            </Link>
            <Link
              to="/podcast"
              onClick={closeSidebar}
              className="px-4 py-3 text-gray-800 hover:bg-[#a8c5d4] transition-colors border-b border-dashed border-black/5"
            >
              بودكاست
            </Link>
            <Link
              to="/contact"
              onClick={closeSidebar}
              className="px-4 py-3 text-gray-800 hover:bg-[#a8c5d4] transition-colors border-b border-dashed border-black/5"
            >
              اتصل بنا
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}