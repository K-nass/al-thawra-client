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
    <div>
      <Loader2
      />
      {text && (
        <span>
          {text}
        </span>
      )}
    </div>
  );
}

// Inline spinner for buttons
export function ButtonSpinner({ className = "" }: { className?: string }) {
  return (
    <span />
  );
}

// Full page spinner overlay
export function PageSpinner({ text = "جاري التحميل..." }: { text?: string }) {
  return (
    <div>
      <div>
        <Spinner size="xl" variant="primary" />
        <p>
          {text}
        </p>
      </div>
    </div>
  );
}

// Navigation progress bar
export function NavigationProgress() {
  return (
    <div>
      <div />
    </div>
  );
}
