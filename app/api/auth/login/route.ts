import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/models/User";
import { signToken } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return apiError("Email and password are required", 400);
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return apiError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      return apiError("This account has been deactivated. Please contact support.", 403);
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return apiError("Invalid email or password", 401);
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const userObj = user.toObject();
    delete userObj.password;

    const response = apiSuccess(
      { user: userObj, token },
      "Logged in successfully",
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
    console.error("Login error:", err);
    return apiError(err.message || "Failed to login", 500);
  }
}
