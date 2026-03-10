import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Newspaper,
  Tv,
  LogOut,
  FileText,
  User,
  Podcast,
  Film,
} from "lucide-react";
import type { Category } from "../../services/categoriesService";
import authService from "../../services/authService";
import { useSidebar } from "../../contexts/SidebarContext";
import { DateTimeDisplay } from "../DateTimeDisplay";

interface HeaderProps {
  categories?: Category[];
  ceoName?: string;
}

export function Header({ categories = [], ceoName }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    // Get current user from cookies
    const user = authService.getCurrentUser();
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

  return (
    <header
      dir="rtl"
      lang="ar"
      className="w-full pb-4"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-600 border-b border-dashed border-black/20 ">
          <div className="flex gap-4 items-center">
            {/* Burger Menu Button - Desktop Only */}
            <button
              onClick={toggleSidebar}
              aria-label="فتح القائمة"
              className="hidden md:block p-2 hover:bg-[#a8c5d4] rounded transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="flex items-center gap-1 px-2 py- rounded-sm fix-numbers">
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
              className="p-1 rounded transition-colors"
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
                  <div className="absolute left-0 mt-2 w-48 bg-[#d0e8f2] border border-dashed border-black/10 rounded-sm shadow-lg z-50">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#a8c5d4] transition-colors"
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
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-[#a8c5d4] transition-colors text-right"
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

        {/* Mobile Only: DateTimeDisplay and Menu Row - Second Row */}
        <div className="md:hidden flex justify-between items-center py-2 border-b border-dashed border-black/20">
          <button
            onClick={toggleSidebar}
            aria-label="فتح القائمة"
            className="p-2 hover:bg-[#a8c5d4] rounded transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="">
            <DateTimeDisplay />
          </div>
        </div>

        {/* Main Header Section */}
        <div className="hidden md:flex justify-center items-center py-1 gap-4 w-full">
          {/* Left Section: DateTimeDisplay + Navigation - Desktop */}
          <div className="flex items-center gap-4">

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

          {/* Center Logo - Desktop */}
          <div className="text-center flex justify-center items-center">
            <Link to="/">
              <img
                src="/formLogo.png"
                alt="الثورة لوجو"
                className="h-16"
              />
            </Link>
          </div>

          {/* Right Navigation - Desktop */}
          <nav className="relative flex gap-4 items-center text-sm text-gray-900">
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
          {/* Desktop Only: DateTimeDisplay on the left */}
            <DateTimeDisplay />
        </div>
      </div>

      {/* Mobile Logo Section - Full Screen Width */}
      <div className="md:hidden py-4">
        <Link to="/" className="block">
          <img
            src="/formLogo.png"
            alt="الثورة لوجو"
            className="h-40 w-full object-contain"
          />
        </Link>
        <div className="text-center italic font-serif text-gray-500 normal-case mt-2">
          صحيفة الثورة اليمنية
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bottom Navigation - Categories (Desktop Only) */}
        <nav className="hidden md:block border-t border-b border-dashed border-black/10 py-2 overflow-x-auto overflow-y-visible">
          <ul className="flex justify-center min-w-max md:min-w-0 space-x-reverse space-x-6 lg:space-x-10 text-sm font-sans text-gray-800">
            <li>
              <Link
                to="/"
                className="hover:text-blue-600 hover:underline decoration-2 underline-offset-4 font-medium"
              >
                عدد اليوم
              </Link>
            </li>

            {/* Desktop: Show first 10 categories */}
            {allMenuCategories.slice(0, 10).map((category) => (
              <li key={category.id}>
                <Link
                  to={`/category/${category.slug}`}
                  className="hover:text-blue-600 hover:underline decoration-2 underline-offset-4"
                >
                  {category.name}
                </Link>
              </li>
            ))}
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
    </header>
  );
}
