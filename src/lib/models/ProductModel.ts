import mongoose from "mongoose";
import CounterModel from "./CounterModel";
import { deleteImage, getPublicIdFromUrl } from "../utils/cloudinary";
import { logicRules } from "../logic";

const {
  name: { minName, maxName },
  description: { minDesc, maxDesc },
  stock: { minStock, maxStock },
  price: { minPrice, maxPrice },
  images: { minImg, maxImg },
} = logicRules.product;

const productSchema = new mongoose.Schema<Product>(
  {
    name: {
      type: String,
      required: true,
      minlength: minName,
      maxlength: maxName,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: function (v: string[]) {
          return v.length >= minImg && v.length <= maxImg;
        },
        message: `Images must be between ${minImg} and ${maxImg} in length.`,
      },
    },
    price: { type: Number, required: true, min: minPrice, max: maxPrice },
    description: {
      type: String,
      required: true,
      minlength: minDesc,
      maxlength: maxDesc,
    },
    isBlocked: { type: Boolean, required: true, default: false },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: minStock,
      max: maxStock,
    },
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
