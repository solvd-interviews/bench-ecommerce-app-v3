import { config } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import UserModel from "@/lib/models/UserModel";
import { lastThirtyDaysUsers } from "@/lib/utils/users";
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

  return Response.json(await lastThirtyDaysUsers());
};
