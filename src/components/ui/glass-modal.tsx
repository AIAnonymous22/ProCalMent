"use client";

import { ReactNode, useEffect } from "react";
import { GlassCard } from "./glass-card";

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function GlassModal({ open, onClose, title, children, maxWidth = "max-w-lg" }: GlassModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <GlassCard className={`relative z-10 w-full ${maxWidth} p-6 bg-slate-900/80 border-white/15`}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="text-white/50 hover:text-white/80 transition-colors text-xl leading-none">&times;</button>
          </div>
        )}
        {children}
      </GlassCard>
    </div>
  );
}
