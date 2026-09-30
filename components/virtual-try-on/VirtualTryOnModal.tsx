"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Sparkles, Video, ShieldCheck } from "lucide-react";
import { JewelleryProduct, TryOnCategory } from "./types";
import { useCamera } from "./hooks/useCamera";
import { useVirtualTryOn } from "./hooks/useVirtualTryOn";
import { useTryOnCapture } from "./hooks/useTryOnCapture";
import CameraPreview from "./CameraPreview";
import CameraControls from "./CameraControls";
import JewellerySelector from "./JewellerySelector";
import CapturePreview from "./CapturePreview";
import TryOnError from "./TryOnError";
import TryOnDebugPanel from "./TryOnDebugPanel";
import { tryOnConfig } from "./config";

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct: JewelleryProduct | null;
}

export default function VirtualTryOnModal({
  isOpen,
  onClose,
  initialProduct,
}: VirtualTryOnModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<JewelleryProduct | null>(initialProduct);
  const [catalogProducts, setCatalogProducts] = useState<JewelleryProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<TryOnCategory>(
    initialProduct?.tryOn?.category || "earring"
  );
  const [lightingBoost, setLightingBoost] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [userScale, setUserScale] = useState(1.0);
  const [userNudgeY, setUserNudgeY] = useState(0);

  const handleChangeScale = (delta: number) => {
    setUserScale((prev) => Math.max(0.4, Math.min(2.0, +(prev + delta).toFixed(2))));
  };

  const handleChangeNudgeY = (delta: number) => {
    setUserNudgeY((prev) => prev + delta);
  };

  const handleResetAdjustments = () => {
    setUserScale(1.0);
    setUserNudgeY(0);
  };

  // Video and Canvas DOM node references
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    setVideoElement(node);
  }, []);

  const setCanvasRef = useCallback((node: HTMLCanvasElement | null) => {
    canvasRef.current = node;
    setCanvasElement(node);
  }, []);

  // 1. Camera Hook
  const {
    permissionState,
    facingMode,
    isCameraActive,
    errorMessage,
    startCamera,
    stopCamera,
    toggleFacingMode,
  } = useCamera();

  // 2. Tracking Hook
  const {
    provider,
    isInitializing,
    isTracking,
    fps,
    diagnostics,
    trackingError,
  } = useVirtualTryOn({
    product: selectedProduct,
    videoElement: videoElement,
    canvasElement: canvasElement,
    isActive: isCameraActive,
    userScale,
    userNudgeY,
  });

  // 3. Capture Hook
  const {
    capturedPhoto,
    isCapturing,
    capturePhoto,
    downloadPhoto,
    sharePhoto,
    clearPhoto,
  } = useTryOnCapture();

  // Update selected product if initialProduct changes
  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct);
      if (initialProduct.tryOn?.category) {
        setSelectedCategory(initialProduct.tryOn.category);
      }
    }
  }, [initialProduct]);

  // Fetch all try-on enabled products from store catalog
  useEffect(() => {
    if (!isOpen) return;

    async function fetchTryOnProducts() {
      try {
        const res = await fetch("/api/products?limit=50");
        const json = await res.json();
        if (json.success && Array.isArray(json.data.products)) {
          // Filter products that have tryOnEnabled or assign default try-on
          const tryOnItems: JewelleryProduct[] = json.data.products
            .filter((p: any) => p.tryOnEnabled || p.tryOn?.assetUrl)
            .map((p: any) => ({
              _id: p._id,
              name: p.name,
              slug: p.slug,
              price: p.price,
              compareAtPrice: p.compareAtPrice,
              images: p.images || [],
              category: p.category,
              tryOnEnabled: p.tryOnEnabled,
              tryOn: p.tryOn,
            }));

          // If initialProduct not already in list, prepend
          if (initialProduct && !tryOnItems.some((it) => it._id === initialProduct._id)) {
            tryOnItems.unshift(initialProduct);
          }

          setCatalogProducts(tryOnItems);
        }
      } catch (err) {
        console.warn("Could not fetch try-on catalog products:", err);
      }
    }

    fetchTryOnProducts();
  }, [isOpen, initialProduct]);

  // Auto-start camera as soon as modal opens and video node is mounted
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    if (
      videoElement &&
      !isCameraActive &&
      permissionState !== "requesting" &&
      permissionState !== "denied" &&
      permissionState !== "unavailable"
    ) {
      startCamera(videoElement);
    }
  }, [isOpen, videoElement, isCameraActive, permissionState, startCamera, stopCamera]);

  // Explicit Retry Handler
  const handleRetryCamera = async () => {
    const target = videoElement || videoRef.current;
    if (target) {
      await startCamera(target);
    }
  };

  // Close and cleanup
  const handleClose = () => {
    stopCamera();
    clearPhoto();
    onClose();
  };

  // Handle Capture Action
  const handleTakeSnapshot = async () => {
    const targetVideo = videoElement || videoRef.current;
    const targetCanvas = canvasElement || canvasRef.current;
    if (!targetVideo || !targetCanvas || !selectedProduct) return;
    await capturePhoto(provider, targetVideo, targetCanvas, selectedProduct);
  };

  // Filter products matching current category
  const filteredProducts = catalogProducts.filter(
    (p) => (p.tryOn?.category || "earring") === selectedCategory
  );

  if (!isOpen) return null;

  const hasPermissionError = permissionState === "denied" || permissionState === "unavailable";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-950 border border-amber-600/30 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[96vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-bold shadow-md shadow-amber-900/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-lg text-stone-100 tracking-tight">
                  Handa Jeweller Virtual Atelier
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {diagnostics?.isFallback ? "Free AI (Fallback)" : "Free AI AR"}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Experience royal heirloom jewelry calibrated to your natural movement
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-900 transition"
            title="Close Virtual Atelier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Captured Portrait View */}
        {capturedPhoto && selectedProduct ? (
          <CapturePreview
            photo={capturedPhoto}
            product={selectedProduct}
            onRetake={clearPhoto}
            onDownload={() => downloadPhoto(`Handa-${selectedProduct.slug}`)}
            onShare={sharePhoto}
          />
        ) : (
          /* Live Virtual Try-On Workspace */
          <div className="space-y-4">
            {/* Viewport Box */}
            <div className="relative">
              <CameraPreview
                videoRef={setVideoRef}
                canvasRef={setCanvasRef}
                isLoading={isInitializing}
                isTracking={isTracking}
                isCameraActive={isCameraActive}
                lightingBoost={lightingBoost}
                category={selectedProduct?.tryOn?.category}
              />

              {/* Error Overlay on top of preview when permission denied/unavailable */}
              {hasPermissionError && (
                <div className="absolute inset-0 z-30 bg-stone-950/95 backdrop-blur-md rounded-2xl flex items-center justify-center p-4">
                  <TryOnError
                    permissionState={permissionState}
                    errorMessage={errorMessage || trackingError}
                    onRetry={handleRetryCamera}
                    onClose={handleClose}
                  />
                </div>
              )}

              {/* Development HUD Overlay */}
              {showDebug && (
                <div className="absolute top-4 right-4 z-30">
                  <TryOnDebugPanel
                    diagnostics={diagnostics}
                    fps={fps}
                    isTracking={isTracking}
                    productName={selectedProduct?.name}
                  />
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <CameraControls
              onCapture={handleTakeSnapshot}
              onFlipCamera={toggleFacingMode}
              lightingBoost={lightingBoost}
              onToggleLighting={() => setLightingBoost(!lightingBoost)}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setUserNudgeY(0);
                // Auto select first piece in category if available
                const match = catalogProducts.find((p) => p.tryOn?.category === cat);
                if (match) setSelectedProduct(match);
              }}
              isCapturing={isCapturing}
              showDebugToggle={tryOnConfig.debugMode}
              onToggleDebug={() => setShowDebug(!showDebug)}
              userScale={userScale}
              onChangeScale={handleChangeScale}
              userNudgeY={userNudgeY}
              onChangeNudgeY={handleChangeNudgeY}
              onResetAdjustments={handleResetAdjustments}
            />

            {/* Product Switcher Carousel */}
            <JewellerySelector
              products={filteredProducts.length > 0 ? filteredProducts : catalogProducts}
              selectedProduct={selectedProduct}
              onSelectProduct={(prod) => {
                setSelectedProduct(prod);
                if (prod.tryOn?.category) {
                  setSelectedCategory(prod.tryOn.category);
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
