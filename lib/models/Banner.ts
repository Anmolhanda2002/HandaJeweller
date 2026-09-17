import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBanner extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaUrl: string;
  position: "hero" | "promo" | "popup";
  startDate?: Date;
  endDate?: Date;
  displayOrder: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    image: { type: String, required: true },
    ctaText: { type: String, default: "Shop Now" },
    ctaUrl: { type: String, default: "/shop" },
    position: { type: String, enum: ["hero", "promo", "popup"], default: "hero" },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active", index: true },
  },
  { timestamps: true }
);

const Banner: Model<IBanner> = mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);

export default Banner;
