import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Post } from "../../services/postsService";

interface NewsTickerProps {
  headlines: Post[];
  /** Interval in ms between headline changes */
  interval?: number;
}

export function NewsTicker({ headlines, interval = 5000 }: NewsTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const advance = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % headlines.length);
  }, [headlines.length]);

  useEffect(() => {
    if (headlines.length <= 1) return;
    const timer = setInterval(advance, interval);
    return () => clearInterval(timer);
  }, [advance, interval, headlines.length]);

  if (!headlines.length) return null;

  const current = headlines[currentIndex];

  return (
    <div className="flex items-center gap-3 min-w-0 flex-1">
      {/* Label */}
      <span
        className="shrink-0 text-sm font-bold tracking-wide"
        style={{ color: "#c71f37" }}
      >
        آخر الأخبار
      </span>

      {/* Divider */}
      <span
        className="shrink-0 w-px h-4"
        style={{ backgroundColor: "#c71f37" }}
        aria-hidden="true"
      />

      {/* Animated headline */}
      <div className="relative overflow-hidden h-5 flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.span
            key={current.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 text-sm font-medium truncate"
            style={{ color: "#2d3436" }}
          >
            {current.title}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
