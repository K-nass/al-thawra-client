import { TrendingUp, Users, Eye, Target, Mail, Phone } from "lucide-react";
import { generateMetaTags } from "~/utils/seo";

export function meta() {
  return generateMetaTags({
    title: "الإعلانات",
    description: "اعلن معنا في صحيفة الثورة - وصول واسع وجمهور متنوع",
    url: "/ads",
    type: "website",
  });
}

export default function AdsPage() {
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
            الإعلانات
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            اعلن معنا وصل إلى جمهور واسع ومتنوع
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Why Advertise */}
          <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-8">
            <h2 className="semafor-section-title text-gray-900 border-b border-black/10 mb-6">
              لماذا تعلن معنا؟
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">+1M</h3>
                <p className="text-gray-700">زيارة شهرية</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">+500K</h3>
                <p className="text-gray-700">قارئ نشط</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">+200K</h3>
                <p className="text-gray-700">متابع على وسائل التواصل</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">دقيق</h3>
                <p className="text-gray-700">استهداف الجمهور</p>
              </div>
            </div>
          </div>

          {/* Ad Types */}
          <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-8">
            <h2 className="semafor-section-title text-gray-900 border-b border-black/10 mb-6">
              أنواع الإعلانات
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-dashed border-black/10 rounded-lg p-6 hover:bg-[#a8c5d4]/20 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">إعلانات البانر</h3>
                <p className="text-gray-700 mb-4">
                  إعلانات مرئية في أماكن استراتيجية على الموقع لضمان أقصى ظهور
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>إعلان رئيسي في الصفحة الأولى</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>إعلانات جانبية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>إعلانات بين المقالات</span>
                  </li>
                </ul>
              </div>

              <div className="border border-dashed border-black/10 rounded-lg p-6 hover:bg-[#a8c5d4]/20 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">المحتوى المدعوم</h3>
                <p className="text-gray-700 mb-4">
                  مقالات وتقارير مدعومة تتماشى مع محتوى الصحيفة
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>مقالات مدعومة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>تقارير خاصة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>مقابلات مدعومة</span>
                  </li>
                </ul>
              </div>

              <div className="border border-dashed border-black/10 rounded-lg p-6 hover:bg-[#a8c5d4]/20 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">إعلانات الفيديو</h3>
                <p className="text-gray-700 mb-4">
                  إعلانات فيديو قصيرة قبل أو أثناء محتوى الفيديو
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>إعلانات ما قبل الفيديو</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>إعلانات منتصف الفيديو</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>إعلانات نهاية الفيديو</span>
                  </li>
                </ul>
              </div>

              <div className="border border-dashed border-black/10 rounded-lg p-6 hover:bg-[#a8c5d4]/20 transition-colors">
                <h3 className="text-xl font-bold text-gray-900 mb-3">النشرة الإخبارية</h3>
                <p className="text-gray-700 mb-4">
                  إعلانات في النشرة الإخبارية اليومية والأسبوعية
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>إعلان في النشرة اليومية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>إعلان في النشرة الأسبوعية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>رعاية كاملة للنشرة</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-8">
            <h2 className="semafor-section-title text-gray-900 border-b border-black/10 mb-6">
              تواصل معنا
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              للحصول على عرض أسعار مخصص أو لمزيد من المعلومات حول فرص الإعلان، يرجى التواصل مع فريق المبيعات لدينا:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 border border-dashed border-black/10 rounded-lg">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">البريد الإلكتروني</p>
                  <a href="mailto:ads@althawra.com" className="text-gray-900 font-medium hover:text-gray-700">
                    ads@althawra.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border border-dashed border-black/10 rounded-lg">
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">الهاتف</p>
                  <a href="tel:+96512345678" className="text-gray-900 font-medium hover:text-gray-700">
                    +965 1234 5678
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
