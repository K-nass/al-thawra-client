import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Send,
  Youtube,
  Twitter,
  Facebook,
  Instagram,
  TrendingUp,
  ShoppingCart,
  Mail,
  Newspaper,
  Tv,
  Bot,
  User,
  Podcast,
} from "lucide-react";
import type { Category } from "../../services/categoriesService";

interface HeaderProps {
  categories?: Category[];
}

export function Header({ categories = [] }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  
  // Filter and sort menu categories
  const menuCategories = categories
    .filter(cat => cat.showOnMenu && cat.isActive)
    .sort((a, b) => a.order - b.order)
    .slice(0, 8); // Limit to 8 categories for the menu

  return (
    <header
      className="sticky top-0 z-50 bg-white shadow-md"
      dir="rtl"
      lang="ar"
    >
      {/* Top Bar - Social & Info */}
      <div className="bg-gray-100 border-b border-gray-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-sm">
            {/* Right Side - Editor Info */}
            <div className="flex items-center gap-6 text-gray-700">
              <span className="font-medium">
                رئيس مجلس الادارة: سام الغبارى{" "}
              </span>
            </div>
            {/* Left Side - Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://t.me/althawra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@althawra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/althawra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/althawra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/althawra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-[var(--color-primary)]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Right Side - Logo */}
            <Link
              to="/"
              className="text-white text-3xl font-black italic hover:opacity-90 transition-opacity"
            >
              <img
                src="/logo.png"
                alt="الثورة لوجو"
                style={{ width: "100px" }}
              />
            </Link>
            <nav className="hidden lg:flex items-center gap-1 text-white">
              <Link
                className={`flex items-center gap-2 px-4 py-3 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded-xl transition-all duration-300 hover:scale-105 group ${
                  location.pathname === "/" ? "font-bold bg-white rounded-full bg-opacity-10 text-[var(--color-primary)]" : "font-semibold"
                }`}
                to="/"
              >
                <Newspaper className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>الصحيفة</span>
              </Link>

              <Link
                className={`flex items-center gap-2 px-4 py-3 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded-xl transition-all duration-300 hover:scale-105 group ${
                  location.pathname === "/tv" ? "font-bold bg-white bg-opacity-10 text-[var(--color-primary)]" : "font-semibold"
                }`}
                to="/tv"
              >
                <Tv className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>التلفزيون</span>
              </Link>

              <Link
                className={`flex items-center gap-2 px-4 py-3 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded-xl transition-all duration-300 hover:scale-105 group ${
                  location.pathname === "/ai" ? "font-bold bg-white bg-opacity-10 text-[var(--color-primary)]" : "font-semibold"
                }`}
                to="/ai"
              >
                <Bot className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>AI</span>
              </Link>

              <Link
                className={`flex items-center gap-2 px-4 py-3 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded-xl transition-all duration-300 hover:scale-105 group ${
                  location.pathname === "/profile" ? "font-bold bg-white bg-opacity-10 text-[var(--color-primary)]" : "font-semibold"
                }`}
                to="/profile"
              >
                <User className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>صفحتي</span>
              </Link>

              {/* Separator */}
              <div className="h-6 w-px bg-white bg-opacity-30 mx-2"></div>

              <Link
                className={`flex items-center gap-2 px-4 py-3 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded-xl transition-all duration-300 hover:scale-105 group ${
                  location.pathname === "/podcast" ? "font-bold bg-white bg-opacity-10 text-[var(--color-primary)]" : "font-semibold"
                }`}
                to="/podcast"
              >
                <Podcast className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>بودكاست</span>
              </Link>

              {/* Optional More dropdown with enhanced styling */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-3 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded-xl transition-all duration-300 hover:scale-105 font-semibold">
                  <span>المزيد</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>

                {/* Dropdown menu - you can add this later */}
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="py-2">{/* Add dropdown items here */}</div>
                </div>
              </div>
            </nav>

            {/* Left Side - Actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden md:block px-4 py-2 text-white hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors font-medium"
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/cart"
                className="hidden md:flex items-center gap-2 px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-[var(--color-primary)] transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>الاشتراكات</span>
              </Link>
              <Link
                to="/contact"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-white hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors"
              >
                <Mail className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-white hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors"
                aria-label="بحث"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors"
                aria-label="القائمة"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar - Categories */}
      <div className="bg-gray-100 border-b border-gray-300">
        <div className="container mx-auto px-4">
          <nav className="hidden lg:flex items-center justify-start gap-1 py-2">
            <Link
              className="px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-white rounded transition-colors font-medium"
              to="/"
            >
              عدد اليوم
            </Link>
            {menuCategories.map((category) => (
              <Link
                key={category.id}
                className="px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-white rounded transition-colors font-medium"
                to={`/category/${category.slug}`}
              >
                {category.name}
              </Link>
            ))}
            <Link
              className="flex items-center gap-1 px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-white rounded transition-colors font-medium"
              to="/categories"
            >
              المزيد
              <ChevronDown className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2">
              <input
                type="search"
                placeholder="ابحث في الثورة..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                autoFocus
                dir="rtl"
              />
              <button className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium">
                بحث
              </button>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[var(--color-primary-dark)]">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2 text-white">
            <Link
              className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors"
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              الصحيفة
            </Link>
            <Link
              className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors"
              to="/category/local"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              محليات
            </Link>
            <Link
              className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors"
              to="/category/opinion"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              كتاب وآراء
            </Link>
            <Link
              className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors"
              to="/category/economy"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              اقتصاد
            </Link>
            <Link
              className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors"
              to="/category/international"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              الثورة الدولي
            </Link>
            <Link
              className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors"
              to="/category/lite"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              لايت
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
