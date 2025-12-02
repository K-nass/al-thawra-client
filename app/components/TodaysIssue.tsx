import { Calendar, Newspaper, AlertCircle } from "lucide-react";
import { Link } from "react-router";
import { ScrollAnimation } from "./ScrollAnimation";

interface TodaysIssueProps {
  issueNumber?: string;
  date?: string;
  magazineCover?: string;
  magazineDate?: string; // Date in YYYY-MM-DD format for routing
  urgentNews?: string[];
}

export function TodaysIssue({ 
  issueNumber,
  date,
  magazineCover,
  magazineDate,
  urgentNews = [
    "عاجل: تطورات جديدة في الأحداث السياسية الإقليمية",
    "عاجل: إعلان هام من الحكومة بشأن الإصلاحات الاقتصادية",
    "عاجل: اجتماع طارئ لمناقشة القضايا الراهنة",
    "عاجل: تحديثات مستمرة حول الأوضاع الميدانية"
  ]
}: TodaysIssueProps) {
  
  // Don't render if no magazine data is provided
  if (!issueNumber || !date || !magazineCover) {
    return null;
  }
  
  return (
    <ScrollAnimation animation="slideUp" duration={0.6} once={true}>
      <section className="mb-12">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] shadow-2xl mb-6">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
          
          {/* Content Section */}
          <div className="relative z-10 p-6 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white mb-1">عدد اليوم</h2>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">{date}</span>
                  </div>
                  <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                  <span className="text-sm font-medium">{issueNumber}</span>
                </div>
              </div>
            </div>

            {/* Magazine Cover - Square */}
            <Link
              to={magazineDate ? `/magazines/date/${magazineDate}` : "/magazines"}
              className="group relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              <img
                src={magazineCover}
                alt="غلاف العدد"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-150"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-xs font-bold text-center px-2">اقرأ<br/>العدد</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Urgent News Ticker */}
        <div className="relative overflow-hidden bg-red-800 rounded-xl mb-6 shadow-lg">
          <div className="flex items-center">
            {/* Fixed Label */}
            <div className="flex-shrink-0 bg-red-900 px-6 py-3 flex items-center gap-2 border-r-2 border-red-950">
              <AlertCircle className="w-5 h-5 text-white animate-pulse" />
              <span className="text-white font-bold text-sm whitespace-nowrap">عاجل</span>
            </div>
            
            {/* Scrolling News */}
            <div className="flex-1 overflow-hidden py-3">
              <div className="flex animate-scroll-rtl">
                {/* Duplicate the news items for seamless loop */}
                {[...urgentNews, ...urgentNews].map((news, index) => (
                  <div key={index} className="flex items-center flex-shrink-0 px-8">
                    <span className="text-white font-medium text-sm whitespace-nowrap">
                      {news}
                    </span>
                    <span className="mx-4 text-red-300">•</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CSS Animation for Ticker */}
        <style>{`
          @keyframes scroll-rtl {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-scroll-rtl {
            animation: scroll-rtl 15s linear infinite;
          }
          
          .animate-scroll-rtl:hover {
            animation-play-state: paused;
          }
        `}</style>

      </section>
    </ScrollAnimation>
  );
}
