import { useState } from "react";
import { ScrollAnimation } from "./ScrollAnimation";

export function NewsletterSubscription() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
  };

  return (
    <ScrollAnimation animation="slideUp" once={false}>
      <div>
        {/* Title */}
        <h2 className="text-2xl font-bold mb-6 text-black">
          هل تريد الاشتراك في نشرتنا الاخبارية؟
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="flex border-2 border-black">
            {/* Email Input */}
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                required
                className="w-full px-4 py-2 text-black placeholder-gray-500 focus:outline-none bg-gray-100 border-0"
                dir="rtl"
              />
            </div>

            {/* Submit Button */}
            <div className="border-r-2 border-black">
              <button
                type="submit"
                className="px-4 py-4text-black font-bold focus:outline-none transition-colors h-full cursor-pointer"
                aria-label="إرسال"
              >
                إرسال
              </button>
            </div>
          </div>
        </form>
      </div>
    </ScrollAnimation>
  );
}
