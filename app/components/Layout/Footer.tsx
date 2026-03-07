import { Link } from "react-router";
import { Send, Youtube, Twitter, Facebook, Instagram, Linkedin, Music, MessageCircle, ArrowUp } from "lucide-react";
import type { Page } from "~/services/pagesService";

interface FooterProps {
  pages?: Page[];
}

export function Footer({ pages = [] }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer dir="rtl" lang="ar" className="mt-16">
      {/* Top Dashed Border */}
      <div className="border-t border-dashed border-black/10"></div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Right Section - Logo and Description */}
          <div className="p-6 border-b border-dashed border-black/10 md:border-b-0 md:border-l">
            <Link to="/" className="inline-block mb-4">
              <div className="w-32 h-auto">
                <img
                  src="/formLogo.png"
                  alt="الثورة"
                  className="w-full h-auto"
                />
              </div>
            </Link>
            <p className="text-gray-700 leading-relaxed text-sm">
              منصة إخبارية شاملة تقدم أحدث الأخبار والتحليلات من اليمن والعالم، نلتزم بالمصداقية والشفافية في نقل الحدث.
            </p>
          </div>

          {/* Middle Section - Important Links (Dynamic) */}
          <div className="p-6 border-b border-dashed border-black/10 md:border-b-0 md:border-l">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              روابط هامة
            </h3>
            <nav className="space-y-2">
              {pages.map((page) => (
                <Link
                  key={page.id}
                  to={`/pages/${page.slug}`}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors text-sm group"
                >
                  <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-gray-900 transition-colors"></span>
                  {page.title}
                </Link>
              ))}
              
              {/* Static footer links */}
              <Link
                to="/about"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors text-sm group"
              >
                <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-gray-900 transition-colors"></span>
                من نحن
              </Link>
              <Link
                to="/ads"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors text-sm group"
              >
                <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-gray-900 transition-colors"></span>
                الإعلانات
              </Link>
              <Link
                to="/subscribe"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors text-sm group"
              >
                <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-gray-900 transition-colors"></span>
                للإشتراك
              </Link>
              <Link
                to="/services"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors text-sm group"
              >
                <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-gray-900 transition-colors"></span>
                خدماتنا
              </Link>
              <Link
                to="/contact"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors text-sm group"
              >
                <span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-gray-900 transition-colors"></span>
                اتصل بنا
              </Link>
            </nav>
          </div>

          {/* Left Section - Social Media */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              تابعنا
            </h3>
            <div className="flex flex-wrap gap-3">
              <a 
                href="https://al-thawra-client.vercel.app/" 
                target="_self" 
                rel="noopener noreferrer" 
                aria-label="Telegram"
                className="w-10 h-10 flex items-center justify-center border border-dashed border-black/20 rounded-lg hover:bg-black/5 transition-colors text-gray-700 hover:text-gray-900"
              >
                <Send className="w-5 h-5" />
              </a>
              <a 
                href="https://al-thawra-client.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="YouTube"
                className="w-10 h-10 flex items-center justify-center border border-dashed border-black/20 rounded-lg hover:bg-black/5 transition-colors text-gray-700 hover:text-gray-900"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/althawrhNet" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Twitter"
                className="w-10 h-10 flex items-center justify-center border border-dashed border-black/20 rounded-lg hover:bg-black/5 transition-colors text-gray-700 hover:text-gray-900"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/share/1BWsoa7hbV/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="w-10 h-10 flex items-center justify-center border border-dashed border-black/20 rounded-lg hover:bg-black/5 transition-colors text-gray-700 hover:text-gray-900"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://whatsapp.com/channel/0029VbBeGZFInlqGhtMLs31i" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="WhatsApp"
                className="w-10 h-10 flex items-center justify-center border border-dashed border-black/20 rounded-lg hover:bg-black/5 transition-colors text-gray-700 hover:text-gray-900"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={scrollToTop}
            aria-label="العودة للأعلى"
            className="w-12 h-12 flex items-center justify-center border border-dashed border-black/20 rounded-lg hover:bg-black/5 transition-colors text-gray-700 hover:text-gray-900"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Dashed Border */}
      <div className="border-t border-dashed border-black/10"></div>

      {/* Copyright Bar */}
      <div className="bg-black/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-gray-700 text-sm">
            الثورة {currentYear} &copy; - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
