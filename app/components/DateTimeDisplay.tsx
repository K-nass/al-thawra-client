import { useState, useEffect } from "react";
import { Globe } from "lucide-react";

export function DateTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ar-SA", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${dayName} ${day} ${monthName} ${year}`;
  };

  return (
    <div className="flex items-center gap-1 text-gray-700 font-medium whitespace-nowrap">
      <div className="flex items-center gap-1">
        <span className="text-xs">{formatTime(currentTime)}</span>
        <span className="text-xs tracking-tight">{formatDate(currentTime)}</span>
      </div>
      {!imageError ? (
        <img 
          src="/spinning-earth2.gif" 
          alt="Spinning Earth"
          className="w-4 h-4 shrink-0"
          onError={() => setImageError(true)}
          loading="eager"
        />
      ) : (
        <Globe className="w-4 h-4 shrink-0 text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
      )}
    </div>
  );
}
