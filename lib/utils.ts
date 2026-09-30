import { NextResponse } from "next/server";

export function formatPrice(amount: number, currency = "INR"): string {
  if (isNaN(amount) || amount === null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateInput: string | Date | undefined): string {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

// Legacy admin uploads stored relative /uploads/... URLs — those files live in
// the ADMIN app's public dir, so rewrite them to the admin origin. Absolute
// URLs (Unsplash, Cloudinary, admin) pass through unchanged.
export function getImageUrl(
  url: string | undefined | null,
  fallback = "/placeholder.png"
): string {
  if (!url) return fallback;
  if (url.startsWith("/uploads/")) {
    const adminUrl =
      process.env.NEXT_PUBLIC_ADMIN_URL?.trim() || "http://localhost:3001";
    return `${adminUrl.replace(/\/+$/, "")}${url}`;
  }
  if (url.startsWith("/")) return url;
  return url;
}

export function apiSuccess<T>(data: T, message = "Success", status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function apiError(message = "Something went wrong", status = 400, errors?: unknown) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status }
  );
}
