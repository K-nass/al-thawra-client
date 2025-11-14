import { Link } from "react-router";

export default function MainNav() {
  const navItems = [
    { label: "الرئيسية", href: "#" },
    { label: "ماستر كلاس", href: "#" },
    { label: "تلفزيون", href: "#" },
    { label: "بريميوم", href: "#" },
    { label: "صحيفتي", href: "#", icon: "grid_view" },
    { label: "بودكاست", href: "#", icon: "headphones" },
  ];

  return (
    <div className="sticky top-0 z-40 bg-primary shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              alt="Logo"
              className="h-8 mr-4 invert brightness-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9yY5YJdkzYFGfOnoYMqBNFzIgLTaqBeG8CDRUN1w80R5FniaVZCHsn9epNv8qVU1ALIG7VaoviZAM4QBghp1c-3GRUc4bB65tBXMj3BVzFTuYhLddVSoxaejF0g0uWtc7kwgTn7a20ir1u7KHdWZUD-4KKwUrGqkjd_jLNX5GZ5UFJfZZyed-X4CWvQX4hAUvZ8eMTIa3zt29pE-rnZpQtV_eCTrCelVDXvSSnVEz7IjRhlo8h2FxzC_18gQkhMrLq95Bwxu5FdU"
            />

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 space-x-reverse text-white font-bold">
              {navItems.map((item, idx) => (
                <div key={idx} className="flex items-center">
                  <a
                    className={`hover:opacity-80 flex items-center gap-1 ${
                      idx === 0 ? "px-3 py-2 bg-white bg-opacity-10 rounded" : ""
                    }`}
                    href={item.href}
                  >
                    {item.icon && (
                      <span className="material-icons text-sm">{item.icon}</span>
                    )}
                    <span>{item.label}</span>
                  </a>
                  {idx === navItems.length - 2 && (
                    <span className="text-white/50 mx-3">|</span>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button className="bg-white/10 text-white p-2.5 rounded-md hover:bg-white/20">
              <span className="material-icons">search</span>
            </button>
            <a
              className="bg-white text-primary font-bold px-4 py-2 rounded-md hover:bg-gray-100 whitespace-nowrap"
              href="#"
            >
              تسجيل الدخول
            </a>
            <a
              className="border border-white text-white font-bold px-4 py-2 rounded-md hover:bg-white/10 whitespace-nowrap hidden sm:block"
              href="#"
            >
              الاشتراكات
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
