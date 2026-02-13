import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = "", hover = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border border-white/20 
        bg-white/10 backdrop-blur-xl 
        shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        ${hover ? "transition-all duration-300 hover:bg-white/20 hover:shadow-[0_8px_40px_rgba(0,0,0,0.18)] hover:scale-[1.01] cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
