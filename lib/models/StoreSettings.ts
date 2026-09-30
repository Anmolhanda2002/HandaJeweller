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
  goldRate24k: number;
  goldRate22k: number;
  goldRate18k: number;
  silverRate: number;
  ratesLastUpdated?: Date;
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
    contactEmail: { type: String, default: "handaanmol073@gmail.com" },
    phone: { type: String, default: "+91 77175 95732" },
    address: {
      type: String,
      default: "Datarpur, Talwara Main Market, Punjab",
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
    goldRate24k: { type: Number, default: 7680 },
    goldRate22k: { type: Number, default: 7040 },
    goldRate18k: { type: Number, default: 5760 },
    silverRate: { type: Number, default: 93 },
    ratesLastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const StoreSettings: Model<IStoreSettings> =
  mongoose.models.StoreSettings ||
  mongoose.model<IStoreSettings>("StoreSettings", StoreSettingsSchema);

export default StoreSettings;
