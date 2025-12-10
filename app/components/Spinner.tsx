import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "white" | "gray";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const variantClasses = {
  primary: "text-[var(--color-primary)]",
  white: "text-white",
  gray: "text-gray-500",
};

export function Spinner({ 
  size = "md", 
  variant = "primary", 
  className = "",
  text 
}: SpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 
        className={`animate-spin ${sizeClasses[size]} ${variantClasses[variant]}`}
      />
      {text && (
        <span className={`font-medium ${variantClasses[variant]}`}>
          {text}
        </span>
      )}
    </div>
  );
}

// Inline spinner for buttons
export function ButtonSpinner({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin ${className}`} />
  );
}

// Full page spinner overlay
export function PageSpinner({ text = "جاري التحميل..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-[var(--color-white)]/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <Spinner size="xl" variant="primary" />
        <p className="mt-4 text-lg font-medium text-[var(--color-primary)]">
          {text}
        </p>
      </div>
    </div>
  );
}

// Navigation progress bar
export function NavigationProgress() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[var(--color-primary)] animate-pulse">
      <div className="h-full bg-[var(--color-primary-dark)] animate-[progress_1s_ease-in-out_infinite]" />
    </div>
  );
}
