import { useState, useEffect, useRef } from "react";
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
  LogOut,
  FileText,
  PenTool,
  Moon,
  Sun,
  Film,
} from "lucide-react";
import type { Category } from "../../services/categoriesService";
import authService from "../../services/authService";
import { useTheme } from "../../contexts/ThemeContext";

interface HeaderProps {
  categories?: Category[];
  ceoName?: string;
}

export function Header({ categories = [], ceoName }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Get current user from cookies
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, [location.pathname]);

  // Close More menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const moreMenuRef = document.getElementById('more-menu-container');
      if (moreMenuRef && !moreMenuRef.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };

    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMoreMenuOpen]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isProfileMenuOpen]);
  // Filter and sort menu categories
  const allMenuCategories = categories
    .filter(cat => cat.showOnMenu && cat.isActive)
    .sort((a, b) => a.order - b.order);

  // Split categories: first 6 in main menu, rest in "More" dropdown
  const visibleCategories = allMenuCategories.slice(0, 6);
  const moreCategories = allMenuCategories.slice(6);

  return (
    <header
      dir="rtl"
      lang="ar"
      className="w-full border-b border-dashed border-black/10 pb-4"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-2 text-xs font-semibold uppercase tracking-wider text-gray-600 border-b border-dashed border-black/20 mb-4">
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1 px-2 py-1 border border-dashed border-black/10 rounded-sm cursor-pointer">
              رٍئيس مجٍلُِس الُِادِارٍة: {ceoName || "سام عٍبَدِ الُِلُِه الُِغبَارٍى"}
            </span>
          </div>

          <div className="text-center italic font-serif text-gray-500 normal-case hidden md:block">
            صحيفة الثورة اليمنية
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="بحث"
              className="p-1 rounded hover:bg-gray-200 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            <Link
              to="/contact"
              className="hover:text-blue-600 transition-colors"
            >
              اتصل بنا
            </Link>

            {currentUser ? (
              <div ref={profileDropdownRef} className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                >
                  <span>{currentUser.userName || currentUser.username}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 border border-dashed border-black/10 rounded-sm shadow-lg z-50">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>صفحتي</span>
                    </Link>
                    <button
                      onClick={() => {
                        authService.logout();
                        setCurrentUser(null);
                        setIsProfileMenuOpen(false);
                        window.location.href = '/';
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors text-right"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="hover:text-blue-600 transition-colors">
                <Link to="/login">تسجيل الدخول</Link>
              </button>
            )}
          </div>
        </div>

        {/* Main Header Section */}
        <div className="flex flex-col md:flex-row justify-center items-center py-2 gap-4">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center">
            <nav className="flex gap-4 items-center text-sm text-gray-900">
              <Link
                to="/"
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <Newspaper className="w-4 h-4" />
                <span>الصحيفة</span>
              </Link>

              <Link
                to="/magazines"
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>أرشيف الثورة</span>
              </Link>

              <Link
                to="/tv"
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <Tv className="w-4 h-4" />
                <span>التلفزيون</span>
              </Link>
            </nav>
          </div>

          {/* Center Logo */}
          <div className="text-center">
            <Link to="/">
              <img
                src="/formLogo.png"
                alt="الثورة لوجو"
                className="h-16 md:h-20 mx-auto"
              />
            </Link>
          </div>

          {/* Right Navigation */}
          <nav className="hidden md:flex gap-4 items-center text-sm text-gray-900">
            <Link
              to="/reels"
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <Film className="w-4 h-4" />
              <span>ريلز</span>
            </Link>

            <Link
              to="/podcast"
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <Podcast className="w-4 h-4" />
              <span>بودكاست</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>صفحتي</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden self-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="القائمة"
              className="p-2 hover:bg-gray-200 rounded transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Navigation - Categories */}
        <nav className="border-t border-b border-dashed border-black/10 py-3 mt-4 overflow-x-auto">
          <ul className="flex justify-center min-w-max md:min-w-0 space-x-reverse space-x-6 lg:space-x-10 text-sm font-sans text-gray-800">
            <li>
              <Link
                to="/"
                className="hover:text-blue-600 hover:underline decoration-2 underline-offset-4 font-medium"
              >
                عدد اليوم
              </Link>
            </li>
            {visibleCategories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/category/${category.slug}`}
                  className="hover:text-blue-600 hover:underline decoration-2 underline-offset-4"
                >
                  {category.name}
                </Link>
              </li>
            ))}

            {moreCategories.length > 0 && (
              <li className="relative" id="more-menu-container">
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className="flex items-center gap-1 hover:text-blue-600 hover:underline decoration-2 underline-offset-4"
                >
                  المزيد
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isMoreMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-dashed border-black/10 rounded-sm shadow-lg z-50">
                    {moreCategories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.slug}`}
                        onClick={() => setIsMoreMenuOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                }
              }}
              className="flex gap-2 items-center"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في الثورة..."
                  autoFocus
                  dir="rtl"
                  className="w-full px-4 py-2 pr-10 border border-dashed border-black/10 rounded-lg bg-transparent text-gray-900 placeholder:text-gray-500 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded-full transition-colors"
                    aria-label="مسح"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-2 text-gray-900 font-medium border border-dashed border-black/20 rounded-lg hover:bg-black/5 transition-all"
              >
                بحث
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="إغلاق"
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-dashed border-black/10">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-gray-100 rounded transition-colors"
            >
              الصحيفة
            </Link>
            <Link
              to="/magazines"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-gray-100 rounded transition-colors"
            >
              أرشيف الثورة
            </Link>
            <Link
              to="/tv"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-gray-100 rounded transition-colors"
            >
              التلفزيون
            </Link>
            <Link
              to="/reels"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-gray-100 rounded transition-colors"
            >
              ريلز
            </Link>
            <Link
              to="/podcast"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-gray-100 rounded transition-colors"
            >
              بودكاست
            </Link>
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-gray-100 rounded transition-colors"
            >
              صفحتي
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 hover:bg-gray-100 rounded transition-colors"
            >
              اتصل بنا
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
