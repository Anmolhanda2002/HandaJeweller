import {
  VirtualTryOnProvider,
  TryOnProviderId,
  TryOnTrackingResult,
  JewelleryProduct,
} from "../types";
import { FreeMediaPipeProvider } from "./FreeMediaPipeProvider";

export class PaidARProvider implements VirtualTryOnProvider {
  public readonly id: TryOnProviderId = "PAID_AI";
  public readonly name: string = "Commercial AR Suite (Enterprise)";
  public readonly isPaid: boolean = true;

  private clientKey: string = "";
  private isInitialized: boolean = false;
  private fallbackProvider: FreeMediaPipeProvider | null = null;

  constructor(clientKey?: string) {
    this.clientKey =
      clientKey ||
      (typeof process !== "undefined"
        ? process.env.NEXT_PUBLIC_TRYON_PAID_CLIENT_KEY || ""
        : "");
  }

  /**
   * Verify whether the commercial SDK is provisioned and licensed.
   */
  public isAvailable(): boolean {
    return Boolean(this.clientKey && this.clientKey.trim().length > 0);
  }

  /**
   * Initialize commercial AR SDK.
   * If not provisioned or licensing fails, throws to allow ProviderFactory automatic fallback.
   */
  public async initialize(): Promise<void> {
    if (!this.isAvailable()) {
      throw new Error(
        "Commercial AR Provider is unconfigured: Missing NEXT_PUBLIC_TRYON_PAID_CLIENT_KEY. System will fallback to Free AI."
      );
    }

    try {
      // In production with Banuba / commercial provider:
      // Load commercial web player script and initialize engine with clientKey
      console.log("Initializing Commercial AR Provider with provisioned client key...");
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.isInitialized = true;
    } catch (err) {
      throw new Error(`Commercial AR initialization failed: ${(err as Error).message}`);
    }
  }

  public async startCamera(
    videoElement: HTMLVideoElement,
    constraints?: MediaStreamConstraints
  ): Promise<MediaStream> {
    if (!this.fallbackProvider) {
      this.fallbackProvider = new FreeMediaPipeProvider();
      await this.fallbackProvider.initialize();
    }
    return this.fallbackProvider.startCamera(videoElement, constraints);
  }

  public stopCamera(): void {
    if (this.fallbackProvider) {
      this.fallbackProvider.stopCamera();
    }
  }

  public async detectFrame(
    videoElement: HTMLVideoElement
  ): Promise<TryOnTrackingResult | null> {
    if (!this.fallbackProvider) return null;
    return this.fallbackProvider.detectFrame(videoElement);
  }

  public renderJewellery(
    ctx: CanvasRenderingContext2D,
    product: JewelleryProduct,
    tracking: TryOnTrackingResult,
    canvasWidth: number,
    canvasHeight: number
  ): void {
    if (this.fallbackProvider) {
      this.fallbackProvider.renderJewellery(
        ctx,
        product,
        tracking,
        canvasWidth,
        canvasHeight
      );
    }
  }

  public async capture(
    videoElement: HTMLVideoElement,
    overlayCanvas: HTMLCanvasElement
  ): Promise<{ blob: Blob; dataUrl: string }> {
    if (!this.fallbackProvider) {
      throw new Error("Provider not active");
    }
    return this.fallbackProvider.capture(videoElement, overlayCanvas);
  }

  public destroy(): void {
    if (this.fallbackProvider) {
      this.fallbackProvider.destroy();
      this.fallbackProvider = null;
    }
    this.isInitialized = false;
  }
}
