"use client";

import React, { forwardRef } from "react";
import { Loader2, Sparkles } from "lucide-react";

interface CameraPreviewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isLoading: boolean;
  isTracking: boolean;
  lightingBoost: boolean;
  category?: string;
}

const CameraPreview = forwardRef<HTMLDivElement, CameraPreviewProps>(
  (
    { videoRef, canvasRef, isLoading, isTracking, lightingBoost, category = "earring" },
    ref
  ) => {
    const isHandCategory =
      category === "ring" || category === "bracelet" || category === "bangle";

    return (
      <div
        ref={ref}
        className="relative w-full h-full min-h-[420px] max-h-[70vh] bg-stone-950 rounded-2xl overflow-hidden flex items-center justify-center border border-stone-800 shadow-2xl"
      >
        {/* Mirror Front Camera Feed */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`w-full h-full object-cover -scale-x-100 transition duration-300 ${
            lightingBoost ? "brightness-110 contrast-105" : ""
          }`}
        />

        {/* Mirrored AR Jewellery Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover -scale-x-100 pointer-events-none z-10"
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30 text-amber-300">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <div className="font-serif font-bold text-sm tracking-wide">
              Connecting to High-Precision AR Atelier...
            </div>
            <p className="text-xs text-stone-400">
              Initializing neural tracking & lighting calibrations
            </p>
          </div>
        )}

        {/* Tracking Guide Reticle */}
        {!isLoading && !isTracking && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-20">
            <div
              className={`rounded-full border border-dashed border-amber-400/40 animate-pulse flex items-center justify-center ${
                isHandCategory
                  ? "w-64 h-64 rounded-3xl"
                  : "w-56 h-72 sm:w-64 sm:h-80"
              }`}
            >
              <span className="text-[11px] font-serif uppercase tracking-widest text-amber-300/80 bg-stone-900/70 px-3 py-1 rounded-full backdrop-blur-sm shadow">
                {isHandCategory ? "Place hand in frame" : "Align face in frame"}
              </span>
            </div>
          </div>
        )}

        {/* Active Tracking Status Badge */}
        {!isLoading && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-700/60 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isTracking ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="text-stone-300 font-medium">
              {isTracking ? "Tracking Active" : "Detecting Landmarks..."}
            </span>
          </div>
        )}
      </div>
    );
  }
);

CameraPreview.displayName = "CameraPreview";

export default CameraPreview;
