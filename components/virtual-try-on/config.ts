import { TryOnProviderId } from "./types";

export interface VirtualTryOnConfig {
  enabled: boolean;
  provider: TryOnProviderId;
  fallbackToFree: boolean;
  allowPaidProvider: boolean;
  threeDEnabled: boolean;
  debugMode: boolean;
}

export const tryOnConfig: VirtualTryOnConfig = {
  enabled:
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_VIRTUAL_TRYON_ENABLED !== "false",

  provider:
    (typeof process !== "undefined" &&
      (process.env.NEXT_PUBLIC_TRYON_PROVIDER as TryOnProviderId)) ||
    "FREE_AI",

  fallbackToFree:
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_TRYON_FALLBACK_TO_FREE !== "false"
      : true,

  allowPaidProvider:
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_TRYON_ALLOW_PAID_PROVIDER === "true",

  threeDEnabled:
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_TRYON_3D_ENABLED === "true",

  debugMode:
    typeof process !== "undefined" &&
    process.env.NODE_ENV === "development",
};

export function isVirtualTryOnSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function" &&
    typeof window.HTMLCanvasElement !== "undefined" &&
    typeof window.requestAnimationFrame === "function"
  );
}
