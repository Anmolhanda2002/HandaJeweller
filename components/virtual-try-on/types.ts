export type TryOnCategory =
  | "earring"
  | "necklace"
  | "pendant"
  | "ring"
  | "bracelet"
  | "bangle"
  | "nose"
  | "maang-tikka";

export type TryOnProviderId = "FREE_AI" | "PAID_AI" | "BANUBA" | "CUSTOM";

export interface NormalizedLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface HeadPose {
  yaw: number; // Left-Right rotation (-45 to 45 deg)
  pitch: number; // Up-Down tilt (-30 to 30 deg)
  roll: number; // Ear-to-shoulder tilt (-45 to 45 deg)
}

export interface EarPositions {
  leftEar: NormalizedLandmark; // Tragus / earlobe
  rightEar: NormalizedLandmark;
  earDistance: number;
  leftVisible: boolean;
  rightVisible: boolean;
}

export interface NeckPositions {
  chin: NormalizedLandmark;
  neckCenter: NormalizedLandmark;
  leftShoulder?: NormalizedLandmark;
  rightShoulder?: NormalizedLandmark;
  neckWidth: number;
  chestTilt: number;
}

export interface HandTrackingData {
  handedness: "Left" | "Right";
  wrist: NormalizedLandmark;
  ringFingerBase: NormalizedLandmark;
  ringFingerPIP: NormalizedLandmark;
  ringFingerDIP: NormalizedLandmark;
  ringFingerTip: NormalizedLandmark;
  middleFingerBase: NormalizedLandmark;
  indexFingerBase: NormalizedLandmark;
  fingerAngle: number;
  fingerWidth: number;
  wristAngle: number;
  wristRadius: number;
}

export interface TryOnTrackingResult {
  detected: boolean;
  type: "face" | "hand" | "none";
  face?: {
    ears: EarPositions;
    neck: NeckPositions;
    nose: NormalizedLandmark;
    forehead: NormalizedLandmark;
    hairline?: NormalizedLandmark;
    glabella?: NormalizedLandmark;
    nostril?: NormalizedLandmark;
    headPose: HeadPose;
    faceWidth: number;
    faceHeight: number;
  };
  hands?: HandTrackingData[];
  confidence: number;
  timestamp: number;
  fps: number;
}

export interface JewelleryProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category?: { name: string; slug: string } | string;
  tryOnEnabled?: boolean;
  tryOn?: {
    type: "2d" | "3d";
    category: TryOnCategory;
    assetUrl?: string; // Transparent PNG / WebP overlay
    modelUrl?: string; // Future 3D GLB/GLTF model
    anchor?: string;
    scale?: number;
    offsetX?: number;
    offsetY?: number;
    rotation?: number;
    opacity?: number;
  };
  variants?: { name: string; options: string[] }[];
}

export interface TryOnDiagnostics {
  providerId: TryOnProviderId;
  providerName: string;
  isFallback: boolean;
  isHardwareAccelerated: boolean;
  fps: number;
  cameraResolution: { width: number; height: number };
  detectedFeature: string;
  confidenceScore: number;
}

export interface VirtualTryOnProvider {
  readonly id: TryOnProviderId;
  readonly name: string;
  readonly isPaid: boolean;

  initialize(): Promise<void>;
  startCamera(
    videoElement: HTMLVideoElement,
    constraints?: MediaStreamConstraints
  ): Promise<MediaStream>;
  stopCamera(): void;
  detectFrame(videoElement: HTMLVideoElement): Promise<TryOnTrackingResult | null>;
  renderJewellery(
    ctx: CanvasRenderingContext2D,
    product: JewelleryProduct,
    tracking: TryOnTrackingResult,
    canvasWidth: number,
    canvasHeight: number,
    options?: {
      isMirrored?: boolean;
      userScale?: number;
      userNudgeX?: number;
      userNudgeY?: number;
    }
  ): void;
  capture(
    videoElement: HTMLVideoElement,
    overlayCanvas: HTMLCanvasElement
  ): Promise<{ blob: Blob; dataUrl: string }>;
  destroy(): void;
}
