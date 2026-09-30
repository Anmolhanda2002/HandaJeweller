import { JewelleryProduct, TryOnTrackingResult } from "../types";

export class CanvasRenderer {
  private static imageCache: Map<string, HTMLImageElement> = new Map();
  private static loadingPromises: Map<string, Promise<HTMLImageElement>> = new Map();

  /**
   * Preload and cache a transparent jewelry asset image.
   */
  public static async preloadImage(url: string): Promise<HTMLImageElement> {
    if (!url) throw new Error("Image URL is empty");
    if (this.imageCache.has(url)) {
      return this.imageCache.get(url)!;
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url)!;
    }

    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        this.imageCache.set(url, img);
        this.loadingPromises.delete(url);
        resolve(img);
      };
      img.onerror = (err) => {
        this.loadingPromises.delete(url);
        reject(err);
      };
      img.src = url;
    });

    this.loadingPromises.set(url, loadPromise);
    return loadPromise;
  }

  /**
   * Main render dispatch for jewelry overlay on canvas.
   */
  public static render(
    ctx: CanvasRenderingContext2D,
    product: JewelleryProduct,
    tracking: TryOnTrackingResult,
    width: number,
    height: number,
    options: {
      isMirrored?: boolean;
      userScale?: number;
      userNudgeX?: number;
      userNudgeY?: number;
    } = {}
  ): void {
    if (!product.tryOn?.assetUrl || !tracking.detected) return;

    const img = this.imageCache.get(product.tryOn.assetUrl);
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Trigger lazy cache load if not loaded yet
      this.preloadImage(product.tryOn.assetUrl).catch(() => {});
      return;
    }

    const isMirrored = options.isMirrored ?? true;
    const userScale = options.userScale ?? 1.0;
    const userNudgeX = options.userNudgeX ?? 0;
    const userNudgeY = options.userNudgeY ?? 0;

    const category = product.tryOn.category;
    const baseScale = (product.tryOn.scale ?? 1.0) * userScale;
    const customOffsetX = (product.tryOn.offsetX ?? 0) + userNudgeX;
    const customOffsetY = (product.tryOn.offsetY ?? 0) + userNudgeY;
    const customRotation = ((product.tryOn.rotation ?? 0) * Math.PI) / 180;
    const customOpacity = product.tryOn.opacity ?? 1.0;

    ctx.save();
    ctx.globalAlpha = customOpacity;

    switch (category) {
      case "earring":
        this.renderEarrings(
          ctx,
          img,
          tracking,
          width,
          height,
          baseScale,
          customOffsetX,
          customOffsetY,
          customRotation,
          isMirrored
        );
        break;
      case "necklace":
      case "pendant":
        this.renderNecklace(
          ctx,
          img,
          tracking,
          width,
          height,
          baseScale,
          customOffsetX,
          customOffsetY,
          customRotation,
          isMirrored
        );
        break;
      case "ring":
        this.renderRing(
          ctx,
          img,
          tracking,
          width,
          height,
          baseScale,
          customOffsetX,
          customOffsetY,
          customRotation,
          isMirrored
        );
        break;
      case "bracelet":
      case "bangle":
        this.renderBracelet(
          ctx,
          img,
          tracking,
          width,
          height,
          baseScale,
          customOffsetX,
          customOffsetY,
          customRotation,
          isMirrored
        );
        break;
      case "nose":
        this.renderNoseJewel(
          ctx,
          img,
          tracking,
          width,
          height,
          baseScale,
          customOffsetX,
          customOffsetY,
          customRotation,
          isMirrored
        );
        break;
      case "maang-tikka":
        this.renderMaangTikka(
          ctx,
          img,
          tracking,
          width,
          height,
          baseScale,
          customOffsetX,
          customOffsetY,
          customRotation,
          isMirrored
        );
        break;
    }

    ctx.restore();
  }

  /**
   * Render Earrings (Both Left & Right ears with individual yaw visibility and roll angle)
   */
  private static renderEarrings(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    tracking: TryOnTrackingResult,
    width: number,
    height: number,
    scale: number,
    offsetX: number,
    offsetY: number,
    rotation: number,
    isMirrored: boolean
  ): void {
    if (!tracking.face) return;
    const { ears, headPose, faceWidth } = tracking.face;

    const aspect = img.naturalHeight / img.naturalWidth;
    const baseSize = faceWidth * width * 0.22 * scale;
    const drawWidth = baseSize;
    const drawHeight = baseSize * aspect;

    // Correct rotation direction based on mirroring
    const effectiveRoll = isMirrored ? -headPose.roll : headPose.roll;

    // Right Ear (subject's right, screen left in raw video)
    if (ears.rightVisible) {
      ctx.save();
      const rightX = ears.rightEar.x * width + offsetX;
      const rightY = ears.rightEar.y * height + offsetY;

      ctx.translate(rightX, rightY);
      ctx.rotate(effectiveRoll + rotation);
      const rightPerspective = Math.max(0.7, 1.0 - headPose.yaw * 0.22);
      ctx.scale(rightPerspective, rightPerspective);

      // In diamond-earring-tryon.svg, the stud post center is at y = 25 in a 200h SVG (12.5% down)
      // Offset by -drawHeight * 0.125 centers the stud directly on the earlobe piercing
      ctx.drawImage(img, -drawWidth / 2, -drawHeight * 0.125, drawWidth, drawHeight);
      ctx.restore();
    }

    // Left Ear (subject's left, screen right in raw video)
    if (ears.leftVisible) {
      ctx.save();
      const leftX = ears.leftEar.x * width + offsetX;
      const leftY = ears.leftEar.y * height + offsetY;

      ctx.translate(leftX, leftY);
      ctx.rotate(effectiveRoll - rotation);
      const leftPerspective = Math.max(0.7, 1.0 + headPose.yaw * 0.22);
      ctx.scale(leftPerspective, leftPerspective);

      ctx.drawImage(img, -drawWidth / 2, -drawHeight * 0.125, drawWidth, drawHeight);
      ctx.restore();
    }
  }

  /**
   * Render Necklace / Choker / Pendant across the neck and upper chest
   */
  private static renderNecklace(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    tracking: TryOnTrackingResult,
    width: number,
    height: number,
    scale: number,
    offsetX: number,
    offsetY: number,
    rotation: number,
    isMirrored: boolean
  ): void {
    if (!tracking.face) return;
    const { neck, headPose, faceWidth } = tracking.face;

    const aspect = img.naturalHeight / img.naturalWidth;
    // Necklace width proportional to face & neck width (refined fit)
    const drawWidth = faceWidth * width * 1.35 * scale;
    const drawHeight = drawWidth * aspect;

    // Anchor at the base of the throat / suprasternal notch
    const centerX = neck.neckCenter.x * width + offsetX;
    const centerY = neck.neckCenter.y * height + offsetY;

    const effectiveRoll = isMirrored ? -headPose.roll : headPose.roll;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(effectiveRoll + rotation);

    // Foreshortening when customer tilts head up/down
    const pitchScaleY = Math.max(0.75, 1.0 - Math.abs(headPose.pitch) * 0.25);
    ctx.scale(1.0, pitchScaleY);

    // The center arc dip of royal-necklace-tryon.svg is at y=150 in a 320h SVG (46.875% down)
    // Anchoring at -drawHeight * 0.47 wraps the collar band snugly around the throat base,
    // curving upward on the sides and draping the pendant gracefully over the upper clavicle.
    ctx.drawImage(img, -drawWidth / 2, -drawHeight * 0.47, drawWidth, drawHeight);
    ctx.restore();
  }

  /**
   * Render Ring on hand (ring finger proximal phalanx)
   */
  private static renderRing(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    tracking: TryOnTrackingResult,
    width: number,
    height: number,
    scale: number,
    offsetX: number,
    offsetY: number,
    rotation: number,
    isMirrored: boolean
  ): void {
    if (!tracking.hands || tracking.hands.length === 0) return;
    const hand = tracking.hands[0]; // Primary tracked hand

    const aspect = img.naturalHeight / img.naturalWidth;
    const ringSize = hand.fingerWidth * width * 1.5 * scale;
    const drawWidth = ringSize;
    const drawHeight = ringSize * aspect;

    const posX = hand.ringFingerBase.x * width + offsetX;
    const posY = hand.ringFingerBase.y * height + offsetY;

    const effectiveAngle = isMirrored ? -hand.fingerAngle : hand.fingerAngle;

    ctx.save();
    ctx.translate(posX, posY);
    // Orient ring perpendicular to finger length
    ctx.rotate(effectiveAngle + Math.PI / 2 + rotation);
    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  }

  /**
   * Render Bracelet / Bangle around the wrist
   */
  private static renderBracelet(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    tracking: TryOnTrackingResult,
    width: number,
    height: number,
    scale: number,
    offsetX: number,
    offsetY: number,
    rotation: number,
    isMirrored: boolean
  ): void {
    if (!tracking.hands || tracking.hands.length === 0) return;
    const hand = tracking.hands[0];

    const aspect = img.naturalHeight / img.naturalWidth;
    const bangleWidth = hand.wristRadius * width * 2.1 * scale;
    const bangleHeight = bangleWidth * aspect;

    const posX = hand.wrist.x * width + offsetX;
    const posY = hand.wrist.y * height + offsetY;

    const effectiveAngle = isMirrored ? -hand.wristAngle : hand.wristAngle;

    ctx.save();
    ctx.translate(posX, posY);
    ctx.rotate(effectiveAngle + Math.PI / 2 + rotation);
    ctx.drawImage(img, -bangleWidth / 2, -bangleHeight / 2, bangleWidth, bangleHeight);
    ctx.restore();
  }

  /**
   * Render Nose Pin / Nath
   */
  private static renderNoseJewel(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    tracking: TryOnTrackingResult,
    width: number,
    height: number,
    scale: number,
    offsetX: number,
    offsetY: number,
    rotation: number,
    isMirrored: boolean
  ): void {
    if (!tracking.face) return;
    const { nose, nostril, headPose, faceWidth } = tracking.face;

    const aspect = img.naturalHeight / img.naturalWidth;
    const size = faceWidth * width * 0.14 * scale;
    const drawWidth = size;
    const drawHeight = size * aspect;

    // Anchor on nostril alar if detected, otherwise nose base
    const targetAnchor = nostril || nose;
    const posX = targetAnchor.x * width + offsetX;
    const posY = targetAnchor.y * height + offsetY;

    const effectiveRoll = isMirrored ? -headPose.roll : headPose.roll;

    ctx.save();
    ctx.translate(posX, posY);
    ctx.rotate(effectiveRoll + rotation);
    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  }

  /**
   * Render Maang Tikka (Anchored at Hairline, Medallion Resting on Upper Forehead)
   */
  private static renderMaangTikka(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    tracking: TryOnTrackingResult,
    width: number,
    height: number,
    scale: number,
    offsetX: number,
    offsetY: number,
    rotation: number,
    isMirrored: boolean
  ): void {
    if (!tracking.face) return;
    const { hairline, glabella, forehead, headPose } = tracking.face;

    const topAnchor = hairline || forehead;
    const bottomAnchor = glabella || { x: topAnchor.x, y: topAnchor.y + 0.14 };

    // Measure exact forehead span from hairline (top) to glabella (eyebrows)
    const dx = (bottomAnchor.x - topAnchor.x) * width;
    const dy = (bottomAnchor.y - topAnchor.y) * height;
    const foreheadSpan = Math.hypot(dx, dy);

    const aspect = img.naturalHeight / img.naturalWidth; // SVG aspect: 350 / 200 = 1.75
    // In maang-tikka-tryon.svg, the center of the medallion is at 235 / 350 = 0.671 down the image.
    // The medallion should sit gracefully at ~70% down the forehead (well above the eyebrows).
    const targetMedallionDrop = Math.max(20, foreheadSpan * 0.70);
    const drawHeight = (targetMedallionDrop / 0.671) * scale;
    const drawWidth = drawHeight / aspect;

    const posX = topAnchor.x * width + offsetX;
    const posY = topAnchor.y * height + offsetY;

    // Align rotation along the anatomical central axis of the forehead
    const foreheadAngle = Math.atan2(dy, dx) - Math.PI / 2;
    const effectiveRoll = isMirrored ? -headPose.roll : headPose.roll;
    // Blend forehead vector angle with head roll for ultra-smooth realistic movement
    const finalAngle = foreheadAngle * 0.75 + effectiveRoll * 0.25 + rotation;

    ctx.save();
    ctx.translate(posX, posY);
    ctx.rotate(finalAngle);

    // Subtle 3D perspective if head turns left/right
    const yawScaleX = Math.max(0.8, 1.0 - Math.abs(headPose.yaw) * 0.2);
    ctx.scale(yawScaleX, 1.0);

    // Top hook starts at y = 0 at the hairline; medallion drops down onto the forehead!
    ctx.drawImage(img, -drawWidth / 2, 0, drawWidth, drawHeight);
    ctx.restore();
  }

  /**
   * Draw luxury alignment guide overlay when searching for customer face or hand.
   */
  public static drawAlignmentGuide(
    ctx: CanvasRenderingContext2D,
    type: "face" | "hand",
    width: number,
    height: number
  ): void {
    ctx.save();
    ctx.strokeStyle = "rgba(217, 119, 6, 0.4)"; // warm gold
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);

    if (type === "face") {
      // Draw centered luxury oval guide
      const centerX = width / 2;
      const centerY = height * 0.45;
      const radiusX = width * 0.22;
      const radiusY = height * 0.26;

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();

      // Corner reticles
      this.drawReticleCorners(ctx, centerX - radiusX, centerY - radiusY, radiusX * 2, radiusY * 2);
    } else {
      // Hand placement box
      const boxSize = Math.min(width, height) * 0.55;
      const boxX = (width - boxSize) / 2;
      const boxY = (height - boxSize) / 2;

      ctx.strokeRect(boxX, boxY, boxSize, boxSize);
      this.drawReticleCorners(ctx, boxX, boxY, boxSize, boxSize);
    }

    ctx.restore();
  }

  private static drawReticleCorners(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ): void {
    ctx.save();
    ctx.strokeStyle = "#996515"; // Handa Gold
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    const corner = 20;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(x, y + corner);
    ctx.lineTo(x, y);
    ctx.lineTo(x + corner, y);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(x + w - corner, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + corner);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(x, y + h - corner);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + corner, y + h);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(x + w - corner, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w, y + h - corner);
    ctx.stroke();

    ctx.restore();
  }
}
