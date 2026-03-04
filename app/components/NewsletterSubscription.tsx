import { useState } from "react";
import { ScrollAnimation } from "./ScrollAnimation";

export function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [receiveLatestNews, setReceiveLatestNews] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
  };

  return (
    <ScrollAnimation animation="slideUp" once={false}>
      <div>
        {/* Title */}
        <h2>
          هل تريد الاشتراك في نشرتنا الاخبارية؟
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div>
            {/* Logo/Brand */}
            <div>
              <div>
                الثورة
              </div>
            </div>

            {/* Email Input */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                required
                dir="rtl"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                aria-label="إرسال"
              >
                <svg
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
          <div>
            {/* Breaking News Checkbox */}
            <label>
              <span>
                تلقي آخر الأخبار
              </span>
            </label>

            {/* Separator */}
            <span>|</span>

            {/* Latest News Checkbox */}
            <label>
              <span>
                استلام تحديث عدد اليوم PDF
              </span>
              <input
                type="checkbox"
                checked={receiveLatestNews}
                onChange={(e) => setReceiveLatestNews(e.target.checked)}
              />
            </label>
          </div>
        </form>

        {/* Privacy Note */}
        <p>
          بالاشتراك في النشرة الإخبارية، فإنك توافق على{" "}
          <a href="#">
            سياسة الخصوصية
          </a>{" "}
          و
          <a href="#">
            {" "}
            شروط الاستخدام
          </a>
        </p>
      </div>
    </ScrollAnimation>
  );
}
