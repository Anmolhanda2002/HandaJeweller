"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface TryOnButtonProps {
  onClick: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function TryOnButton({
  onClick,
  size = "md",
  className = "",
}: TryOnButtonProps) {
  const sizeClasses = {
    sm: "px-2.5 py-1 text-[10px]",
    md: "px-4 py-2.5 text-xs",
    lg: "px-6 py-3.5 text-sm",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative group inline-flex items-center justify-center gap-2 rounded-xl font-serif font-bold uppercase tracking-wider transition-all duration-300 shadow-md ${sizeClasses[size]} border border-[#996515]/40 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-amber-300 hover:text-amber-200 hover:border-[#996515] hover:shadow-amber-900/30 hover:shadow-lg active:scale-95 ${className}`}
    >
      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse group-hover:rotate-12 transition-transform duration-300" />
      <span>Try It On (AR)</span>
      <span className="absolute -top-1 -right-1 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
      </span>
    </button>
  );
}
