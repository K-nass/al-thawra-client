import { Link } from "react-router";
import { Send, Youtube, Twitter, Facebook, Instagram, Linkedin, Music, MessageCircle, ArrowUp } from "lucide-react";
import type { Page } from "~/services/pagesService";

interface FooterProps {
  pages?: Page[];
}

export function Footer({ pages = [] }: FooterProps) {
  console.log("Footer Received Pages:", pages.length, pages);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] text-[var(--color-text-light)] mt-12 relative border-t border-[var(--color-divider)]" dir="rtl" lang="ar">
      {/* Top Gradient Bar */}
      <div className="h-2 bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] w-full absolute top-0 left-0" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Right Section - Logo and Description */}
          <div className="flex flex-col items-start text-right">
            <Link to="/" className="mb-6 hover:opacity-90 transition-opacity">
              <div className="bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] p-4 rounded-xl shadow-md inline-block">
                <img
                  src="/logo.png"
                  alt="الثورة"
                  className="h-12 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6 max-w-xs">
              منصة إخبارية شاملة تقدم أحدث الأخبار والتحليلات من اليمن والعالم، نلتزم بالمصداقية والشفافية في نقل الحدث.
            </p>
          </div>

          {/* Middle Section - Important Links (Dynamic) */}
          <div className="flex flex-col items-start text-right">
            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-white pb-2 inline-block">
              روابط هامة
            </h3>
            <nav className="grid grid-cols-2 gap-x-8 gap-y-3 w-full">
              {pages.map((page) => (
                <Link
                  key={page.id}
                  className="text-white hover:text-[var(--color-secondary)] transition-colors text-sm font-medium flex items-center gap-2"
                  to={`/pages/${page.slug}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)]"></span>
                  {page.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Left Section - Social Media */}
          <div className="flex flex-col items-start text-right">
            <h3 className="text-lg font-bold mb-6 text-white border-b-2 border-[var(--color-primary)] pb-2 inline-block">
              تابعنا
            </h3>
            <div className="flex items-center gap-3 flex-wrap mb-6">
              <a className="w-10 h-10 rounded-full  flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white hover:bg-[#229ED9] hover:border-[#229ED9] transition-all duration-300 shadow-sm" href="https://al-thawra-client.vercel.app/" target="_self" rel="noopener noreferrer" aria-label="Telegram">
                <Send className="w-5 h-5" />
              </a>
              <a className="w-10 h-10 rounded-full  flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white hover:bg-[#FF0000] hover:border-[#FF0000] transition-all duration-300 shadow-sm" href="https://al-thawra-client.vercel.app/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a className="w-10 h-10 rounded-full  flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white hover:bg-[#1DA1F2] hover:border-[#1DA1F2] transition-all duration-300 shadow-sm" href="https://x.com/althawrhNet" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a className="w-10 h-10 rounded-full  flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-all duration-300 shadow-sm" href="https://www.facebook.com/share/1BWsoa7hbV/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a className="w-10 h-10 rounded-full  flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 shadow-sm" href="https://whatsapp.com/channel/0029VbBeGZFInlqGhtMLs31i" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 bg-[var(--color-primary)] p-3 rounded-full shadow-lg hover:bg-[var(--color-primary-dark)] transition-colors z-40"
          aria-label="العودة للأعلى"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[var(--color-primary-dark)] text-white/80 py-4 text-sm">
        <div className="container mx-auto px-4 text-center">
          <p>
            الثورة {currentYear} &copy; - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
