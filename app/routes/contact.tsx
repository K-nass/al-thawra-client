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
    <div>
      <div>
        {/* Header Section with Logo */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <img
              src="/formLogo.png"
              alt="شعار صحيفة الثورة"
            />
          </motion.div>
          <motion.h1
            variants={itemVariants}
          >
            اتصل بنا
          </motion.h1>
          <motion.p
            variants={itemVariants}
          >
            نحن هنا للاستماع إليك. تواصل معنا لأي استفسارات أو اقتراحات
          </motion.p>
        </motion.div>

        <div>
          <div>
            {/* Contact Information */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={slideInLeft}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <h2>
                  معلومات التواصل
                </h2>

                <div>
                  {/* Email */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <div>
                      <Mail />
                    </div>
                    <div>
                      <h3>
                        البريد الإلكتروني
                      </h3>
                      <a
                        href="mailto:info@althawra.com"
                      >
                        info@althawra.com
                      </a>
                    </div>
                  </motion.div>

                  {/* Phone */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <div>
                      <Phone />
                    </div>
                    <div>
                      <h3>
                        الهاتف
                      </h3>
                      <a
                        href="tel:+96512345678"
                      >
                        +965 1234 5678
                      </a>
                    </div>
                  </motion.div>

                  {/* Address */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div>
                      <MapPin />
                    </div>
                    <div>
                      <h3>
                        العنوان
                      </h3>
                      <p>
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <h2>ساعات العمل</h2>
                <div>
                  <div>
                    <span>الأحد - الخميس</span>
                    <span>8:00 ص - 5:00 م</span>
                  </div>
                  <div>
                    <span>الجمعة</span>
                    <span>مغلق</span>
                  </div>
                  <div>
                    <span>السبت</span>
                    <span>مغلق</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={slideInRight}
            >
              <h2>
                أرسل لنا رسالة
              </h2>

              {isSubmitted ? (
                <div>
                  <div>
                    <CheckCircle />
                  </div>
                  <h3>
                    تم إرسال رسالتك بنجاح!
                  </h3>
                  <p>
                    شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
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
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
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
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
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
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
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
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div />
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <Send />
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
