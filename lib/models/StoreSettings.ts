import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStoreSettings extends Document {
  _id: mongoose.Types.ObjectId;
  storeName: string;
  tagline: string;
  logo: string;
  contactEmail: string;
  phone: string;
  address: string;
  currency: string;
  currencySymbol: string;
  taxRate: number;
  shippingFee: number;
  freeShippingThreshold: number;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    pinterest?: string;
    youtube?: string;
  };
  storeDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    storeName: { type: String, required: true, default: "Handa Jeweller" },
    tagline: {
      type: String,
      default: "Timeless Royal Craftsmanship & Certified Fine Jewelry",
    },
    logo: { type: String, default: "" },
    contactEmail: { type: String, default: "contact@handajeweller.com" },
    phone: { type: String, default: "+91 98765 43210" },
    address: {
      type: String,
      default: "Handa Heritage Tower, Gold Souk Mall, New Delhi, India",
    },
    currency: { type: String, default: "INR" },
    currencySymbol: { type: String, default: "₹" },
    taxRate: { type: Number, default: 3 }, // 3% GST on fine jewelry
    shippingFee: { type: Number, default: 250 },
    freeShippingThreshold: { type: Number, default: 15000 },
    socialLinks: {
      facebook: { type: String, default: "https://facebook.com" },
      instagram: { type: String, default: "https://instagram.com" },
      twitter: { type: String, default: "https://twitter.com" },
      pinterest: { type: String, default: "https://pinterest.com" },
      youtube: { type: String, default: "https://youtube.com" },
    },
    storeDescription: {
      type: String,
      default:
        "Purveyors of exquisite hallmarked gold, certified solitaires, diamond polki, and heirloom bridal jewelry since 1985.",
    },
  },
  { timestamps: true }
);

const StoreSettings: Model<IStoreSettings> =
  mongoose.models.StoreSettings ||
  mongoose.model<IStoreSettings>("StoreSettings", StoreSettingsSchema);

export default StoreSettings;
