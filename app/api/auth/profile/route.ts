import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";
import User from "@/lib/models/User";

export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiError("Unauthorized", 401);
    }

    const body = await req.json();
    const { name, phone, addresses } = body;

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (addresses && Array.isArray(addresses)) {
      user.addresses = addresses;
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    return apiSuccess({ user: userObj }, "Profile updated successfully");
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Failed to update profile", 500);
  }
}
