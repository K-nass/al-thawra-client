import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { generateMetaTags } from "~/utils/seo";

export function meta() {
  return generateMetaTags({
    title: "اتصل بنا",
    description: "تواصل مع فريق الثورة. نحن هنا للإجابة على استفساراتكم واستقبال ملاحظاتكم",
    url: "/contact",
    type: "website",
  });
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#d0e8f2] py-12">
      <div className="semafor-container">
        {/* Header Section with Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img
              src="/formLogo.png"
              alt="شعار صحيفة الثورة"
              className="h-24 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            اتصل بنا
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            نحن هنا للاستماع إليك. تواصل معنا لأي استفسارات أو اقتراحات
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-8">
              <h2 className="semafor-section-title text-gray-900 border-b border-black/10 mb-6">
                معلومات التواصل
              </h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      البريد الإلكتروني
                    </h3>
                    <a
                      href="mailto:info@althawra.com"
                      className="text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      info@althawra.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      الهاتف
                    </h3>
                    <a
                      href="tel:+96512345678"
                      className="text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      +965 1234 5678
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      العنوان
                    </h3>
                    <p className="text-gray-700">
                      الكويت، شارع الصحافة
                      <br />
                      مبنى صحيفة الثورة
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-8">
              <h2 className="semafor-section-title text-gray-900 border-b border-black/10 mb-6">ساعات العمل</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border border-dashed border-black/10 rounded-lg">
                  <span className="font-medium text-gray-900">الأحد - الخميس</span>
                  <span className="text-gray-700">8:00 ص - 5:00 م</span>
                </div>
                <div className="flex justify-between items-center p-3 border border-dashed border-black/10 rounded-lg">
                  <span className="font-medium text-gray-900">الجمعة</span>
                  <span className="text-gray-700">مغلق</span>
                </div>
                <div className="flex justify-between items-center p-3 border border-dashed border-black/10 rounded-lg">
                  <span className="font-medium text-gray-900">السبت</span>
                  <span className="text-gray-700">مغلق</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-8">
            <h2 className="semafor-section-title text-gray-900 border-b border-black/10 mb-6">
              أرسل لنا رسالة
            </h2>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  تم إرسال رسالتك بنجاح!
                </h3>
                <p className="text-gray-700">
                  شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="أدخل اسمك الكامل"
                    className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8c5d4] focus:border-transparent bg-[#d0e8f2]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8c5d4] focus:border-transparent bg-[#d0e8f2]"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    الموضوع
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="موضوع الرسالة"
                    className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8c5d4] focus:border-transparent bg-[#d0e8f2]"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-900 mb-2"
                  >
                    الرسالة
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full px-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a8c5d4] focus:border-transparent bg-[#d0e8f2] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>إرسال الرسالة</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
