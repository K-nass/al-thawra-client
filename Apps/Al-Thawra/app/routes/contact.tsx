import { useState } from "react";
import type { Route } from "./+types/contact";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { generateMetaTags } from "~/utils/seo";

export function meta({}: Route.MetaArgs) {
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

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
    <div className="min-h-screen bg-gradient-to-b from-[var(--color-background-light)] to-[var(--color-secondary-light)]/10">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section with Logo */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.div className="flex justify-center mb-6" variants={itemVariants}>
            <img
              src="/formLogo.png"
              alt="شعار صحيفة الثورة"
              className="h-32 w-auto object-contain"
            />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold text-[var(--color-text-primary)] mb-4"
            variants={itemVariants}
          >
            اتصل بنا
          </motion.h1>
          <motion.p
            className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto"
            variants={itemVariants}
          >
            نحن هنا للاستماع إليك. تواصل معنا لأي استفسارات أو اقتراحات
          </motion.p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <motion.div
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={slideInLeft}
            >
              <motion.div
                className="bg-[var(--color-white)] rounded-2xl shadow-lg p-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
                  معلومات التواصل
                </h2>

                <div className="space-y-6">
                  {/* Email */}
                  <motion.div
                    className="flex items-start gap-4 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors duration-300">
                      <Mail className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                        البريد الإلكتروني
                      </h3>
                      <a
                        href="mailto:info@althawra.com"
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        info@althawra.com
                      </a>
                    </div>
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    className="flex items-start gap-4 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors duration-300">
                      <Phone className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                        الهاتف
                      </h3>
                      <a
                        href="tel:+96512345678"
                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        +965 1234 5678
                      </a>
                    </div>
                  </motion.div>

                  {/* Address */}
                  <motion.div
                    className="flex items-start gap-4 group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors duration-300">
                      <MapPin className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                        العنوان
                      </h3>
                      <p className="text-[var(--color-text-secondary)]">
                        الكويت، شارع الصحافة
                        <br />
                        مبنى صحيفة الثورة
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Working Hours */}
              <motion.div
                className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] rounded-2xl shadow-lg p-8 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-2xl font-bold mb-6">ساعات العمل</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="font-medium">الأحد - الخميس</span>
                    <span>8:00 ص - 5:00 م</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="font-medium">الجمعة</span>
                    <span>مغلق</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">السبت</span>
                    <span>مغلق</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              className="bg-[var(--color-white)] rounded-2xl shadow-lg p-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={slideInRight}
            >
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
                أرسل لنا رسالة
              </h2>

              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-[var(--color-success)]/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-[var(--color-success)]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
                    تم إرسال رسالتك بنجاح!
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-center">
                    شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
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
                      className="w-full px-4 py-3 border border-[var(--color-divider)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                      placeholder="أدخل اسمك الكامل"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
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
                      className="w-full px-4 py-3 border border-[var(--color-divider)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                      placeholder="example@email.com"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
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
                      className="w-full px-4 py-3 border border-[var(--color-divider)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                      placeholder="موضوع الرسالة"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
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
                      className="w-full px-4 py-3 border border-[var(--color-divider)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[var(--color-primary)] text-white py-3 px-6 rounded-lg font-medium hover:bg-[var(--color-primary-light)] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
