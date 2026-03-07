import { useState, useEffect } from "react";

export function DateTimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${dayName} ${monthName} ${day}, ${year}`;
  };

  return (
    <div className="flex items-center gap-2 text-gray-700 font-medium">
      <img 
        src="spinning-earth2.gif" 
        alt="Spinning Earth"
        className="w-4 h-4"
      />
      <div className="flex items-center gap-2">
        <span className="text-xs">{formatTime(currentTime)}</span>
        <span className="text-xs tracking-wide">{formatDate(currentTime)}</span>
      </div>
    </div>
  );
}
