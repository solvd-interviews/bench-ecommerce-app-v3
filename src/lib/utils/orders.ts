import { MongoFilterUser } from "@/app/api/users/route";
import dbConnect from "../dbConnect";
import { MongoFilterOrder } from "@/app/api/orders/route";
import OrderModel from "../models/OrderModel";

export const fetchOrdersPagination = async (
  page = 1,
  limit = 10,
  sort: string,
  order: string,
  query: Partial<MongoFilterOrder>
) => {
  await dbConnect();

  const prom1 = OrderModel.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ [sort]: order == "asc" ? 1 : -1 })
    .exec();
  const prom2 = OrderModel.countDocuments(query);
  const [orders, totalOrders] = await Promise.all([prom1, prom2]);

  return {
    orders,
    totalPages: Math.ceil(totalOrders / limit),
    currentPage: page,
  };
};
