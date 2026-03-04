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
    <footer dir="rtl" lang="ar">
      {/* Top Gradient Bar */}
      <div />

      <div>
        <div>
          {/* Right Section - Logo and Description */}
          <div>
            <Link to="/">
              <div>
                <img
                  src="/logo.png"
                  alt="الثورة"
                />
              </div>
            </Link>
            <p>
              منصة إخبارية شاملة تقدم أحدث الأخبار والتحليلات من اليمن والعالم، نلتزم بالمصداقية والشفافية في نقل الحدث.
            </p>
          </div>

          {/* Middle Section - Important Links (Dynamic) */}
          <div>
            <h3>
              روابط هامة
            </h3>
            <nav>
              {pages.map((page) => (
                <Link
                  key={page.id}
                  to={`/pages/${page.slug}`}
                >
                  <span></span>
                  {page.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Left Section - Social Media */}
          <div>
            <h3>
              تابعنا
            </h3>
            <div>
              <a href="https://al-thawra-client.vercel.app/" target="_self" rel="noopener noreferrer" aria-label="Telegram">
                <Send />
              </a>
              <a href="https://al-thawra-client.vercel.app/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube />
              </a>
              <a href="https://x.com/althawrhNet" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter />
              </a>
              <a href="https://www.facebook.com/share/1BWsoa7hbV/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook />
              </a>
              <a href="https://whatsapp.com/channel/0029VbBeGZFInlqGhtMLs31i" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <MessageCircle />
              </a>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          aria-label="العودة للأعلى"
        >
          <ArrowUp />
        </button>
      </div>

      {/* Copyright Bar */}
      <div>
        <div>
          <p>
            الثورة {currentYear} &copy; - جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}
