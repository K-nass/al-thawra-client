import { useState } from "react";
import { useNavigate } from "react-router";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      {/* Top Info Bar */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="py-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-right">
                <span>رئيس التحرير: وليد عبداللطيف النصف</span>
                <span className="hidden md:block border-l border-gray-300 dark:border-gray-600 pl-4">
                  نائب رئيس التحرير: عبدالله غازي المضف
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-right">
                <a
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-base">
                    download
                  </span>
                  تحميل آخر عدد PDF
                </a>
                <span className="hidden md:block border-r border-gray-300 dark:border-gray-600 pr-4">
                  عرض أرشيف الأعداد
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-white py-4 flex-row-reverse">
            <div className="flex items-center gap-8 flex-row-reverse">
              <h1 className="text-3xl font-black italic">القبس</h1>
              <nav className="hidden md:flex items-center gap-6 font-bold flex-row-reverse">
                <a
                  className="py-2 px-3 bg-white bg-opacity-20 rounded-md hover:bg-opacity-30 transition-colors"
                  href="#"
                >
                  الصحيفة
                </a>
                <a
                  className="hover:text-gray-200 transition-colors"
                  href="#"
                >
                  ماستر كلاس
                </a>
                <a
                  className="hover:text-gray-200 transition-colors"
                  href="#"
                >
                  التلفزيون
                </a>
                <a
                  className="hover:text-gray-200 transition-colors"
                  href="#"
                >
                  بريميوم
                </a>
                <a
                  className="flex items-center gap-2 hover:text-gray-200 transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-xl">
                    grid_view
                  </span>
                  ضيAI
                </a>
                <a
                  className="hover:text-gray-200 transition-colors"
                  href="#"
                >
                  صفحتي
                </a>
                <a
                  className="flex items-center gap-2 hover:text-gray-200 transition-colors"
                  href="#"
                >
                  <span className="material-symbols-outlined text-xl">
                    podcasts
                  </span>
                  بودكاست
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4 flex-row-reverse">
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-primary font-bold py-2 px-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
              >
                تسجيل الدخول
              </button>
              <button className="border border-white text-white font-bold py-2 px-6 rounded-lg hover:bg-white hover:text-primary transition-colors">
                الاشتراكات
              </button>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <span className="material-symbols-outlined">search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <nav className="bg-background-light dark:bg-background-dark py-3 border-b-2 border-primary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center font-bold text-gray-700 dark:text-gray-300 overflow-x-auto flex-row-reverse">
            <div className="flex items-center gap-8 whitespace-nowrap flex-row-reverse">
              <a
                className="hover:text-primary transition-colors"
                href="#"
              >
                عدد اليوم
              </a>
              <a
                className="hover:text-primary transition-colors"
                href="#"
              >
                محليات
              </a>
              <a
                className="hover:text-primary transition-colors"
                href="#"
              >
                كتاب وآراء
              </a>
              <a
                className="hover:text-primary transition-colors"
                href="#"
              >
                أمن ومحاكم
              </a>
              <a
                className="hover:text-primary transition-colors"
                href="#"
              >
                اقتصاد
              </a>
              <a
                className="hover:text-primary transition-colors"
                href="#"
              >
                القبس الدولي
              </a>
              <a
                className="hover:text-primary transition-colors"
                href="#"
              >
                لايت
              </a>
              <a
                className="flex items-center gap-1 hover:text-primary transition-colors"
                href="#"
              >
                المزيد{" "}
                <span className="material-symbols-outlined text-base">
                  expand_more
                </span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
