import { ButtonHTMLAttributes, ReactNode } from "react";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary: "bg-indigo-500/80 hover:bg-indigo-500/90 text-white border-indigo-400/30",
  secondary: "bg-white/15 hover:bg-white/25 text-white border-white/20",
  ghost: "bg-transparent hover:bg-white/10 text-white/80 border-transparent",
  danger: "bg-red-500/80 hover:bg-red-500/90 text-white border-red-400/30",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

export function GlassButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: GlassButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl border backdrop-blur-sm
        font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-indigo-400/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
