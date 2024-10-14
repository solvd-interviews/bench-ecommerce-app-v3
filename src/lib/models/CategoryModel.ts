import mongoose from "mongoose";
import { logicRules } from "../logic";
import CounterModel from "./CounterModel";

const {
  name: { minName, maxName },
  description: { minDesc, maxDesc },
} = logicRules.category;

const category = new mongoose.Schema<Category>(
  {
    name: {
      type: String,
      required: true,
      minlength: minName,
      maxlength: maxName,
    },
    description: {
      type: String,
      required: true,
      minlength: minDesc,
      maxlength: maxDesc,
    },
    color: {
      type: String,
      required: true,
    },
    categoryNumber: { type: Number, unique: true }, // Add this field
  },
  {
    timestamps: true,
  }
);

category.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: "categoryNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.categoryNumber = counter.seq;
  }
  next();
});

const CategoryModel =
  mongoose.models.Category || mongoose.model("Category", category);

export type Category = {
  _id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  categoryNumber: number;
};

export default CategoryModel;
