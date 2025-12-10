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
} from "lucide-react";
import type { Category } from "../../services/categoriesService";
import authService from "../../services/authService";
import { useTheme } from "../../contexts/ThemeContext";

interface HeaderProps {
  categories?: Category[];
}

export function Header({ categories = [] }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const location = useLocation();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Get current user from cookies
    const user = authService.getCurrentUser();
    console.log("Header - Current user:", user);
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
      className="sticky top-0 z-50 bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] shadow-md"
    >
      {/* Top Bar - Social & Info */}
      <div className="bg-[var(--color-white)] border-b border-[var(--color-divider)]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-sm">
            {/* Right Side - Editor Info */}
            <div className="flex items-center">
              <span className="font-bold font-thuluth text-lg">
                رٍئيس مجٍلُِس الُِادِارٍة: سام عٍبَدِ الُِلُِه الُِغبَارٍى
              </span>
            </div>
            {/* Left Side - Icons & Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                aria-label={theme === "light" ? "التبديل إلى الوضع الداكن" : "التبديل إلى الوضع الفاتح"}
                title={theme === "light" ? "الوضع الداكن" : "الوضع الفاتح"}
              >
                {theme === "light" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
              </button>
              {/* remove cart for now */}
              {/* <Link
                to="/cart"
                className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="السلة"
              >
                <ShoppingCart className="w-4 h-4" />
              </Link> */}

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                aria-label="بحث"
              >
                <Search className="w-4 h-4" />
              </button>

              <Link
                to="/contact"
                className="flex items-center gap-2 px-3 py-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors font-medium"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">اتصل بنا</span>
              </Link>

              {/* Profile Dropdown or Login Button */}
              {currentUser ? (
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors font-medium"
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="hidden sm:inline">{currentUser.userName || currentUser.username}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div
                      className="absolute top-full right-0 mt-1 w-48 bg-[var(--color-white)] rounded-lg shadow-lg border border-[var(--color-divider)] py-2 z-50"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-light)] transition-colors font-medium"
                        onClick={() => setIsProfileMenuOpen(false)}
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
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-gray-50 transition-colors font-medium text-right"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors font-medium"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">تسجيل الدخول</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Right Side - Navigation & Logo */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link
                to="/"
                className="text-white hover:opacity-90 transition-opacity"
              >
                <img
                  src="/logo.png"
                  alt="الثورة لوجو"
                  style={{ width: "130px" }}
                />
              </Link>

              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-6">
                <Link
                  className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-all group text-white ${location.pathname === "/"
                    ? "border-white font-bold"
                    : "border-transparent hover:border-white/50"
                    }`}
                  to="/"
                >
                  <Newspaper className="w-4 h-4" />
                  <span>الصحيفة</span>
                </Link>

                <Link
                  className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-all group text-white ${location.pathname === "/magazines"
                    ? "border-white font-bold"
                    : "border-transparent hover:border-white/50"
                    }`}
                  to="/magazines"
                >
                  <FileText className="w-4 h-4" />
                  <span>أرشيف الثورة</span>
                </Link>

                <Link
                  className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-all group text-white ${location.pathname === "/writers-opinions"
                    ? "border-white font-bold"
                    : "border-transparent hover:border-white/50"
                    }`}
                  to="/writers-opinions"
                >
                  <PenTool className="w-4 h-4" />
                  <span>كتاب وآراء</span>
                </Link>

                <Link
                  className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-all group text-white ${location.pathname === "/tv"
                    ? "border-white font-bold"
                    : "border-transparent hover:border-white/50"
                    }`}
                  to="/tv"
                >
                  <Tv className="w-4 h-4" />
                  <span>التلفزيون</span>
                </Link>

                <Link
                  className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-all group text-white ${location.pathname === "/podcast"
                    ? "border-white font-bold"
                    : "border-transparent hover:border-white/50"
                    }`}
                  to="/podcast"
                >
                  <Podcast className="w-4 h-4" />
                  <span>بودكاست</span>
                </Link>

                <Link
                  className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-all group text-white ${location.pathname === "/profile"
                    ? "border-white font-bold"
                    : "border-transparent hover:border-white/50"
                    }`}
                  to="/profile"
                >
                  <User className="w-4 h-4" />
                  <span>صفحتي</span>
                </Link>
              </nav>
            </div>

            {/* Left Side - Actions */}
            <div className="flex items-center gap-2">

              {/* President Image - Large Circular */}
              <div className="">
                <img
                  src="/images/rashad-al-alimi.jpg"
                  alt="رئيس المجلس الرئاسي - رشاد العليمي"
                  title="رئيس المجلس الرئاسي - رشاد العليمي"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
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
      <div className="bg-[var(--color-white)] border-b border-[var(--color-divider)]">
        <div className="container mx-auto px-4">
          {/* Mobile Navigation (Scrollable, All Categories) */}
          <nav className="lg:hidden flex items-center justify-start gap-1 py-2 overflow-x-auto scrollbar-hide whitespace-nowrap">
            <Link
              to="/"
              className="px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-light)] rounded transition-colors font-medium shrink-0"
            >
              عدد اليوم
            </Link>
            {allMenuCategories.map((category) => (
              <Link
                key={category.id}
                className="px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-light)] rounded transition-colors font-medium shrink-0"
                to={`/category/${category.slug}`}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Navigation (Fixed, Dropdown for More) */}
          <nav className="hidden lg:flex items-center justify-start gap-1 py-2">
            <Link
              to="/"
              className="px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-light)] rounded transition-colors font-medium"
            >
              عدد اليوم
            </Link>
            {visibleCategories.map((category) => (
              <Link
                key={category.id}
                className="px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-light)] rounded transition-colors font-medium"
                to={`/category/${category.slug}`}
              >
                {category.name}
              </Link>
            ))}

            {/* More dropdown menu */}
            {moreCategories.length > 0 && (
              <div className="relative shrink-0" id="more-menu-container">
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className="flex items-center gap-1 px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-light)] rounded transition-colors font-medium"
                >
                  المزيد
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {isMoreMenuOpen && (
                  <div
                    style={{ top: '100%', right: 0 }}
                    className="absolute top-full right-0 mt-1 w-56 bg-[var(--color-white)] rounded-lg shadow-lg border border-[var(--color-divider)] py-2 z-50"
                  >
                    {moreCategories.map((category) => (
                      <Link
                        key={category.id}
                        className="block px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-light)] transition-colors font-medium"
                        to={`/category/${category.slug}`}
                        onClick={() => setIsMoreMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="bg-[var(--color-white)] border-b border-[var(--color-divider)]">
          <div className="container mx-auto px-4 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get("q") as string;
                if (query.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
                }
              }}
              className="flex items-center gap-2"
            >
              <input
                type="search"
                name="q"
                placeholder="ابحث في الثورة..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                autoFocus
                dir="rtl"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium"
              >
                بحث
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-gray-600 hover:text-[var(--color-primary)] transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
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
              to="/magazines"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              أرشيف الثورة
            </Link>
            <Link
              className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors"
              to="/writers-opinions"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              كتاب وآراء
            </Link>
            <Link
              className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors"
              to="/tv"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              التلفزيون
            </Link>
            <Link
              className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors"
              to="/podcast"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              بودكاست
            </Link>
            <Link
              className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors"
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              صفحتي
            </Link>
            <Link
              className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors"
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              اتصل بنا
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
