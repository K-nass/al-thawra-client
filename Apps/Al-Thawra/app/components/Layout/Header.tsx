import { useState } from "react";
import { Link } from "react-router";
import { Search, Menu, X, ChevronDown, Send, Youtube, Twitter, Facebook, Instagram, TrendingUp, ShoppingCart, Mail } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md" dir="rtl" lang="ar">
      {/* Top Bar - Social & Info */}
      <div className="bg-gray-100 border-b border-gray-300">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2 text-sm">
            {/* Right Side - Editor Info */}
            <div className="flex items-center gap-6 text-gray-700">
              <span className="font-medium">رئيس التحرير: وليد عبداللطيف النصف</span>
              <span className="hidden md:block">|</span>
              <span className="hidden md:block font-medium">نائب رئيس التحرير: عبدالله غازي المضف</span>
            </div>

            {/* Left Side - Social Icons */}
            <div className="flex items-center gap-3">
              <a href="https://t.me/althawra" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[var(--color-primary)] transition-colors" aria-label="Telegram">
                <Send className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@althawra" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[var(--color-primary)] transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/althawra" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[var(--color-primary)] transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://facebook.com/althawra" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[var(--color-primary)] transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/althawra" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[var(--color-primary)] transition-colors" aria-label="Instagram">
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
            <Link to="/" className="text-white text-3xl font-black italic hover:opacity-90 transition-opacity">
              الثورة
            </Link>

            {/* Center - Main Navigation */}
            <nav className="hidden lg:flex items-center gap-1 text-white font-bold">
              <Link className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors" to="/">
                الصحيفة
              </Link>
              <Link className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors" to="/local">
                محليات
              </Link>
              <Link className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors" to="/opinion">
                كتاب وآراء
              </Link>
              <Link className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors" to="/economy">
                اقتصاد
              </Link>
              <Link className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors" to="/international">
                الثورة الدولي
              </Link>
              <Link className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors" to="/lite">
                لايت
              </Link>
              <Link className="flex items-center gap-1 px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors" to="/more">
                المزيد
                <ChevronDown className="w-4 h-4" />
              </Link>
            </nav>

            {/* Left Side - Actions */}
            <div className="flex items-center gap-3">
              <Link to="/login" className="hidden md:block px-4 py-2 text-white hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors font-medium">
                تسجيل الدخول
              </Link>
              <Link to="/subscriptions" className="hidden md:flex items-center gap-2 px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-[var(--color-primary)] transition-colors">
                <ShoppingCart className="w-4 h-4" />
                <span>الاشتراكات</span>
              </Link>
              <Link to="/contact" className="hidden md:flex items-center gap-2 px-4 py-2 text-white hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors">
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
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
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
              <button
                className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors font-medium"
              >
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
            <Link className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors" to="/" onClick={() => setIsMobileMenuOpen(false)}>
              الصحيفة
            </Link>
            <Link className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors" to="/local" onClick={() => setIsMobileMenuOpen(false)}>
              محليات
            </Link>
            <Link className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors" to="/opinion" onClick={() => setIsMobileMenuOpen(false)}>
              كتاب وآراء
            </Link>
            <Link className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors" to="/economy" onClick={() => setIsMobileMenuOpen(false)}>
              اقتصاد
            </Link>
            <Link className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors" to="/international" onClick={() => setIsMobileMenuOpen(false)}>
              الثورة الدولي
            </Link>
            <Link className="px-4 py-2 hover:bg-white hover:bg-opacity-10 hover:text-[var(--color-primary)] rounded transition-colors" to="/lite" onClick={() => setIsMobileMenuOpen(false)}>
              لايت
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
