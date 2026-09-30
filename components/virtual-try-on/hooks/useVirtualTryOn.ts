import { useState, useEffect, useRef, useCallback } from "react";
import {
  JewelleryProduct,
  TryOnTrackingResult,
  VirtualTryOnProvider,
  TryOnDiagnostics,
} from "../types";
import { ProviderFactory } from "../provider/ProviderFactory";
import { CanvasRenderer } from "../engine/CanvasRenderer";

interface UseVirtualTryOnProps {
  product: JewelleryProduct | null;
  videoElement: HTMLVideoElement | null;
  canvasElement: HTMLCanvasElement | null;
  isActive: boolean;
  userScale?: number;
  userNudgeY?: number;
  userNudgeX?: number;
}

export function useVirtualTryOn({
  product,
  videoElement,
  canvasElement,
  isActive,
  userScale = 1.0,
  userNudgeY = 0,
  userNudgeX = 0,
}: UseVirtualTryOnProps) {
  const [provider, setProvider] = useState<VirtualTryOnProvider | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [fps, setFps] = useState(0);
  const [diagnostics, setDiagnostics] = useState<TryOnDiagnostics | null>(null);
  const [trackingError, setTrackingError] = useState<string>("");

  const animFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);

  // Initialize Provider
  useEffect(() => {
    let isMounted = true;

    async function initProvider() {
      if (!isActive) return;
      setIsInitializing(true);
      setTrackingError("");

      try {
        const p = await ProviderFactory.getProvider();
        if (isMounted) {
          setProvider(p);
          setDiagnostics(ProviderFactory.getDiagnostics());
        }
      } catch (err) {
        if (isMounted) {
          setTrackingError((err as Error).message || "Failed to initialize Try-On engine");
        }
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    }

    initProvider();

    return () => {
      isMounted = false;
    };
  }, [isActive]);

  // Preload jewelry asset when product changes
  useEffect(() => {
    if (product?.tryOn?.assetUrl) {
      CanvasRenderer.preloadImage(product.tryOn.assetUrl).catch((err) => {
        console.warn("Could not preload try-on asset:", err);
      });
    }
  }, [product?.tryOn?.assetUrl]);

  // Main Tracking and Rendering Loop
  const runLoop = useCallback(async () => {
    if (
      !isRunningRef.current ||
      !provider ||
      !videoElement ||
      !canvasElement ||
      !product
    ) {
      return;
    }

    const videoWidth = videoElement.videoWidth;
    const videoHeight = videoElement.videoHeight;

    if (videoWidth > 0 && videoHeight > 0) {
      // Sync canvas internal resolution with video resolution
      if (
        canvasElement.width !== videoWidth ||
        canvasElement.height !== videoHeight
      ) {
        canvasElement.width = videoWidth;
        canvasElement.height = videoHeight;
      }

      const ctx = canvasElement.getContext("2d");
      if (ctx) {
        try {
          // Detect landmarks for this frame
          const trackingResult = await provider.detectFrame(videoElement);

          // Clear previous frame overlay
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

          if (trackingResult && trackingResult.detected) {
            setIsTracking(true);
            setFps(trackingResult.fps);

            // Render jewelry onto canvas with optional micro-adjustments
            provider.renderJewellery(
              ctx,
              product,
              trackingResult,
              canvasElement.width,
              canvasElement.height,
              {
                userScale,
                userNudgeY,
                userNudgeX,
              }
            );
          } else {
            setIsTracking(false);

            // Draw subtle luxury alignment guide if searching
            const guideType =
              product.tryOn?.category === "ring" ||
              product.tryOn?.category === "bracelet" ||
              product.tryOn?.category === "bangle"
                ? "hand"
                : "face";

            CanvasRenderer.drawAlignmentGuide(
              ctx,
              guideType,
              canvasElement.width,
              canvasElement.height
            );
          }
        } catch (err) {
          // Ignore transient detection errors in loop
        }
      }
    }

    if (isRunningRef.current) {
      animFrameRef.current = requestAnimationFrame(runLoop);
    }
  }, [provider, videoElement, canvasElement, product, userScale, userNudgeY, userNudgeX]);

  // Start / Stop the animation loop
  useEffect(() => {
    if (isActive && provider && videoElement && canvasElement && product) {
      isRunningRef.current = true;
      animFrameRef.current = requestAnimationFrame(runLoop);
    } else {
      isRunningRef.current = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      if (canvasElement) {
        const ctx = canvasElement.getContext("2d");
        ctx?.clearRect(0, 0, canvasElement.width, canvasElement.height);
      }
      setIsTracking(false);
    }

    return () => {
      isRunningRef.current = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isActive, provider, videoElement, canvasElement, product, runLoop]);

  return {
    provider,
    isInitializing,
    isTracking,
    fps,
    diagnostics,
    trackingError,
  };
}
