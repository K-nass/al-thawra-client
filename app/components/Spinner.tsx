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
  primary: "text-[#5a8ca8]",
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
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2
        className={`${sizeClasses[size]} ${variantClasses[variant]} ${className} animate-spin`}
      />
      {text && (
        <span className="text-sm text-gray-600">
          {text}
        </span>
      )}
    </div>
  );
}

// Inline spinner for buttons
export function ButtonSpinner({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-block ${className}`}>
      <Loader2 className="w-4 h-4 animate-spin" />
    </span>
  );
}

// Full page spinner overlay
export function PageSpinner({ text = "جاري التحميل..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-[#d0e8f2] flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="xl" variant="primary" />
        <p className="mt-4 text-gray-700 font-medium">
          {text}
        </p>
      </div>
    </div>
  );
}

// Navigation progress bar
export function NavigationProgress() {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-[#d0e8f2] z-50">
      <div className="h-full bg-[#5a8ca8] animate-pulse" style={{ width: '70%' }} />
    </div>
  );
}
