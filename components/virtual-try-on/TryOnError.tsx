"use client";

import React from "react";
import {
  CameraOff,
  AlertCircle,
  ShieldAlert,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { CameraPermissionState } from "./hooks/useCamera";

interface TryOnErrorProps {
  permissionState: CameraPermissionState;
  errorMessage?: string;
  onRetry: () => void;
  onClose: () => void;
}

export default function TryOnError({
  permissionState,
  errorMessage,
  onRetry,
  onClose,
}: TryOnErrorProps) {
  const isDenied = permissionState === "denied";

  return (
    <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-8 max-w-md mx-auto text-center space-y-4 shadow-2xl backdrop-blur-md">
      <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
        {isDenied ? <ShieldAlert className="w-8 h-8" /> : <CameraOff className="w-8 h-8" />}
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-serif font-bold text-stone-100">
          {isDenied ? "Camera Permission Required" : "Camera Feed Unavailable"}
        </h3>
        <p className="text-xs text-stone-400 leading-relaxed">
          {errorMessage ||
            (isDenied
              ? "To try on jewelry virtually in real-time, please allow camera permissions in your browser address bar or device settings."
              : "We could not access a compatible webcam or mobile camera sensor.")}
        </p>
      </div>

      {isDenied && (
        <div className="bg-stone-950 p-4 rounded-xl text-left text-xs text-stone-400 space-y-2 border border-stone-800">
          <div className="font-semibold text-amber-400">Quick Fix:</div>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Click the lock or camera icon in your browser URL bar.</li>
            <li>Change Camera permission from &ldquo;Block&rdquo; to &ldquo;Allow&rdquo;.</li>
            <li>Refresh or click &ldquo;Retry Connection&rdquo; below.</li>
          </ol>
        </div>
      )}

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif text-xs font-bold uppercase tracking-wider transition shadow-md shadow-amber-900/40"
        >
          <RotateCcw className="w-4 h-4" />
          Retry Connection
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl border border-stone-800 text-xs font-medium text-stone-400 hover:text-stone-200 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
