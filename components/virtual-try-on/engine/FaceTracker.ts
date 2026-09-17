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
    // Subject's RIGHT ear (screen left): tragus 234, earlobe 132 or 93
    const rightTragus = landmarks[234];
    const rightEarlobe = landmarks[132] || landmarks[93] || rightTragus;

    // Subject's LEFT ear (screen right): tragus 454, earlobe 361 or 323
    const leftTragus = landmarks[454];
    const leftEarlobe = landmarks[361] || landmarks[323] || leftTragus;

    // Nose & Chin
    const noseTip = landmarks[1];
    const noseBase = landmarks[2] || landmarks[94] || noseTip;
    const chin = landmarks[152];
    const foreheadTop = landmarks[10];

    // Compute Head Pose Angles:
    // Roll: Rotation in 2D image plane.
    // Direction vector from right eye (screen left) to left eye (screen right):
    const deltaX = leftEyeOuter.x - rightEyeOuter.x;
    const deltaY = leftEyeOuter.y - rightEyeOuter.y;
    // When level, deltaX > 0 and deltaY ≈ 0, so roll ≈ 0 radians
    const roll = Math.atan2(deltaY, deltaX);

    // Yaw: Left-Right turn
    // Compare nose horizontal distance relative to face edges
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
    const faceHeight = Math.hypot(chin.x - foreheadTop.x, chin.y - foreheadTop.y);

    // Ear visibility and positioning
    // Project earlobes slightly outward and downward along head orientation
    const earOffsetY = faceHeight * 0.09;
    const earOffsetX = faceWidth * 0.05;

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

    // Neck & Collarbone Projection
    // Lower chin extends into throat and clavicle base along torso axis
    const neckDownwardOffset = faceHeight * 0.38;
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
      forehead: landmarks[151] || landmarks[10] || foreheadTop,
      headPose: { roll, yaw, pitch },
      faceWidth,
      faceHeight,
    };
  }
}

