import { NextRequest } from "next/server";
import { apiError, apiSuccess } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return apiError("Phone number and OTP code are required", 400);
    }

    const cleanedPhone = phone.replace(/\D/g, "").slice(-10);
    const store = global.__otpStore;

    if (!store || !store.has(cleanedPhone)) {
      return apiError("No active verification code found for this number. Please request a new one.", 400);
    }

    const record = store.get(cleanedPhone)!;

    if (Date.now() > record.expiresAt) {
      store.delete(cleanedPhone);
      return apiError("Verification code has expired. Please request a new one.", 400);
    }

    if (record.otp !== otp.trim()) {
      return apiError("Incorrect verification code. Please check and try again.", 400);
    }

    // OTP is valid - consume it
    store.delete(cleanedPhone);

    return apiSuccess(
      {
        verified: true,
        phone: cleanedPhone,
      },
      "Mobile number verified successfully"
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("OTP verify error:", err);
    return apiError(err.message || "Failed to verify code", 500);
  }
}
