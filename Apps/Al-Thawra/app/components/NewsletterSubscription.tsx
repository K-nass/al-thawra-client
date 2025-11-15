import { useState } from "react";

export function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [receiveLatestNews, setReceiveLatestNews] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", { email, receiveLatestNews });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-right mb-8">
            هل تريد الاشتراك في نشرتنا الاخبارية؟
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Logo/Brand */}
              <div className="flex-shrink-0 order-1 md:order-3">
                <div className="text-4xl md:text-5xl font-bold text-[var(--color-primary)]">
                  القبس
                </div>
              </div>

              {/* Email Input */}
              <div className="flex-1 order-2 md:order-2 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="البريد الإلكتروني"
                  required
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent text-right"
                  dir="rtl"
                />
              </div>

              {/* Submit Button */}
              <div className="flex-shrink-0 order-3 md:order-1">
                <button
                  type="submit"
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white p-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
                  aria-label="إرسال"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-6 text-gray-600">
              {/* Breaking News Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <span className="text-sm md:text-base group-hover:text-gray-900 transition-colors">
                  تلقي آخر الأخبار
                </span>
              </label>

              {/* Separator */}
              <span className="hidden md:inline text-gray-400">|</span>

              {/* Latest News Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer group">
                <span className="text-sm md:text-base group-hover:text-gray-900 transition-colors">
                  استلام تحديث عدد اليوم PDF
                </span>
                <input
                  type="checkbox"
                  checked={receiveLatestNews}
                  onChange={(e) => setReceiveLatestNews(e.target.checked)}
                  className="w-5 h-5 text-[var(--color-primary)] border-gray-300 rounded focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </label>
            </div>
          </form>

          {/* Privacy Note */}
          <p className="text-xs text-gray-500 text-right mt-6">
            بالاشتراك في النشرة الإخبارية، فإنك توافق على{" "}
            <a href="#" className="text-[var(--color-primary)] hover:underline">
              سياسة الخصوصية
            </a>{" "}
            و
            <a href="#" className="text-[var(--color-primary)] hover:underline">
              {" "}
              شروط الاستخدام
            </a>
          </p>
    </div>
  );
}
