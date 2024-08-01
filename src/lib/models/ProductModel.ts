import mongoose from "mongoose";
import CounterModel from "./CounterModel";
import { deleteImage, getPublicIdFromUrl } from "../utils/cloudinary";

const productSchema = new mongoose.Schema<Product>(
  {
    name: { type: String, required: true },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    isBlocked: { type: Boolean, required: true, default: false },
    stock: { type: Number, required: true, default: 0 },
    productNumber: { type: Number, unique: true }, // Add this field
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: "productNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.productNumber = counter.seq;
  }
  next();
});

productSchema.pre("findOneAndDelete", async function (next) {
  let promisesDelete: Promise<{ ok: boolean }>[] = [];

  const product = await this.model.findOne(this.getQuery());

  if (product && product.images && product.images.length > 0) {
    product.images.forEach((e: string) => {
      promisesDelete.push(deleteImage(getPublicIdFromUrl(e)));
    });
    try {
      const res = await Promise.all(promisesDelete);
      next();
    } catch (error) {
      console.error("Error deleting images from Cloudinary:", error);
    }
  }
});

const ProductModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default ProductModel;

export type Product = {
  id?: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  isBlocked: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
  productNumber: number; // Add this field
};
