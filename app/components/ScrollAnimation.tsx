import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: "fade" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale";
  once?: boolean;
  amount?: number;
}

export function ScrollAnimation({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  animation = "fade",
  once = false,
  amount = 0.3,
}: ScrollAnimationProps) {
  const animations: Record<string, Variants> = {
    fade: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration, delay, ease: "easeOut" },
      },
    },
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration, delay, ease: "easeOut" },
      },
    },
    slideDown: {
      hidden: { opacity: 0, y: -50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration, delay, ease: "easeOut" },
      },
    },
    slideLeft: {
      hidden: { opacity: 0, x: 50 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration, delay, ease: "easeOut" },
      },
    },
    slideRight: {
      hidden: { opacity: 0, x: -50 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration, delay, ease: "easeOut" },
      },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration, delay, ease: "easeOut" },
      },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={animations[animation]}
    >
      {children}
    </motion.div>
  );
}

// Stagger container for animating multiple children
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  once = false,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  immediate?: boolean;
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  // If immediate is true, animate on mount instead of on scroll
  if (immediate) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  );
}

// Individual stagger item
export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
