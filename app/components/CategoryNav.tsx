export default function CategoryNav() {
  const categories = [
    { label: "عدد اليوم", href: "#" },
    { label: "محليات", href: "#" },
    { label: "كتاب وآراء", href: "#" },
    { label: "أمن ومحاكم", href: "#" },
    { label: "اقتصاد", href: "#" },
    { label: "الثورة الدولي", href: "#" },
    { label: "لايت", href: "#" },
  ];

  return (
    <nav className="bg-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between text-gray-900 font-bold text-sm h-12">
          <div className="flex items-center space-x-6 space-x-reverse">
            {categories.map((cat, idx) => (
              <a
                key={idx}
                className="hover:text-primary"
                href={cat.href}
              >
                {cat.label}
              </a>
            ))}
            <a className="flex items-center gap-1 hover:text-primary" href="#">
              <span>المزيد</span>
              <span className="material-icons text-base">expand_more</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
