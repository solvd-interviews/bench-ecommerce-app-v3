import { config } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import { getServerSession } from "next-auth";

export const GET = async (req: any) => {
  const { user } = await getServerSession(config);

  if (!user) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }

  await dbConnect();
  const orders = await OrderModel.find({ user: user._id });
  return Response.json(orders);
};
