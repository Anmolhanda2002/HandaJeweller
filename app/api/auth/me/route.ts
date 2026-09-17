import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return apiError("Not authenticated", 401);
    }

    return apiSuccess({ user }, "User authenticated");
  } catch (error: unknown) {
    const err = error as Error;
    return apiError(err.message || "Authentication check failed", 500);
  }
}
