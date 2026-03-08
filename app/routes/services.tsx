import { Newspaper, Video, Mic, Image, Tv, Radio, FileText, Users } from "lucide-react";
import { generateMetaTags } from "~/utils/seo";

export function meta() {
  return generateMetaTags({
    title: "خدماتنا",
    description: "تعرف على الخدمات الإعلامية المتنوعة التي تقدمها صحيفة الثورة",
    url: "/services",
    type: "website",
  });
}

export default function ServicesPage() {
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
            خدماتنا
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            نقدم مجموعة متنوعة من الخدمات الإعلامية المتميزة
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Main Services */}
          <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-8">
            <h2 className="semafor-section-title text-gray-900 border-b border-black/10 mb-6">
              خدماتنا الرئيسية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* News Service */}
              <div className="border border-dashed border-black/10 rounded-lg p-6 hover:bg-[#a8c5d4]/20 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Newspaper className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">الأخبار</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  تغطية شاملة ومتنوعة للأخبار المحلية والعالمية على مدار الساعة
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>أخبار محلية وعالمية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>تحديثات فورية للأحداث العاجلة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>تغطية متخصصة في مختلف المجالات</span>
                  </li>
                </ul>
              </div>

              {/* Video Service */}
              <div className="border border-dashed border-black/10 rounded-lg p-6 hover:bg-[#a8c5d4]/20 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">الفيديو</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  محتوى مرئي متنوع من تقارير إخبارية ومقابلات وتحليلات
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>تقارير مصورة حصرية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>مقابلات مع شخصيات بارزة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>بث مباشر للأحداث المهمة</span>
                  </li>
                </ul>
              </div>

              {/* Podcast Service */}
              <div className="border border-dashed border-black/10 rounded-lg p-6 hover:bg-[#a8c5d4]/20 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mic className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">البودكاست</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  برامج صوتية متنوعة تناقش القضايا المهمة والأحداث الجارية
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>حلقات أسبوعية متخصصة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>مقابلات صوتية حصرية</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>تحليلات معمقة للأحداث</span>
                  </li>
                </ul>
              </div>

              {/* Magazine Service */}
              <div className="border border-dashed border-black/10 rounded-lg p-6 hover:bg-[#a8c5d4]/20 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">المجلة</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  مجلة رقمية شهرية تحتوي على مقالات وتقارير متعمقة
                </p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>إصدار شهري رقمي</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>مقالات متخصصة ومتعمقة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2"></span>
                    <span>تصميم احترافي وجذاب</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-8">
            <h2 className="semafor-section-title text-gray-900 border-b border-black/10 mb-6">
              خدمات إضافية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Image className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">معرض الصور</h3>
                <p className="text-gray-700 text-sm">
                  مجموعة واسعة من الصور الصحفية عالية الجودة
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Tv className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">البث المباشر</h3>
                <p className="text-gray-700 text-sm">
                  بث مباشر للأحداث والمؤتمرات الصحفية
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Radio className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">الراديو</h3>
                <p className="text-gray-700 text-sm">
                  محطة راديو رقمية تبث على مدار الساعة
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">آراء الكتاب</h3>
                <p className="text-gray-700 text-sm">
                  مقالات رأي من كتاب ومحللين متخصصين
                </p>
              </div>
            </div>
          </div>

          {/* Professional Services */}
          <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-8">
            <h2 className="semafor-section-title text-gray-900 border-b border-black/10 mb-6">
              الخدمات المهنية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-dashed border-black/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">التغطية الإعلامية</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  نوفر خدمات التغطية الإعلامية للفعاليات والمؤتمرات والأحداث الخاصة بجودة احترافية عالية
                </p>
              </div>

              <div className="border border-dashed border-black/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">إنتاج المحتوى</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  خدمات إنتاج محتوى إعلامي متكامل من كتابة وتصوير ومونتاج بأعلى المعايير المهنية
                </p>
              </div>

              <div className="border border-dashed border-black/10 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">الاستشارات الإعلامية</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  نقدم استشارات إعلامية متخصصة للمؤسسات والشركات في مجال الإعلام والعلاقات العامة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
