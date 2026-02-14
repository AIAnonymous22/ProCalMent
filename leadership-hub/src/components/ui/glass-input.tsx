import { InputHTMLAttributes, forwardRef } from "react";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-white/70">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-xl border border-white/20
            bg-white/10 backdrop-blur-sm
            px-4 py-2.5 text-white placeholder-white/40
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/30
            ${error ? "border-red-400/50" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";
