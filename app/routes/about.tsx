import { Users, Target, Award, Heart } from "lucide-react";
import { generateMetaTags } from "~/utils/seo";

export function meta() {
  return generateMetaTags({
    title: "من نحن",
    description: "تعرف على صحيفة الثورة - منصة إخبارية شاملة تقدم أحدث الأخبار والتحليلات من اليمن والعالم",
    url: "/about",
    type: "website",
  });
}

export default function AboutPage() {
  return (
    <div dir="rtl" className="py-12">
      <div className="semafor-container">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">من نحن</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">صحيفة الثورة - صوت الحقيقة والشفافية</p>
        </div>

        <div className="space-y-8">
          <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-8">
            <h2 className="semafor-section-title text-gray-900 border-b border-black/10 mb-6">نبذة عن الصحيفة</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>صحيفة الثورة هي منصة إخبارية شاملة تأسست لتكون صوتاً موثوقاً في عالم الإعلام العربي. نلتزم بتقديم أحدث الأخبار والتحليلات المتعمقة من اليمن والعالم، مع التركيز على المصداقية والشفافية في نقل الحدث.</p>
              <p>نؤمن بأن الصحافة الحرة والمستقلة هي ركيزة أساسية لبناء مجتمع واعٍ ومطلع. لذلك، نسعى جاهدين لتوفير محتوى إخباري متنوع يغطي مختلف المجالات السياسية والاقتصادية والثقافية والرياضية.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Target, title: "رسالتنا", text: "نسعى لتقديم صحافة مهنية ومستقلة تخدم المجتمع وتساهم في بناء رأي عام واعٍ ومطلع على الأحداث المحلية والعالمية." },
              { icon: Award, title: "رؤيتنا", text: "أن نكون المنصة الإخبارية الأولى والأكثر مصداقية في المنطقة، ومرجعاً موثوقاً للأخبار والتحليلات المتعمقة." },
              { icon: Users, title: "فريقنا", text: "نفخر بفريق عمل محترف من الصحفيين والمحررين والمحللين ذوي الخبرة الواسعة في مجال الإعلام والصحافة." },
              { icon: Heart, title: "قيمنا", text: "المصداقية، الشفافية، الاستقلالية، والمهنية هي القيم الأساسية التي نلتزم بها في كل ما نقدمه." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-[#d0e8f2] rounded-lg border border-black/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#d0e8f2] rounded-lg border border-black/10 p-8">
            <h2 className="semafor-section-title text-gray-900 border-b border-black/10 mb-6">مبادئنا الصحفية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "الالتزام بالحقيقة والدقة في نقل الأخبار",
                "احترام خصوصية الأفراد وحقوقهم",
                "التحقق من المصادر قبل النشر",
                "الموضوعية والحياد في التغطية الإخبارية",
                "الشفافية في التعامل مع الأخطاء وتصحيحها",
                "احترام التنوع والتعددية في الآراء",
              ].map((principle, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
