export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] py-8 rtl-direction">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-gray-700">
          <div className="flex-shrink-0">
            <a 
              aria-label="Alqabas homepage" 
              className="text-3xl font-bold text-white" 
              href="#"
            >
              الثورة
            </a>
          </div>
          <nav className="flex-grow">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-gray-300">
              <li><a className="hover:text-white" href="#">عن الثورة</a></li>
              <li><a className="hover:text-white" href="#">الاشتراكات</a></li>
              <li><a className="hover:text-white" href="#">اتصل بنا</a></li>
              <li><a className="hover:text-white" href="#">الإعلانات</a></li>
              <li><a className="hover:text-white" href="#">سياسة الخصوصية</a></li>
              <li><a className="hover:text-white" href="#">شروط الإستخدام</a></li>
              <li><a className="hover:text-white" href="#">أرسل مقال</a></li>
            </ul>
          </nav>
          <div className="absolute lg:relative -bottom-4 lg:bottom-auto right-4 lg:right-auto">
            <a 
              aria-label="Back to top" 
              className="bg-primary hover:bg-blue-700 text-white w-10 h-10 rounded flex items-center justify-center transition-colors" 
              href="#"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs text-gray-400 text-center md:text-right">
            <p>الثورة 2025 - جميع الحقوق محفوظة</p>
            <p className="ltr-direction mt-1">Version 1.1.66</p>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <a aria-label="Telegram" className="text-gray-400 hover:text-white" href="#">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.57c-.28 1.13-1.04 1.4-1.74 .88l-4.98-3.65l-2.35 2.26c-.4.38-1.01.37-1.43-.02z"></path>
              </svg>
            </a>
            <a aria-label="YouTube" className="text-gray-400 hover:text-white" href="#">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33.22 2.65.28c1.3.07 2.49.1 3.59.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73z"></path>
              </svg>
            </a>
            <a aria-label="X" className="text-gray-400 hover:text-white" href="#">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584l-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.931L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298l13.312 17.404z"></path>
              </svg>
            </a>
            <a aria-label="Facebook" className="text-gray-400 hover:text-white" href="#">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3v9h4v-9z"></path>
              </svg>
            </a>
            <a aria-label="Instagram" className="text-gray-400 hover:text-white" href="#">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8A3.6 3.6 0 0 0 20 16.4V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3z"></path>
              </svg>
            </a>
            <a aria-label="TikTok" className="text-gray-400 hover:text-white" href="#">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.525 0.02c1.31-.02 2.61-.01 3.91-.02c.08 1.53.63 3.09 1.75 4.17c1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97c-.62-.28-1.2-.6-1.76-1.02c-.6-.45-1.16-.96-1.69-1.53c-.53-.57-.99-1.19-1.42-1.84c-.43-.65-.82-1.33-1.16-2.06c-.34-.73-.61-1.5-.82-2.28c-.21-.78-.36-1.59-.49-2.42c-.13-.83-.23-1.68-.33-2.53zM15.21 6.94c.53.56.99 1.17 1.41 1.8c.42.63.8 1.29 1.14 2c.34.7.62 1.44.83 2.2c.21.76.35 1.54.43 2.34c.08.8.1 1.61.1 2.42c0 2.41-.53 4.66-1.57 6.62c-1.04 1.96-2.62 3.42-4.57 4.24c-1.95.82-4.12.98-6.17.44c-2.05-.54-3.8-1.64-5.11-3.21c-1.31-1.57-2.11-3.52-2.32-5.61c-.21-2.1-.03-4.16.52-6.09c.55-1.93 1.59-3.64 3.02-5.02c1.43-1.38 3.2-2.4 5.15-2.93c1.95-.53 4.01-.59 5.95-.14z"></path>
              </svg>
            </a>
            <a aria-label="WhatsApp" className="text-gray-400 hover:text-white" href="#">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-5.46-4.45-9.91-9.91-9.91zM17.43 14.39c-.2-.1-.58-.29-1.32-.58c-.1-.04-.15-.05-.21-.07c-.42-.21-.71-.35-.97-.52c-.26-.17-.52-.39-.73-.61c-.21-.22-.42-.48-.6-.73c-.18-.25-.36-.53-.49-.79c-.13-.26-.25-.51-.35-.73c-.1-.22-.19-.43-.28-.61c-.09-.18-.18-.36-.28-.51c-.1-.15-.21-.29-.33-.42c-.12-.13-.26-.25-.4-.35c-.14-.1-.3-.18-.46-.25c-.16-.07-.33-.12-.51-.16c-.18-.04-.37-.06-.56-.06c-.19 0-.38.02-.56.05c-.18.03-.36.08-.53.15c-.17.07-.33.15-.48.25c-.15.1-.29.22-.42.34c-.13.12-.25.26-.35.41c-.1.15-.19.3-.26.45c-.07.15-.13.3-.18.45c-.05.15-.09.29-.12.43c-.03.14-.04.28-.05.41c-.01.13-.01.27-.01.4c0 .21.04.42.12.62c.08.2.19.4.31.59c.12.19.27.38.43.57c.16.19.33.39.52.58c.19.19.39.39.6.58c.21.19.43.39.67.58c.24.19.49.38.75.56c.26.18.54.36.82.52c.28.16.58.32.88.47c.3.15.6.29.9.42c.3.13.59.24.87.33c.28.09.55.15.82.19c.27.04.53.06.78.06c.25 0 .5-.02.74-.07c.24-.05.48-.12.71-.22c.23-.1.44-.22.64-.37c.2-.15.38-.32.55-.52c.17-.2.32-.43.44-.68c.12-.25.21-.52.28-.81c.07-.29.09-.58.07-.88c-.03-.3-.1-.58-.2-.84z"></path>
              </svg>
            </a>
            <a aria-label="Snapchat" className="text-gray-400 hover:text-white" href="#">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.97 8.72c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5zm0 3.5c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1zm8.03 2.23c0 1.25-.22 2.44-.63 3.53c-2.32 6.07-10.42 6.07-12.75 0C6.22 14.44 6 13.25 6 12s.22-2.44.63-3.53c.6-1.57 1.48-2.92 2.58-4.03S11.66 2.3 13.23 1.7c1.09-.41 2.28-.63 3.53-.63c2.76 0 5.24 2.24 5.24 5.24c0 1.95-.58 3.55-1.97 4.94zm-1.5-1.92c.63-.69.97-1.54.97-2.68c0-1.5-1.29-2.74-2.74-2.74c-.89 0-1.68.44-2.18 1.11c-.55.75-.85 1.7-.85 2.71s.3 1.96.85 2.71c.5.67 1.29 1.11 2.18 1.11c.26 0 .52-.04.77-.11c-.4-.5-.64-1.11-.64-1.78c0-.98.54-1.82 1.3-2.23zm-6.53 7.92c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
