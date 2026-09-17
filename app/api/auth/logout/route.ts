import { NextResponse } from "next/server";
import { apiSuccess } from "@/lib/utils";

export async function POST() {
  const response = apiSuccess(null, "Logged out successfully");
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
