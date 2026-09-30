import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/models/User";
import { signToken } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, googleId } = body;

    if (!email) {
      return apiError("Valid Google account email is required", 400);
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create new customer account via Google OAuth
      const placeholderPassword = await bcrypt.hash(`google_oauth_${Date.now()}_${googleId || Math.random()}`, 10);
      user = await User.create({
        name: name || normalizedEmail.split("@")[0],
        email: normalizedEmail,
        password: placeholderPassword,
        role: "customer",
        isActive: true,
        addresses: [],
      });
      console.log(`[Google Auth] Created new customer account for ${normalizedEmail}`);
    } else {
      if (!user.isActive) {
        return apiError("This account has been deactivated. Please contact support.", 403);
      }
    }

    // Sign customer JWT
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const userObj = user.toObject();
    delete userObj.password;

    const response = apiSuccess(
      { user: userObj, token },
      "Authenticated with Google successfully",
      200
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Google auth error:", err);
    return apiError(err.message || "Failed to authenticate with Google", 500);
  }
}
