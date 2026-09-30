import { useState, useCallback, useRef, useEffect } from "react";

export type CameraFacingMode = "user" | "environment";
export type CameraPermissionState = "idle" | "requesting" | "granted" | "denied" | "unavailable";

export interface CameraDevice {
  deviceId: string;
  label: string;
}

export function useCamera() {
  const [permissionState, setPermissionState] = useState<CameraPermissionState>("idle");
  const [facingMode, setFacingMode] = useState<CameraFacingMode>("user");
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /**
   * Enumerate available video devices
   */
  const updateDeviceList = useCallback(async () => {
    try {
      if (!navigator?.mediaDevices?.enumerateDevices) return;
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices
        .filter((d) => d.kind === "videoinput")
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${index + 1}`,
        }));
      setDevices(videoInputs);
    } catch (err) {
      console.warn("Device enumeration failed:", err);
    }
  }, []);

  /**
   * Stop camera and release all hardware tracks cleanly.
   */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      } catch {}
      streamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.srcObject = null;
      } catch {}
    }
    setIsCameraActive(false);
  }, []);

  const facingModeRef = useRef<CameraFacingMode>(facingMode);
  facingModeRef.current = facingMode;

  const selectedDeviceIdRef = useRef<string>(selectedDeviceId);
  selectedDeviceIdRef.current = selectedDeviceId;

  /**
   * Request and start camera stream with multi-level constraint fallback.
   */
  const startCamera = useCallback(
    async (
      videoEl: HTMLVideoElement,
      targetFacingMode?: CameraFacingMode,
      targetDeviceId?: string
    ): Promise<MediaStream | null> => {
      videoRef.current = videoEl;
      setPermissionState("requesting");
      setErrorMessage("");

      const activeFacing = targetFacingMode || facingModeRef.current;
      const desiredDeviceId = targetDeviceId || selectedDeviceIdRef.current;

      // Stop any existing stream first
      stopCamera();

      if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
        setPermissionState("unavailable");
        setErrorMessage("Camera access is not supported by your browser or environment. Please use a modern browser such as Chrome, Brave, Safari, or Edge.");
        return null;
      }

      // Multi-tier constraints fallback list
      const constraintCandidates: MediaStreamConstraints[] = [
        // Tier 1: Ideal 720p/1080p with preferred facing mode or device
        desiredDeviceId
          ? {
              video: {
                deviceId: { exact: desiredDeviceId },
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
              audio: false,
            }
          : {
              video: {
                facingMode: { ideal: activeFacing },
                width: { ideal: 1280 },
                height: { ideal: 720 },
              },
              audio: false,
            },
        // Tier 2: Flexible facing mode
        {
          video: desiredDeviceId
            ? { deviceId: desiredDeviceId }
            : { facingMode: activeFacing },
          audio: false,
        },
        // Tier 3: Bare minimum video request (any available camera)
        {
          video: true,
          audio: false,
        },
      ];

      let stream: MediaStream | null = null;
      let lastError: Error | null = null;

      for (const constraints of constraintCandidates) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (stream) break;
        } catch (err: unknown) {
          lastError = err as Error;
          // Continue to next tier fallback unless permission was explicitly denied
          if (
            (err as Error).name === "NotAllowedError" ||
            (err as Error).name === "PermissionDeniedError"
          ) {
            break;
          }
        }
      }

      if (!stream) {
        const error = lastError || new Error("Unable to access camera device");
        console.warn("Camera start failed across candidate constraints:", error);

        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          setPermissionState("denied");
          setErrorMessage(
            "Camera permission was denied. Please allow camera access in your browser settings (look for the lock, camera, or shield icon in your URL address bar) and click Retry Connection."
          );
        } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
          setPermissionState("unavailable");
          setErrorMessage("No video camera sensor was detected on this device. Please connect a webcam.");
        } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
          setPermissionState("unavailable");
          setErrorMessage("Camera is currently in use by another application (e.g. Zoom, Teams, or another browser tab). Please close other apps and try again.");
        } else {
          setPermissionState("unavailable");
          setErrorMessage(error.message || "Failed to start camera video feed.");
        }

        setIsCameraActive(false);
        return null;
      }

      streamRef.current = stream;
      videoEl.muted = true;
      videoEl.playsInline = true;
      videoEl.setAttribute("playsinline", "true");
      videoEl.setAttribute("muted", "true");
      videoEl.setAttribute("autoplay", "true");
      videoEl.srcObject = stream;

      // Bind play action safely
      try {
        await videoEl.play();
      } catch (playErr) {
        console.warn("Direct video play was prevented, waiting for loadeddata/canplay:", playErr);
        // Fallback: wait for metadata / loadeddata / canplay
        await new Promise<void>((resolve) => {
          const onLoaded = () => {
            videoEl.removeEventListener("loadeddata", onLoaded);
            videoEl.removeEventListener("canplay", onLoaded);
            videoEl.play().catch(() => {}).finally(() => resolve());
          };
          videoEl.addEventListener("loadeddata", onLoaded);
          videoEl.addEventListener("canplay", onLoaded);
          // Safety timeout
          setTimeout(resolve, 1500);
        });
      }

      setPermissionState("granted");
      setIsCameraActive(true);
      setFacingMode(activeFacing);

      // Query devices after permission is granted so device labels are available
      updateDeviceList();

      return stream;
    },
    [stopCamera, updateDeviceList]
  );

  /**
   * Flip camera between front (user) and rear (environment).
   */
  const toggleFacingMode = useCallback(async () => {
    if (!videoRef.current) return;
    const newMode: CameraFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    await startCamera(videoRef.current, newMode);
  }, [facingMode, startCamera]);

  /**
   * Select a specific camera device ID.
   */
  const selectDevice = useCallback(
    async (deviceId: string) => {
      setSelectedDeviceId(deviceId);
      if (videoRef.current) {
        await startCamera(videoRef.current, facingMode, deviceId);
      }
    },
    [facingMode, startCamera]
  );

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    permissionState,
    facingMode,
    isCameraActive,
    errorMessage,
    devices,
    selectedDeviceId,
    startCamera,
    stopCamera,
    toggleFacingMode,
    selectDevice,
    stream: streamRef.current,
  };
}

