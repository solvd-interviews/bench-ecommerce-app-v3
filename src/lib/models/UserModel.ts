import mongoose from "mongoose";
import CounterModel from "./CounterModel";

const UserSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    isAdmin: { type: Boolean, required: true, default: false },
    isBlocked: { type: Boolean, required: true, default: false },
    userNumber: { type: Number, unique: true },
    externalProvider: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await CounterModel.findByIdAndUpdate(
      { _id: "userNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.userNumber = counter.seq;
  }
  next();
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;

export type User = {
  _id: string;
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  isBlocked: boolean;
  userNumber: number;
  createdAt: string;
  updatedAt: string;
  externalProvider?: string;
};
