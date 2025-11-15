import { Link } from "react-router";
import { Send, Youtube, Twitter, Facebook, Instagram, Linkedin, Music, MessageCircle, ArrowUp } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-12 py-10 relative" dir="rtl" lang="ar">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Right Section - Logo and Social Media */}
          <div className="flex flex-col items-start text-right w-full md:w-auto">
            <Link to="/" className="text-4xl font-black italic mb-4 hover:opacity-90 transition-opacity">
              الثورة
            </Link>
            <div className="flex items-center gap-4 flex-wrap mb-4">
              <a className="text-gray-400 hover:text-[var(--color-primary)] transition-colors" href="https://t.me/althawra" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <Send className="w-5 h-5" />
              </a>
              <a className="text-gray-400 hover:text-[var(--color-primary)] transition-colors" href="https://youtube.com/@althawra" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>

              <a className="text-gray-400 hover:text-[var(--color-primary)] transition-colors" href="https://twitter.com/althawra" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a className="text-gray-400 hover:text-[var(--color-primary)] transition-colors" href="https://facebook.com/althawra" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a className="text-gray-400 hover:text-[var(--color-primary)] transition-colors" href="https://instagram.com/althawra" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a className="text-gray-400 hover:text-[var(--color-primary)] transition-colors" href="https://linkedin.com/company/althawra" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a className="text-gray-400 hover:text-[var(--color-primary)] transition-colors" href="https://tiktok.com/@althawra" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <Music className="w-5 h-5" />
              </a>
              <a className="text-gray-400 hover:text-[var(--color-primary)] transition-colors" href="https://wa.me/96512345678" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              الثورة {currentYear} &copy; - جميع الحقوق محفوظة
            </p>
          </div>

          {/* Left Section - Navigation Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 font-bold w-full md:w-auto">
            <Link className="text-gray-300 hover:text-[var(--color-primary)] transition-colors" to="/about">
              عن الثورة
            </Link>
            <Link className="text-gray-300 hover:text-[var(--color-primary)] transition-colors" to="/subscriptions">
              الاشتراكات
            </Link>
            <Link className="text-gray-300 hover:text-[var(--color-primary)] transition-colors" to="/advertising">
              الإعلانات
            </Link>
            <Link className="text-gray-300 hover:text-[var(--color-primary)] transition-colors" to="/contact">
              اتصل بنا
            </Link>
            <Link className="text-gray-300 hover:text-[var(--color-primary)] transition-colors" to="/privacy">
              سياسة الخصوصية
            </Link>
            <Link className="text-gray-300 hover:text-[var(--color-primary)] transition-colors" to="/terms">
              شروط الاستخدام
            </Link>
            <Link className="text-gray-300 hover:text-[var(--color-primary)] transition-colors" to="/submit">
              أرسل مقال
            </Link>
          </nav>
        </div>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="absolute bottom-10 left-4 md:left-8 bg-[var(--color-primary)] p-3 rounded-full shadow-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          aria-label="العودة للأعلى"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      </div>
    </footer>
  );
}
