interface PDFLoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function PDFLoadingSpinner({ 
  message = "جاري التحميل...", 
  size = "lg" 
}: PDFLoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32"
  };

  const containerSizeClasses = {
    sm: "w-16 h-16",
    md: "w-28 h-28",
    lg: "w-40 h-40"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated container with gradient background */}
      <div className={`relative ${containerSizeClasses[size]} flex items-center justify-center`}>
        {/* Outer rotating gradient ring */}
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin`} style={{ animationDuration: '3s' }} />
        
        {/* Inner rotating gradient ring */}
        <div className={`absolute inset-2 ${sizeClasses[size]} rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500`} style={{ animation: 'spin 2s linear infinite reverse' }} />

        {/* Logo with spin animation */}
        <div className={`relative z-10 ${sizeClasses[size]} flex items-center justify-center animate-spin`} style={{ animationDuration: '2.5s' }}>
          <img 
            src="/formLogo.png" 
            alt="Loading"
            loading="lazy"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Pulsing glow effect */}
        <div className="absolute inset-0 rounded-full bg-blue-400/30 blur-xl animate-pulse" />
      </div>

      {/* Loading message */}
      <div className="text-center">
        <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
          {message}
        </p>
        
        {/* Animated dots */}
        <div className="flex gap-1 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
