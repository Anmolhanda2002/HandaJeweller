import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVariant {
  name: string; // e.g. "Metal Type" or "Ring Size"
  options: string[]; // e.g. ["18K Yellow Gold", "18K Rose Gold", "18K White Gold"]
  priceDelta?: number;
  stock?: number;
}

export interface ISpecification {
  key: string;
  value: string;
}

export interface ITryOnConfig {
  type: "2d" | "3d";
  category:
    | "earring"
    | "necklace"
    | "pendant"
    | "ring"
    | "bracelet"
    | "bangle"
    | "nose"
    | "maang-tikka";
  assetUrl?: string;
  modelUrl?: string;
  anchor?: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  rotation?: number;
  opacity?: number;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: mongoose.Types.ObjectId;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  discount: number;
  stock: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  tags: string[];
  variants: IVariant[];
  specifications: ISpecification[];
  tryOnEnabled?: boolean;
  tryOn?: ITryOnConfig;
  status: "draft" | "active" | "inactive" | "out_of_stock";
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    brand: { type: String, default: "Handa Jeweller", trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0, index: true },
    compareAtPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
    },
    tags: { type: [String], default: [] },
    variants: [
      {
        name: { type: String, required: true },
        options: { type: [String], required: true },
        priceDelta: { type: Number, default: 0 },
        stock: { type: Number, default: 0 },
      },
    ],
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    tryOnEnabled: { type: Boolean, default: false, index: true },
    tryOn: {
      type: { type: String, enum: ["2d", "3d"], default: "2d" },
      category: {
        type: String,
        enum: ["earring", "necklace", "pendant", "ring", "bracelet", "bangle", "nose", "maang-tikka"],
        default: "earring",
      },
      assetUrl: { type: String, default: "" },
      modelUrl: { type: String, default: "" },
      anchor: { type: String, default: "center" },
      scale: { type: Number, default: 1.0 },
      offsetX: { type: Number, default: 0 },
      offsetY: { type: Number, default: 0 },
      rotation: { type: Number, default: 0 },
      opacity: { type: Number, default: 1.0 },
    },
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "out_of_stock"],
      default: "active",
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
    isTrending: { type: Boolean, default: false, index: true },
    isNewArrival: { type: Boolean, default: true, index: true },
    averageRating: { type: Number, default: 5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Full text search index
ProductSchema.index({
  name: "text",
  description: "text",
  sku: "text",
  brand: "text",
  tags: "text",
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
