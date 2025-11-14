export default function SecondaryNav() {
  return (
    <nav className="bg-[#005C9C]">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Right side - Logo and Navigation */}
          <div className="flex items-center space-x-8 space-x-reverse">
            <a className="text-3xl font-bold text-white tracking-wider" href="#">الثورة</a>
            <ul className="hidden lg:flex items-center space-x-6 space-x-reverse">
              <li><a className="text-white hover:text-gray-200 transition-colors text-sm" href="#">الرئيسية</a></li>
              <li><a className="text-white hover:text-gray-200 transition-colors text-sm" href="#">محليات</a></li>
              <li><a className="text-white hover:text-gray-200 transition-colors text-sm" href="#">كتاب وآراء</a></li>
              <li><a className="text-white hover:text-gray-200 transition-colors text-sm" href="#">أمن ومحاكم</a></li>
              <li><a className="text-white hover:text-gray-200 transition-colors text-sm" href="#">اقتصاد</a></li>
              <li><a className="text-white hover:text-gray-200 transition-colors text-sm" href="#">الرياضة</a></li>
              <li><a className="text-white hover:text-gray-200 transition-colors text-sm" href="#">الفن والثقافة</a></li>
            </ul>
          </div>

        </div>
      </div>
    </nav>
  );
}
