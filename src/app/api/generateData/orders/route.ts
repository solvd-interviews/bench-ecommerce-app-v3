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

  await dbConnect();

  await OrderModel.deleteMany();

  return NextResponse.json({
    message: "Orders were deleted successfully!",
  });
};
