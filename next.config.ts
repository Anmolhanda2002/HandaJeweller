import type { NextConfig } from "next";

// Admin panel origin. Admin-uploaded images live in the SEPARATE admin app
// and are stored as absolute URLs pointing at it, so the storefront's
// next/image must whitelist that host. Falls back to localhost for dev.
const adminUrl =
  process.env.NEXT_PUBLIC_ADMIN_URL?.trim() || "http://localhost:3001";
const adminHost = new URL(adminUrl).hostname;
const adminProtocol = new URL(adminUrl).protocol.replace(":", "") as "http" | "https";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "plus.unsplash.com" },
  { protocol: "https", hostname: "res.cloudinary.com" },
  { protocol: "https", hostname: "images.pexels.com" },
  { protocol: adminProtocol, hostname: adminHost },
  { protocol: "http", hostname: "localhost" },
  { protocol: "http", hostname: "127.0.0.1" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
