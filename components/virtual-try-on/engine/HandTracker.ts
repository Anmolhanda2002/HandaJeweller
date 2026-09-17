import { NormalizedLandmark, HandTrackingData } from "../types";

export class HandTracker {
  /**
   * Process raw MediaPipe hand landmarks (21 points) into jewelry-ready finger & wrist anchors.
   */
  static processHandLandmarks(
    landmarks: NormalizedLandmark[],
    handedness: "Left" | "Right" = "Right"
  ): HandTrackingData {
    if (!landmarks || landmarks.length < 21) {
      throw new Error("Invalid hand landmark count");
    }

    // Key Landmark Indices
    const wrist = landmarks[0];
    const thumbCMC = landmarks[1];
    const indexMCP = landmarks[5];
    const middleMCP = landmarks[9];
    const ringMCP = landmarks[13]; // Ring finger base
    const ringPIP = landmarks[14]; // Ring finger first knuckle
    const ringDIP = landmarks[15]; // Ring finger second knuckle
    const ringTip = landmarks[16];
    const pinkyMCP = landmarks[17];

    // Compute Ring Finger Angle & Positioning
    // Ring sits between MCP (13) and PIP (14)
    const fingerDeltaX = ringPIP.x - ringMCP.x;
    const fingerDeltaY = ringPIP.y - ringMCP.y;
    const fingerAngle = Math.atan2(fingerDeltaY, fingerDeltaX);

    // Finger thickness estimated from MCP gap
    const fingerWidth = Math.hypot(ringMCP.x - middleMCP.x, ringMCP.y - middleMCP.y) * 0.95;

    // Ring Center Anchor (midway between MCP and PIP)
    const ringCenter: NormalizedLandmark = {
      x: ringMCP.x + fingerDeltaX * 0.45,
      y: ringMCP.y + fingerDeltaY * 0.45,
      z: ((ringMCP.z || 0) + (ringPIP.z || 0)) / 2,
    };

    // Wrist Angle and Radius for Bangles/Bracelets
    // Vector from wrist (0) to middle finger base (9)
    const handAxisX = middleMCP.x - wrist.x;
    const handAxisY = middleMCP.y - wrist.y;
    const wristAngle = Math.atan2(handAxisY, handAxisX);

    // Wrist thickness from thumb base to pinky base
    const wristSpan = Math.hypot(pinkyMCP.x - thumbCMC.x, pinkyMCP.y - thumbCMC.y);
    const wristRadius = Math.max(0.04, wristSpan * 0.7);

    return {
      handedness,
      wrist,
      ringFingerBase: ringCenter,
      ringFingerPIP: ringPIP,
      ringFingerDIP: ringDIP,
      ringFingerTip: ringTip,
      middleFingerBase: middleMCP,
      indexFingerBase: indexMCP,
      fingerAngle,
      fingerWidth: Math.max(0.02, fingerWidth),
      wristAngle,
      wristRadius,
    };
  }
}
