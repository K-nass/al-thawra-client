export default function TopBar() {
  return (
    <div className="bg-gray-100 text-gray-600 border-b border-gray-300">
      <div className="container mx-auto px-4 py-2">
        {/* Editors Info */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="text-gray-900 font-bold">
              رئيس التحرير: وليد عبداللطيف النصف
            </span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">
              نائب رئيس التحرير: عبدالله غازي المضف
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a className="flex items-center gap-1 hover:text-primary" href="#">
              <span className="material-icons">download</span>
              <span>تحميل آخر عدد PDF</span>
            </a>
            <span className="hidden md:inline">|</span>
            <a className="hidden md:inline hover:text-primary" href="#">
              عرض أرشيف الأعداد
            </a>
          </div>
        </div>

        {/* Breaking News */}
        <div className="flex justify-between items-center mt-2 text-xs">
          <div className="flex items-center gap-2 bg-primary text-white py-1 px-2 rounded-md">
            <span className="font-bold">عاجل</span>
            <span>نائب رئيس التحرير: عبدالله غازي المضف</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <a className="hover:text-primary" href="#">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"></path>
              </svg>
            </a>
            <a className="hover:text-primary" href="#">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M10 15l5.19-3L10 9v6m11.56-7.4c-.78-2.93-3.29-5.34-6.3-5.58C12.87 2 11.13 2 8.74 2.01c-3 .24-5.51 2.65-6.3 5.58C2 9.4 2 12 2 12s0 2.6.44 4.4c.78 2.93 3.29 5.34 6.3 5.58 2.39.01 4.13.01 6.52 0 3-.24 5.51-2.65 6.3-5.58C22 14.6 22 12 22 12s0-2.6-.44-4.4z"></path>
              </svg>
            </a>
            <a className="hover:text-primary" href="#">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7 14 1.41z" transform="scale(1.4) translate(-3, -3)"></path>
              </svg>
            </a>
            <a className="hover:text-primary" href="#">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.94.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21c7.35 0 11.37-6.08 11.37-11.37 0-.17 0-.34-.01-.51.78-.57 1.45-1.28 1.98-2.08z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
