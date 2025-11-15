export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-12 py-10 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-8">
          {/* Right Section - Logo and Social Media */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h2 className="text-4xl font-black italic mb-4">القبس</h2>
            <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end mb-4 flex-row-reverse">
              {/* Telegram */}
              <a
                className="text-gray-400 hover:text-white transition-colors"
                href="#"
                aria-label="Telegram"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-1.37.2-1.64l16.79-6.1c.85-.31 1.65.25 1.41 1.76l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.34-3.25l-2.07 2.02c-.2.2-.37.37-.74.37l.28-4.4z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                className="text-gray-400 hover:text-white transition-colors"
                href="#"
                aria-label="YouTube"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-8.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L1 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33.22 2.65.28c1.3.07 2.49.1 3.59.1L12 5c4.19 0 6.8.16 8.83.44c.9.25 1.48.83 1.73 1.73z" />
                </svg>
              </a>

              {/* Twitter/X */}
              <a
                className="text-gray-400 hover:text-white transition-colors"
                href="#"
                aria-label="Twitter"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26l8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                className="text-gray-400 hover:text-white transition-colors"
                href="#"
                aria-label="Facebook"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-1 0-1 .5-1 1v2h2.5l-.5 3H13v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                className="text-gray-400 hover:text-white transition-colors"
                href="#"
                aria-label="Instagram"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8c1.99 0 3.6-1.61 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                className="text-gray-400 hover:text-white transition-colors"
                href="#"
                aria-label="LinkedIn"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21.12.5a1.5 1.5 0 0 1 1.38 1.5v15a1.5 1.5 0 0 1-1.38 1.5H2.88A1.5 1.5 0 0 1 1.5 17V2a1.5 1.5 0 0 1 1.38-1.5h18.24M11.2 9.5a1.44 1.44 0 0 0-1.44 1.44v3.12a1.44 1.44 0 0 0 1.44 1.44h1.6a1.44 1.44 0 0 0 1.44-1.44v-1a.36.36 0 0 1 .36-.36h.72a.36.36 0 0 1 .36.36v1a2.88 2.88 0 0 1-2.88 2.88h-1.6a2.88 2.88 0 0 1-2.88-2.88v-3.12a2.88 2.88 0 0 1 2.88-2.88H12v1.44h-.8Z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                className="text-gray-400 hover:text-white transition-colors"
                href="#"
                aria-label="TikTok"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16.75 13.96c.25.13.41.2.46.3.05.1.03.21-.02.37-.05.16-.12.28-.21.37l-.1.1c-.12.11-.26.2-.43.28-.17.08-.33.15-.48.21-.15.06-.3.1-.44.13-.14.03-.28.04-.42.04h-.1c-.13 0-.25-.01-.36-.03a.93.93 0 0 1-.34-.09c-.11-.04-.22-.09-.32-.15-.1-.06-.2-.13-.28-.21-.08-.08-.15-.17-.21-.26l-.06-.1c-.05-.08-.08-.16-.1-.25-.02-.09-.03-.18-.03-.26 0-.1.01-.19.04-.29.03-.09.06-.18.11-.25.05-.08.1-.15.17-.22.07-.07.14-.13.22-.19.08-.06.16-.12.25-.17.09-.05.18-.09.28-.13.1-.04.19-.08.3-.11.1-.03.2-.05.3-.06.11-.01.22-.02.32-.02s.2.01.29.02c.09.01.19.03.28.05.09.02.18.05.27.08.09.03.18.07.26.11.08.04.16.09.24.15.08.05.15.12.22.19m-4.5-8.49l-.13.04c-.03.01-.06.02-.1.04-.03.01-.06.03-.09.04-.03.02-.06.03-.09.05-.03.02-.06.04-.08.06-.02.02-.05.04-.07.06-.02.02-.04.05-.06.07-.02.02-.04.05-.06.08-.01.03-.03.06-.04.09-.01.03-.03.06-.04.1-.01.03-.02.06-.03.1-.01.03-.02.06-.02.1v.18l.01.09.01.09.02.09.02.08.03.08.04.08.04.07.05.07.05.06.06.06.06.05.07.05.07.04.08.04.08.03.09.03.09.02.1.02.1.01h.13c.03 0 .07 0 .1-.01.03-.01.06-.01.09-.02.03-.01.06-.02.09-.04.03-.01.05-.03.08-.04.02-.02.05-.03.07-.05.02-.02.04-.04.06-.06.02-.02.04-.05.05-.07.02-.02.03-.05.04-.08l.04-.08.03-.09.02-.09.01-.1v-.13c0-.04 0-.07-.01-.1a.43.43 0 0 0-.02-.1.31.31 0 0 0-.03-.09.35.35 0 0 0-.04-.09.39.39 0 0 0-.05-.08.28.28 0 0 0-.06-.07.35.35 0 0 0-.07-.06.33.33 0 0 0-.07-.05.38.38 0 0 0-.08-.05c-.03-.01-.06-.03-.09-.04a.69.69 0 0 0-.1-.03m-2.19 8.24c0-.23.03-.46.08-.68.05-.22.12-.44.21-.65.09-.21.19-.41.31-.6.12-.19.26-.38.41-.55.15-.17.32-.34.5-.49.18-.15.38-.29.58-.42.2-.13.41-.24.63-.34.22-.1.44-.19.67-.26.23-.07.47-.13.71-.17.24-.04.48-.06.72-.06.25 0 .49.02.73.06.24.04.48.1.71.17.23.07.45.16.67.26.22.1.43.21.63.34.2.13.39.27.58.42.18.15.35.32.5.49.15.17.29.36.41.55.12.19.22.39.31.6.09.21.16.43.21.65.05.22.08.45.08.68 0 .24-.03.48-.08.71-.05.23-.12.45-.21.67s-.19.43-.31.63c-.12.2-.26.39-.41.58-.15.19-.32.37-.5.54s-.38.33-.58.48c-.2.15-.41.29-.63.42-.22.13-.44.25-.67.36-.23.11-.47.2-.71.29-.24.09-.48.15-.73.19-.25.04-.49.07-.72.07-.23 0-.47-.02-.71-.07s-.48-.1-.71-.19c-.23-.09-.45-.18-.67-.29s-.43-.23-.63-.36c-.2-.15-.39-.3-.58-.48s-.35-.35-.5-.54c-.15-.19-.29-.38-.41-.58-.12-.2-.22-.43-.31-.63s-.16-.44-.21-.67c-.05-.23-.08-.47-.08-.71M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                className="text-gray-400 hover:text-white transition-colors"
                href="#"
                aria-label="WhatsApp"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.96 2.06C6.46 2.06 2 6.52 2 12.02c0 3.39 1.69 6.39 4.3 8.16l-1.39 4.18 4.49-1.42c1.2.73 2.58 1.14 4.02 1.14 5.5 0 9.96-4.46 9.96-9.96S17.46 2.06 12 2.06zm-.03 18.06c-1.34 0-2.65-.37-3.78-1.05l-4.11 1.3 1.35-3.9c-.83-1.22-1.3-2.67-1.3-4.25 0-4.51 3.61-8.12 8.12-8.12 4.51 0 8.12 3.61 8.12 8.12 0 4.51-3.62 8.12-8.4 8.12zM15 15.13v-1.15c0-1-.81-1.81-1.81-1.81h-2.37c-1 0-1.81.81-1.81 1.81v1.15c0 1 .81 1.81 1.81 1.81h2.37c1 0 1.81-.81 1.81-1.81zm-4.18-3.08h2.37c1.77 0 3.22-1.45 3.22-3.22S14.96 5.61 13.2 5.61H10.8c-1.77 0-3.22 1.45-3.22 3.22s1.45 3.22 3.22 3.22z" />
                </svg>
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              القبس {currentYear} - جميع الحقوق محفوظة | Version 1.1.66
            </p>
          </div>

          {/* Left Section - Navigation Links */}
          <nav className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 font-bold flex-row-reverse">
            <a
              className="text-gray-300 hover:text-white transition-colors"
              href="#"
            >
              عن القبس
            </a>
            <a
              className="text-gray-300 hover:text-white transition-colors"
              href="#"
            >
              الاشتراكات
            </a>
            <a
              className="text-gray-300 hover:text-white transition-colors"
              href="#"
            >
              الإعلانات
            </a>
            <a
              className="text-gray-300 hover:text-white transition-colors"
              href="#"
            >
              اتصل بنا
            </a>
            <a
              className="text-gray-300 hover:text-white transition-colors"
              href="#"
            >
              سياسة الخصوصية
            </a>
            <a
              className="text-gray-300 hover:text-white transition-colors"
              href="#"
            >
              شروط الإستخدام
            </a>
            <a
              className="text-gray-300 hover:text-white transition-colors"
              href="#"
            >
              أرسل مقال
            </a>
          </nav>
        </div>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="absolute bottom-10 -right-4 md:right-4 bg-primary p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Scroll to top"
        >
          <span className="material-symbols-outlined text-white text-3xl">
            keyboard_arrow_up
          </span>
        </button>
      </div>
    </footer>
  );
}
