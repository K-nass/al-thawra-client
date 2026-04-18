import { Link, useLocation } from "react-router";
import { Send, Youtube, Twitter, Facebook, MessageCircle } from "lucide-react";
import type { Page } from "~/services/pagesService";
import type { Category } from "~/services/categoriesService";

interface FooterProps {
  pages?: Page[];
  categories?: Category[];
}

export function Footer({ pages = [], categories = [] }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  // Filter and sort menu categories
  const menuCategories = categories
    .filter(cat => cat.showOnMenu && cat.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <footer dir="rtl" lang="ar" className="semafor-container mt-16 border-t-2 border-black">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
          {/* Column 1 - Logo and Tagline */}
          <div className="p-6 border-b border-dashed border-black/10 md:border-b-0 md:border-l">
            <Link to="/" className="inline-block mb-4">
              <img
                src="/formLogo.png"
                alt="الثورة"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              المؤسسة الصحفية الحكومية الأولى في الجمهورية اليمنية تأسست عام ١٩٦٢م، وتصدر عنها صحف: الثورة، الوحدة، الرياضة، ومجلة معين.
            </p>
            <p className="text-xs text-gray-500">
              © {currentYear} الثورة
            </p>
          </div>

          {/* Column 2 - Main Navigation */}
          <div className="p-6 border-b border-dashed border-black/10 md:border-b-0 md:border-l">
            <nav className="divide-y divide-dashed divide-black/10">
              <Link
                to="/"
                className={`flex items-center justify-between py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors ${location.pathname === "/" ? "font-bold" : ""
                  }`}
              >
                <span>الرئيسية</span>
                {location.pathname === "/" && (
                  <span className="text-xs text-gray-600 font-bold">← أنت هنا</span>
                )}
              </Link>
              {menuCategories.slice(0, 9).map((category) => {
                const isActive = location.pathname === `/category/${category.slug}`;
                return (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className={`flex items-center justify-between py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors ${isActive ? "font-bold" : ""
                      }`}
                  >
                    <span>{category.name}</span>
                    {isActive && (
                      <span className="text-xs text-gray-600 font-bold">← أنت هنا</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Column 3 - Additional Links */}
          <div className="p-6 border-b border-dashed border-black/10 md:border-b-0 md:border-l">
            <nav className="space-y-2">
              {pages.slice(0, 6).map((page) => (
                <Link
                  key={page.id}
                  to={`/pages/${page.slug}`}
                  className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {page.title}
                </Link>
              ))}
              <Link
                to="/magazines"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                أرشيف الثورة
              </Link>
              <Link
                to="/tv"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                التلفزيون
              </Link>
            </nav>
          </div>

          {/* Column 4 - About & Social */}
          <div className="p-6">
            <nav className="space-y-2 mb-6">
              <Link
                to="/about"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                من نحن
              </Link>
              <Link
                to="/contact"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                اتصل بنا
              </Link>
              <Link
                to="/privacy"
                className="block text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                الخصوصية
              </Link>
            </nav>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              <a
                href="https://al-thawra-client.vercel.app/"
                target="_self"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href="https://al-thawra-client.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/althawrhNet"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/1BWsoa7hbV/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbBeGZFInlqGhtMLs31i"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
