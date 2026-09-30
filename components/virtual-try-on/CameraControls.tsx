"use client";

import React from "react";
import {
  Camera,
  RefreshCw,
  Sun,
  Sparkles,
  Info,
  Sliders,
  Plus,
  Minus,
  ChevronUp,
  ChevronDown,
  RotateCcw,
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
  userScale?: number;
  onChangeScale?: (delta: number) => void;
  userNudgeY?: number;
  onChangeNudgeY?: (delta: number) => void;
  onResetAdjustments?: () => void;
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
  userScale = 1.0,
  onChangeScale,
  userNudgeY = 0,
  onChangeNudgeY,
  onResetAdjustments,
}: CameraControlsProps) {
  const [showAdjustments, setShowAdjustments] = React.useState(false);

  return (
    <div className="space-y-3 w-full">
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

      {/* Optional Micro-Adjustment Bar for Precision Wear Fit */}
      {showAdjustments && onChangeScale && onChangeNudgeY && onResetAdjustments && (
        <div className="flex flex-wrap items-center justify-center gap-3 py-2 px-4 bg-stone-900/90 border border-stone-800 rounded-2xl text-xs text-stone-300 backdrop-blur-md animate-fade-in shadow-inner">
          {/* Size / Scale */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-stone-400 font-medium">Size:</span>
            <button
              type="button"
              onClick={() => onChangeScale(-0.05)}
              className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 transition"
              title="Smaller size"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono text-xs font-bold text-amber-400">
              {Math.round(userScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => onChangeScale(0.05)}
              className="p-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 transition"
              title="Larger size"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-stone-700">|</span>

          {/* Position Height */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-stone-400 font-medium">Position:</span>
            <button
              type="button"
              onClick={() => onChangeNudgeY(-8)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-[11px] transition"
              title="Nudge Upwards"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Up</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeNudgeY(8)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-[11px] transition"
              title="Nudge Downwards"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Down</span>
            </button>
          </div>

          <span className="text-stone-700">|</span>

          {/* Reset */}
          <button
            type="button"
            onClick={onResetAdjustments}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 text-[11px] transition"
            title="Reset to default fit"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Main Action Bar */}
      <div className="flex items-center justify-between px-6 sm:px-12">
        {/* Flip Camera & Fine-Tune Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onFlipCamera}
            className="w-11 h-11 rounded-full bg-stone-900/80 border border-stone-800 hover:border-amber-600/50 text-stone-300 hover:text-amber-300 flex items-center justify-center transition shadow-lg backdrop-blur-md active:scale-95"
            title="Flip Camera (Front / Back)"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowAdjustments(!showAdjustments)}
            className={`w-11 h-11 rounded-full border flex items-center justify-center transition shadow-lg backdrop-blur-md active:scale-95 ${
              showAdjustments
                ? "bg-amber-500/20 border-amber-500 text-amber-300"
                : "bg-stone-900/80 border-stone-800 text-stone-300 hover:text-amber-300 hover:border-amber-600/50"
            }`}
            title="Fine-Tune Jewelry Fit (Scale / Position)"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

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
