import { config } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import UserModel from "@/lib/models/UserModel";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (
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
  const order = await OrderModel.findByIdAndDelete(params.id);
  return new NextResponse(JSON.stringify({ order }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
