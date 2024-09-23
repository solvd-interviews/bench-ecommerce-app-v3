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

  const { users } = sampleData;
  await dbConnect();

  await UserModel.deleteMany();
  await CounterModel.findByIdAndDelete("userNumber");

  // Save users with incremental userNumber sequentially
  for (const user of users) {
    const newUser = new UserModel(user);
    await newUser.save();
  }

  // Retrieve the saved documents
  const savedUsers = await UserModel.find();

  return NextResponse.json({
    message: "Users were generated successfully!",
    users: savedUsers,
  });
};
