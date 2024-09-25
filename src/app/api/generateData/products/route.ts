import { config } from "@/lib/auth";
import { sampleData } from "@/lib/data";
import dbConnect from "@/lib/dbConnect";
import CounterModel from "@/lib/models/CounterModel";
import OrderModel from "@/lib/models/OrderModel";
import ProductModel from "@/lib/models/ProductModel";
import UserModel from "@/lib/models/UserModel";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (request: NextRequest) => {
  const { user } = await getServerSession(config);

  if (!user || !user.isAdmin) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }

  const { products } = sampleData;
  await dbConnect();

  await ProductModel.deleteMany();
  await CounterModel.findByIdAndDelete("productNumber");
  await OrderModel.deleteMany();

  // Save users with incremental userNumber sequentially

  // Save products with incremental productNumber sequentially
  for (const product of products) {
    const newProduct = new ProductModel(product);
    await newProduct.save();
    
  }

  // Retrieve the saved documents
  const savedProducts = await ProductModel.find();

  return NextResponse.json({
    message: "Products were generated successfully!",
    products: savedProducts,
  });
};
