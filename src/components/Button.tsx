import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "white" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-700 text-white border border-primary-700 hover:bg-primary-800 hover:border-primary-800 active:bg-primary-900 focus-visible:ring-primary-700 shadow-xs font-semibold",
  secondary:
    "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 active:border-slate-400 focus-visible:ring-slate-400 shadow-xs font-medium",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 focus-visible:ring-slate-400 font-medium",
  white:
    "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 focus-visible:ring-slate-400 shadow-xs font-semibold",
  danger:
    "bg-error-600 text-white border border-error-600 hover:bg-error-700 active:bg-error-800 focus-visible:ring-error-600 shadow-xs font-semibold",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs sm:text-sm min-h-[36px]",
  md: "px-4 py-2 text-sm min-h-[40px] sm:min-h-[44px]",
  lg: "px-5 py-2.5 text-sm sm:text-base min-h-[44px] sm:min-h-[48px]",
};

export function Button({
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
