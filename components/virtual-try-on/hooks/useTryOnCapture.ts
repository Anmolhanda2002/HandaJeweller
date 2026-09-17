import { useState, useCallback } from "react";
import { JewelleryProduct, VirtualTryOnProvider } from "../types";

export interface CapturedPhoto {
  blob: Blob;
  dataUrl: string;
  timestamp: Date;
  productName: string;
}

export function useTryOnCapture() {
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState<string>("");

  /**
   * Capture composite portrait frame (Camera Feed + Jewelry Overlay).
   * Automatically excludes any UI buttons or controls.
   */
  const capturePhoto = useCallback(
    async (
      provider: VirtualTryOnProvider | null,
      videoElement: HTMLVideoElement | null,
      canvasElement: HTMLCanvasElement | null,
      product: JewelleryProduct | null
    ): Promise<CapturedPhoto | null> => {
      if (!videoElement || !canvasElement || !product) {
        setCaptureError("Camera or canvas not ready for capture");
        return null;
      }

      setIsCapturing(true);
      setCaptureError("");

      try {
        let result: { blob: Blob; dataUrl: string };

        if (provider) {
          result = await provider.capture(videoElement, canvasElement);
        } else {
          // Offscreen fallback compositor
          const offscreen = document.createElement("canvas");
          offscreen.width = videoElement.videoWidth || 1280;
          offscreen.height = videoElement.videoHeight || 720;
          const ctx = offscreen.getContext("2d");
          if (!ctx) throw new Error("Could not create canvas context");

          // Mirror horizontally for natural selfie view
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(videoElement, -offscreen.width, 0, offscreen.width, offscreen.height);
          ctx.restore();

          // Overlay jewelry
          ctx.drawImage(canvasElement, 0, 0, offscreen.width, offscreen.height);

          const dataUrl = offscreen.toDataURL("image/png", 0.95);
          const blob = await new Promise<Blob>((res, rej) => {
            offscreen.toBlob((b) => (b ? res(b) : rej(new Error("Blob error"))), "image/png", 0.95);
          });
          result = { blob, dataUrl };
        }

        const photoData: CapturedPhoto = {
          blob: result.blob,
          dataUrl: result.dataUrl,
          timestamp: new Date(),
          productName: product.name,
        };

        setCapturedPhoto(photoData);
        return photoData;
      } catch (err) {
        setCaptureError((err as Error).message || "Failed to capture portrait");
        return null;
      } finally {
        setIsCapturing(false);
      }
    },
    []
  );

  /**
   * Trigger local device download of the high-res portrait.
   */
  const downloadPhoto = useCallback(
    (filenamePrefix: string = "Handa-Jeweller-TryOn") => {
      if (!capturedPhoto) return;
      const link = document.createElement("a");
      link.href = capturedPhoto.dataUrl;
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `${filenamePrefix}-${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [capturedPhoto]
  );

  /**
   * Share via Native Web Share API (mobile WhatsApp, Messages, etc.)
   */
  const sharePhoto = useCallback(async (): Promise<boolean> => {
    if (!capturedPhoto) return false;

    if (navigator.share && navigator.canShare) {
      try {
        const file = new File(
          [capturedPhoto.blob],
          `Handa-Jeweller-${capturedPhoto.productName.replace(/\s+/g, "-")}.png`,
          { type: "image/png" }
        );

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Handa Jeweller Virtual Try-On: ${capturedPhoto.productName}`,
            text: `Checking out ${capturedPhoto.productName} at Handa Jeweller!`,
            files: [file],
          });
          return true;
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.warn("Native share error:", err);
        }
      }
    }

    // Fallback: Copy Image Data URL to clipboard or open in new tab
    return false;
  }, [capturedPhoto]);

  const clearPhoto = useCallback(() => {
    setCapturedPhoto(null);
    setCaptureError("");
  }, []);

  return {
    capturedPhoto,
    isCapturing,
    captureError,
    capturePhoto,
    downloadPhoto,
    sharePhoto,
    clearPhoto,
  };
}
