import { MongoFilterUser } from "@/app/api/users/route";
import dbConnect from "../dbConnect";
import UserModel from "../models/UserModel";

export const fetchUsersPagination = async (
  page = 1,
  limit = 10,
  sort: string,
  order: string,
  query: Partial<MongoFilterUser>
) => {
  await dbConnect();

  const prom1 = UserModel.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ [sort]: order == "asc" ? 1 : -1 })
    .exec();
  const prom2 = UserModel.countDocuments(query);
  const [users, totalUsers] = await Promise.all([prom1, prom2]);

  return {
    users,
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: page,
  };
};
