import { config } from "@/lib/auth";
import { sampleData } from "@/lib/data";
import dbConnect from "@/lib/dbConnect";
import CounterModel from "@/lib/models/CounterModel";
import OrderModel from "@/lib/models/OrderModel";
import ProductModel from "@/lib/models/ProductModel";
import UserModel from "@/lib/models/UserModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { user } = await getServerSession(config);

  if (!user || !user.isAdmin) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }

  const { users, products } = sampleData;
  await dbConnect();

  await UserModel.deleteMany();
  await ProductModel.deleteMany();
  await CounterModel.deleteMany();
  await OrderModel.deleteMany();

  // Save users with incremental userNumber sequentially
  for (const user of users) {
    const newUser = new UserModel(user);
    await newUser.save();
    await new Promise((res, rej) => {
      setTimeout(() => {
        res("");
      }, 10);
    });
  }

  // Save products with incremental productNumber sequentially
  for (const product of products) {
    const newProduct = new ProductModel(product);
    await newProduct.save();
    await new Promise((res, rej) => {
      setTimeout(() => {
        res("");
      }, 10);
    });
  }

  // Retrieve the saved documents
  const savedUsers = await UserModel.find();
  const savedProducts = await ProductModel.find();

  return NextResponse.json({
    message: "Generated successfully!",
    users: savedUsers,
    products: savedProducts,
  });
};
