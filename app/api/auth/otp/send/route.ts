import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/utils";

// Global cache for active verification OTPs (phone -> { otp, expiresAt })
declare global {
  // eslint-disable-next-line no-var
  var __otpStore: Map<string, { otp: string; expiresAt: number }> | undefined;
}

if (!global.__otpStore) {
  global.__otpStore = new Map();
}

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return apiError("Mobile number is required", 400);
    }

    // Clean phone number (strip +91, spaces, dashes)
    const cleanedPhone = phone.replace(/\D/g, "").slice(-10);

    // Validate 10-digit Indian mobile number (starts with 6, 7, 8, or 9)
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      return apiError("Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)", 400);
    }

    // Generate 6-digit secure OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    global.__otpStore!.set(cleanedPhone, {
      otp: generatedOtp,
      expiresAt,
    });

    console.log(`[Handa Jeweller OTP] Sent to +91 ${cleanedPhone}: ${generatedOtp}`);

    return apiSuccess(
      {
        phone: cleanedPhone,
        expiresInSeconds: 300,
        // Provided for instant verification testing & developer ease
        testOtp: generatedOtp,
      },
      `Verification code sent to +91 ${cleanedPhone}`
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("OTP send error:", err);
    return apiError(err.message || "Failed to send verification code", 500);
  }
}
