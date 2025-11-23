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
} from "lucide-react";
import type { Category } from "../../services/categoriesService";
import authService from "../../services/authService";

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

  useEffect(() => {
    // Get current user from cookies
    const user = authService.getCurrentUser();
    console.log("Header - Current user:", user);
    setCurrentUser(user);
  }, [location.pathname]);

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
              <span className="font-bold text-base">
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
              <nav className="hidden lg:flex items-center gap-6 text-white">
                <Link
                  className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-all group ${location.pathname === "/"
                      ? "border-white text-white font-bold"
                      : "border-transparent hover:border-white/50"
                    }`}
                  to="/"
                >
                  <Newspaper className="w-4 h-4" />
                  <span>الصحيفة</span>
                </Link>

                <Link
                  className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-all group ${location.pathname === "/magazines"
                      ? "border-white text-white font-bold"
                      : "border-transparent hover:border-white/50"
                    }`}
                  to="/magazines"
                >
                  <FileText className="w-4 h-4" />
                  <span>أرشيف الثورة</span>
                </Link>

                <Link
                  className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-all group ${location.pathname === "/writers-opinions"
                      ? "border-white text-white font-bold"
                      : "border-transparent hover:border-white/50"
                    }`}
                  to="/writers-opinions"
                >
                  <PenTool className="w-4 h-4" />
                  <span>كتاب وآراء</span>
                </Link>

                <Link
                  className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-all group ${
                    location.pathname === "/tv" 
                      ? "border-white text-white font-bold" 
                      : "border-transparent hover:border-white/50"
                  }`}
                  to="/tv"
                >
                  <Tv className="w-4 h-4" />
                  <span>التلفزيون</span>
                </Link>
                
                <Link
                  className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-all group ${
                    location.pathname === "/podcast" 
                      ? "border-white text-white font-bold" 
                      : "border-transparent hover:border-white/50"
                    }`}
                  to="/podcast"
                >
                  <Podcast className="w-4 h-4" />
                  <span>بودكاست</span>
                </Link>

                <Link
                  className={`flex items-center gap-2 px-2 py-3 border-b-2 transition-all group ${
                    location.pathname === "/profile" 
                      ? "border-white text-white font-bold" 
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
              <Link
                to="/cart"
                className="p-2 text-[var(--color-text-light)] hover:bg-[var(--color-white)] hover:text-[var(--color-primary)] rounded-lg transition-colors duration-300"
                aria-label="السلة"
              >
                <ShoppingCart className="w-5 h-5" />
              </Link>
              
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-[var(--color-text-light)] hover:bg-[var(--color-white)] hover:text-[var(--color-primary)] rounded-lg transition-colors duration-300"
                aria-label="بحث"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                to="/contact"
                className="hidden md:flex items-center gap-2 px-4 py-2 text-[var(--color-primary)] bg-white hover:bg-white/80 hover:text-[var(--color-primary)] rounded-lg transition-colors duration-300 font-medium"
              >
                <Mail className="w-4 h-4" />
                <span>اتصل بنا</span>
              </Link>

              {/* Profile Dropdown or Login Button */}
              {currentUser ? (
                <div className="relative hidden md:block" ref={profileDropdownRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-[var(--color-primary)] bg-[var(--color-white)] hover:bg-[var(--color-secondary-light)] rounded-lg transition-colors duration-300 font-medium"
                  >
                    {/* Profile Picture or Icon */}
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span>{currentUser.userName || currentUser.username}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
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
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-[var(--color-primary)] bg-white hover:bg-white/80 hover:text-[var(--color-primary)] rounded-lg transition-colors duration-300 font-medium"
                >
                  <User className="w-4 h-4" />
                  <span>تسجيل الدخول</span>
                </Link>
              )}

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
      <div className="bg-gray-100 border-b border-gray-300">
        <div className="container mx-auto px-4">
          <nav className="hidden lg:flex items-center justify-start gap-1 py-2">
            <Link
              className="px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-white rounded transition-colors font-medium"
              to="/"
            >
              عدد اليوم
            </Link>
            {visibleCategories.map((category) => (
              <Link
                key={category.id}
                className="px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-white rounded transition-colors font-medium"
                to={`/category/${category.slug}`}
              >
                {category.name}
              </Link>
            ))}

            {/* More dropdown menu - only show if there are more categories */}
            {moreCategories.length > 0 && (
              <div className="relative">
                <button
                  className="flex items-center gap-1 px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-white rounded transition-colors font-medium"
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  onMouseEnter={() => setIsMoreMenuOpen(true)}
                  onMouseLeave={() => setIsMoreMenuOpen(false)}
                >
                  المزيد
                  <ChevronDown className={`w-4 h-4 transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {isMoreMenuOpen && (
                  <div
                    className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    onMouseEnter={() => setIsMoreMenuOpen(true)}
                    onMouseLeave={() => setIsMoreMenuOpen(false)}
                  >
                    {moreCategories.map((category) => (
                      <Link
                        key={category.id}
                        className="block px-4 py-2 text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:bg-gray-50 transition-colors font-medium"
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
        <div className="bg-white border-b border-gray-200">
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
