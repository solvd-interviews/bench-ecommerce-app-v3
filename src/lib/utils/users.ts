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

export async function lastThirtyDaysUsers() {
  await dbConnect();
  const lastThirtyDaysUsers = await UserModel.aggregate([
    {
      // Match documents within the last 30 days
      $match: {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    },
    {
      // Group by full date (year, month, and day) to avoid conflicts
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      // Sort by full date (year, month, day)
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
    {
      // Project the data into a format that MUI chart can use
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
        },
        count: 1,
        dayNumber: {
          $dateDiff: {
            startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
            endDate: {
              $dateFromParts: {
                year: "$_id.year",
                month: "$_id.month",
                day: "$_id.day",
              },
            },
            unit: "day",
          },
        },
      },
    },
  ]);

  return lastThirtyDaysUsers;
}

export async function countUsers() {
  await dbConnect(); // Ensure the database connection is established

  try {
    const userCount = await UserModel.countDocuments(); // Count all users in the collection
    return userCount; // Return the total user count
  } catch (error) {
    console.error("Error counting users:", error); // Log any errors
    throw new Error("Could not count users");
  }
}
