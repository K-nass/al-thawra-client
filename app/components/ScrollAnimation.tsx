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
}: ScrollAnimationProps & { immediate?: boolean }) {
  return <div className={className}>{children}</div>;
}

// Stagger container for animating multiple children
export function StaggerContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  immediate?: boolean;
}) {
  return <div className={className}>{children}</div>;
}

// Individual stagger item
export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
