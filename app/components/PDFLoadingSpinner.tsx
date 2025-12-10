import { motion } from "framer-motion";

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
    <div className="w-[calc(100vw-8rem)] h-[calc(100vh-8rem)] flex flex-col items-center justify-center gap-6">
      {/* Animated container with gradient background */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`${containerSizeClasses[size]} relative flex items-center justify-center`}
      >
        {/* Outer rotating gradient ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-secondary)] opacity-20 blur-md"
        />
        
        {/* Inner rotating gradient ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-2 rounded-full bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] opacity-10"
        />

        {/* Logo with spin animation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear"
          }}
          className="relative z-10"
        >
          <img 
            src="/formLogo.png" 
            alt="Loading" 
            className={`${sizeClasses[size]} drop-shadow-2xl`}
            loading="lazy"
          />
        </motion.div>

        {/* Pulsing glow effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full bg-[var(--color-primary)] blur-xl opacity-30"
        />
      </motion.div>

      {/* Loading message with fade animation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="text-center"
      >
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          {message}
        </p>
        
        {/* Animated dots */}
        <div className="flex items-center justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-2 h-2 rounded-full bg-[var(--color-primary)]"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
