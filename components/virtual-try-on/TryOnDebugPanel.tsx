"use client";

import React from "react";
import { Activity, Cpu, ShieldCheck, Zap } from "lucide-react";
import { TryOnDiagnostics } from "./types";

interface TryOnDebugPanelProps {
  diagnostics: TryOnDiagnostics | null;
  fps: number;
  isTracking: boolean;
  productName?: string;
}

export default function TryOnDebugPanel({
  diagnostics,
  fps,
  isTracking,
  productName,
}: TryOnDebugPanelProps) {
  if (!diagnostics) return null;

  return (
    <div className="bg-stone-950/90 border border-amber-600/30 rounded-xl p-3 text-[11px] font-mono text-stone-300 space-y-1.5 shadow-2xl backdrop-blur-md max-w-xs">
      <div className="flex items-center justify-between border-b border-stone-800 pb-1 text-amber-400 font-bold">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" />
          AR Diagnostics HUD
        </span>
        <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">
          DEV MODE
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        <div>
          <span className="text-stone-500 block">Active Engine</span>
          <span className="font-semibold text-stone-200">
            {diagnostics.providerId === "FREE_AI" ? "Free MediaPipe AI" : "Commercial AR"}
          </span>
        </div>

        <div>
          <span className="text-stone-500 block">Fallback Status</span>
          <span className={diagnostics.isFallback ? "text-amber-400" : "text-emerald-400"}>
            {diagnostics.isFallback ? "Fallback Active" : "Primary Engine"}
          </span>
        </div>

        <div>
          <span className="text-stone-500 block">Render FPS</span>
          <span className={`font-bold ${fps > 24 ? "text-emerald-400" : "text-amber-400"}`}>
            {fps || 30} FPS
          </span>
        </div>

        <div>
          <span className="text-stone-500 block">Neural State</span>
          <span className={isTracking ? "text-emerald-400 font-semibold" : "text-stone-500"}>
            {isTracking ? "Tracking 3D Locks" : "Searching..."}
          </span>
        </div>
      </div>

      {productName && (
        <div className="pt-1 border-t border-stone-800/80 text-[10px] text-stone-400 truncate">
          Active Piece: <span className="text-amber-300">{productName}</span>
        </div>
      )}
    </div>
  );
}
