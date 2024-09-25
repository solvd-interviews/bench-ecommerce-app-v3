import { config } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { user } = await getServerSession(config);

  if (!user || !user.isAdmin) {
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
  order.isDelivered = !order.isDelivered;
  const res = await order.save();
  return new NextResponse(JSON.stringify({ order: res }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
