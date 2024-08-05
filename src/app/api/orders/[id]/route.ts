import dbConnect from "@/lib/dbConnect";
import OrderModel, { OrderItem } from "@/lib/models/OrderModel";
import { getServerSession } from "next-auth";
import { config } from "@/lib/auth";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req: any, { params }: { params: { id: string } }) => {
  const { user } = await getServerSession(config);

  if (!user) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }

  if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
    return new NextResponse(
      JSON.stringify({ message: "Order id not correct" }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  await dbConnect();
  const order = await OrderModel.findById(params.id);
  return Response.json(order);
};
