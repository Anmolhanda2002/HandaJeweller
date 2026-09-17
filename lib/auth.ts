import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import connectToDatabase from "./db/connect";
import User, { IUser } from "./models/User";

const JWT_SECRET = process.env.JWT_SECRET || "handa_jeweller_customer_jwt_secret_key_change_in_production";

export interface JwtUserPayload {
  userId: string;
  email: string;
  role: string;
}

export function signToken(payload: JwtUserPayload, expiresIn = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtUserPayload;
  } catch {
    return null;
  }
}

export async function getUserFromRequest(req: NextRequest): Promise<IUser | null> {
  try {
    const tokenFromCookie = req.cookies.get("token")?.value;
    const authHeader = req.headers.get("authorization");
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const token = tokenFromCookie || tokenFromHeader;
    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

    await connectToDatabase();
    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isActive) return null;

    return user;
  } catch (err) {
    console.error("getUserFromRequest error:", err);
    return null;
  }
}
