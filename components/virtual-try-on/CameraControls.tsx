"use client";

import React from "react";
import {
  Camera,
  RefreshCw,
  Sun,
  Sparkles,
  Info,
} from "lucide-react";
import { TryOnCategory } from "./types";

interface CameraControlsProps {
  onCapture: () => void;
  onFlipCamera: () => void;
  lightingBoost: boolean;
  onToggleLighting: () => void;
  selectedCategory: TryOnCategory;
  onSelectCategory: (cat: TryOnCategory) => void;
  isCapturing: boolean;
  onToggleDebug?: () => void;
  showDebugToggle?: boolean;
}

const categories: { label: string; value: TryOnCategory }[] = [
  { label: "Earrings", value: "earring" },
  { label: "Necklaces", value: "necklace" },
  { label: "Rings", value: "ring" },
  { label: "Bangles", value: "bangle" },
  { label: "Maang Tikka", value: "maang-tikka" },
];

export default function CameraControls({
  onCapture,
  onFlipCamera,
  lightingBoost,
  onToggleLighting,
  selectedCategory,
  onSelectCategory,
  isCapturing,
  onToggleDebug,
  showDebugToggle,
}: CameraControlsProps) {
  return (
    <div className="space-y-4 w-full">
      {/* Category Quick Filter Chips */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => onSelectCategory(cat.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-serif uppercase tracking-wider whitespace-nowrap transition border ${
              selectedCategory === cat.value
                ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-sm shadow-amber-900/30"
                : "bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Action Bar */}
      <div className="flex items-center justify-between px-6 sm:px-12">
        {/* Flip Camera */}
        <button
          type="button"
          onClick={onFlipCamera}
          className="w-11 h-11 rounded-full bg-stone-900/80 border border-stone-800 hover:border-amber-600/50 text-stone-300 hover:text-amber-300 flex items-center justify-center transition shadow-lg backdrop-blur-md active:scale-95"
          title="Flip Camera (Front / Back)"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Big Luxury Shutter Capture Button */}
        <button
          type="button"
          disabled={isCapturing}
          onClick={onCapture}
          className="group relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-500 p-1.5 shadow-xl shadow-amber-900/40 hover:shadow-amber-500/30 active:scale-95 transition-all duration-300 disabled:opacity-50"
          title="Capture High-Resolution Portrait"
        >
          <div className="w-full h-full rounded-full border-2 border-stone-950/60 flex items-center justify-center bg-stone-950 group-hover:bg-stone-900 transition">
            <Camera className="w-6 h-6 text-amber-300 group-hover:scale-110 transition duration-300" />
          </div>
        </button>

        {/* Right Action: Lighting Boost & Optional Debug */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLighting}
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition shadow-lg backdrop-blur-md active:scale-95 ${
              lightingBoost
                ? "bg-amber-500 text-stone-950 border-amber-400 font-bold"
                : "bg-stone-900/80 border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-600/50"
            }`}
            title="Studio Lighting Boost"
          >
            <Sun className="w-4 h-4" />
          </button>

          {showDebugToggle && onToggleDebug && (
            <button
              type="button"
              onClick={onToggleDebug}
              className="w-9 h-9 rounded-full bg-stone-900/60 border border-stone-800 text-stone-400 hover:text-stone-200 flex items-center justify-center transition text-xs"
              title="Toggle Diagnostics HUD"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
