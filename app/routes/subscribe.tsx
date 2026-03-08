import { useState } from "react";
import { Mail, CheckCircle, Gift, Bell, Newspaper, Crown } from "lucide-react";
import { generateMetaTags } from "~/utils/seo";

export function meta() {
  return generateMetaTags({
    title: "للإشتراك",
    description: "اشترك في صحيفة الثورة واحصل على محتوى حصري ومزايا خاصة",
    url: "/subscribe",
    type: "website",
  });
}

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setEmail("");
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#d0e8f2] py-12">
      <div className="semafor-container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img
              src="/formLogo.png"
              alt="شعار صحيفة الثورة"
              className="h-24 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            اشترك معنا
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            احصل على آخر الأخبار والتحليلات مباشرة في بريدك الإلكتروني
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Subscription Form */}
          <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-8 max-w-2xl mx-auto">
            <h2 className="semafor-section-title text-gray-900 border-b border-black/10 mb-6 text-center">
              اشترك في النشرة الإخبارية
            </h2>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  تم الاشتراك بنجاح!
                </h3>
                <p className="text-gray-700">
                  شكراً لاشتراكك. ستصلك آخر الأخبار على بريدك الإلكتروني.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="example@email.com"
                      className="w-full pr-11 pl-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8c5d4] focus:border-transparent bg-[#d0e8f2]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>جاري الاشتراك...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>اشترك الآن</span>
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-600 text-center">
                  بالاشتراك، أنت توافق على تلقي رسائل بريد إلكتروني من صحيفة الثورة
                </p>
              </form>
            )}
          </div>

          {/* Benefits */}
          <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-8">
            <h2 className="semafor-section-title text-gray-900 border-b border-black/10 mb-6">
              مزايا الاشتراك
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">أخبار يومية</h3>
                  <p className="text-gray-700 text-sm">
                    احصل على ملخص يومي لأهم الأخبار والأحداث
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">محتوى حصري</h3>
                  <p className="text-gray-700 text-sm">
                    وصول مبكر إلى المقالات والتقارير الخاصة
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">تنبيهات فورية</h3>
                  <p className="text-gray-700 text-sm">
                    كن أول من يعرف بالأخبار العاجلة والمهمة
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">عروض خاصة</h3>
                  <p className="text-gray-700 text-sm">
                    احصل على عروض وخصومات حصرية للمشتركين
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">نشرة أسبوعية</h3>
                  <p className="text-gray-700 text-sm">
                    ملخص شامل لأهم أحداث الأسبوع
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">مجاني تماماً</h3>
                  <p className="text-gray-700 text-sm">
                    جميع المزايا متاحة مجاناً بدون أي رسوم
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Types */}
          <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-8">
            <h2 className="semafor-section-title text-gray-900 border-b border-black/10 mb-6">
              أنواع النشرات الإخبارية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-dashed border-black/10 rounded-lg p-6 hover:bg-[#a8c5d4]/20 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">النشرة اليومية</h3>
                <p className="text-gray-700 mb-4">
                  ملخص يومي لأهم الأخبار والأحداث المحلية والعالمية
                </p>
                <p className="text-sm text-gray-600">
                  تصل كل صباح في الساعة 8:00 صباحاً
                </p>
              </div>

              <div className="border border-dashed border-black/10 rounded-lg p-6 hover:bg-[#a8c5d4]/20 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">النشرة الأسبوعية</h3>
                <p className="text-gray-700 mb-4">
                  تحليل شامل لأهم أحداث الأسبوع مع تقارير متعمقة
                </p>
                <p className="text-sm text-gray-600">
                  تصل كل يوم جمعة في الساعة 6:00 مساءً
                </p>
              </div>

              <div className="border border-dashed border-black/10 rounded-lg p-6 hover:bg-[#a8c5d4]/20 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">الأخبار العاجلة</h3>
                <p className="text-gray-700 mb-4">
                  تنبيهات فورية للأخبار العاجلة والأحداث المهمة
                </p>
                <p className="text-sm text-gray-600">
                  تصل فوراً عند حدوث أخبار عاجلة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
