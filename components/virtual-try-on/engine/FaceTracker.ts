import { NormalizedLandmark, EarPositions, NeckPositions, HeadPose } from "../types";

export class FaceTracker {
  /**
   * Process raw MediaPipe facial landmarks (468/478 points) into jewelry-ready anchor data.
   */
  static processLandmarks(landmarks: NormalizedLandmark[]): {
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
  } {
    if (!landmarks || landmarks.length < 468) {
      throw new Error("Invalid face landmark count");
    }

    // MediaPipe Face Mesh Landmark Topology:
    // Landmark 33: Outer corner of subject's RIGHT eye (screen left in raw video)
    // Landmark 263: Outer corner of subject's LEFT eye (screen right in raw video)
    const rightEyeOuter = landmarks[33];
    const leftEyeOuter = landmarks[263];

    const eyeCenter = {
      x: (leftEyeOuter.x + rightEyeOuter.x) / 2,
      y: (leftEyeOuter.y + rightEyeOuter.y) / 2,
      z: ((leftEyeOuter.z || 0) + (rightEyeOuter.z || 0)) / 2,
    };

    // Ears / Tragus & Lobe anchors
    // Landmark 234: right tragus, Landmark 177/132: right lobe boundary
    // Landmark 454: left tragus, Landmark 401/361: left lobe boundary
    const rightTragus = landmarks[234];
    const rightEarlobe = landmarks[177] || landmarks[132] || rightTragus;

    const leftTragus = landmarks[454];
    const leftEarlobe = landmarks[401] || landmarks[361] || leftTragus;

    // Nose & Chin & Forehead
    const noseTip = landmarks[1];
    const noseBase = landmarks[2] || landmarks[94] || noseTip;
    const chin = landmarks[152];
    const hairline = landmarks[10]; // Supreme top hairline anchor for head jewelry
    const glabella = landmarks[151] || landmarks[9]; // Between eyebrows
    const nostril = landmarks[279] || landmarks[327] || landmarks[2];

    // Compute Head Pose Angles:
    // Roll: Rotation in 2D image plane.
    // Direction vector from right eye (screen left) to left eye (screen right):
    const deltaX = leftEyeOuter.x - rightEyeOuter.x;
    const deltaY = leftEyeOuter.y - rightEyeOuter.y;
    const roll = Math.atan2(deltaY, deltaX);

    // Yaw: Left-Right turn
    const faceRightSpan = Math.abs(noseTip.x - rightTragus.x);
    const faceLeftSpan = Math.abs(leftTragus.x - noseTip.x);
    const totalSpan = faceRightSpan + faceLeftSpan;
    const yawRatio = totalSpan > 0 ? (faceLeftSpan - faceRightSpan) / totalSpan : 0;
    const yaw = yawRatio * 1.3; // -1 (turned right) to +1 (turned left)

    // Pitch: Up-Down tilt
    const eyeToNose = Math.max(0.01, noseTip.y - eyeCenter.y);
    const noseToChin = Math.max(0.01, chin.y - noseTip.y);
    const pitchRatio = (noseToChin - eyeToNose) / (noseToChin + eyeToNose);
    const pitch = pitchRatio * 0.8;

    // Face Dimensions
    const faceWidth = Math.hypot(leftTragus.x - rightTragus.x, leftTragus.y - rightTragus.y);
    const faceHeight = Math.hypot(chin.x - hairline.x, chin.y - hairline.y);

    // Ear visibility and positioning (snug at the actual earlobe piercing)
    const earOffsetY = faceHeight * 0.04;
    const earOffsetX = faceWidth * 0.035;

    const rightEarPos: NormalizedLandmark = {
      x: rightEarlobe.x - Math.cos(roll) * earOffsetX - Math.sin(roll) * earOffsetY,
      y: rightEarlobe.y - Math.sin(roll) * earOffsetX + Math.cos(roll) * earOffsetY,
      z: rightEarlobe.z,
    };

    const leftEarPos: NormalizedLandmark = {
      x: leftEarlobe.x + Math.cos(roll) * earOffsetX - Math.sin(roll) * earOffsetY,
      y: leftEarlobe.y + Math.sin(roll) * earOffsetX + Math.cos(roll) * earOffsetY,
      z: leftEarlobe.z,
    };

    const ears: EarPositions = {
      leftEar: leftEarPos,
      rightEar: rightEarPos,
      earDistance: Math.hypot(leftEarPos.x - rightEarPos.x, leftEarPos.y - rightEarPos.y),
      leftVisible: yaw > -0.65, // Remains visible unless turned sharply away
      rightVisible: yaw < 0.65,
    };

    // Neck & Collarbone Base (Throat / Suprasternal notch)
    // Sits naturally approx 0.14 - 0.16 of faceHeight below chin (landmark 152)
    const neckDownwardOffset = faceHeight * 0.15;
    const neckCenter: NormalizedLandmark = {
      x: chin.x - Math.sin(roll) * neckDownwardOffset,
      y: chin.y + Math.cos(roll) * neckDownwardOffset,
      z: (chin.z || 0) + 0.04,
    };

    const neck: NeckPositions = {
      chin,
      neckCenter,
      neckWidth: faceWidth * 0.7,
      chestTilt: pitch,
    };

    return {
      ears,
      neck,
      nose: noseBase,
      forehead: hairline,
      hairline,
      glabella,
      nostril,
      headPose: { roll, yaw, pitch },
      faceWidth,
      faceHeight,
    };
  }
}

