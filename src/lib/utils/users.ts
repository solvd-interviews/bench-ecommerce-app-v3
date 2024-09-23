import { MongoFilterUser } from "@/app/api/users/route";
import dbConnect from "../dbConnect";
import UserModel from "../models/UserModel";
import { getStartDate30DAgo, normalizeDate } from ".";

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

  // Step 1: Generate an array of all dates for the last 30 days
  const startDate = getStartDate30DAgo();
  const endDate = new Date();
  const allDates = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    allDates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Step 2: Aggregate user counts by date
  const userCounts = await UserModel.aggregate([
    {
      // Match users created within the last 30 days
      $match: {
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    },
    {
      // Group by full date (year, month, and day)
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
      // Project the date into a usable format
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
      },
    },
    {
      // Sort by date
      $sort: { date: 1 },
    },
  ]);

  // Step 3: Merge the full date range with the user counts
  const mergedData = allDates.map((date: Date) => {
    const userData = userCounts.find((user) => {
      return normalizeDate(user.date) === normalizeDate(date);
    });
    if (userData) {
      return userData;
    }
    return {
      date,
      count: 0,
    };
  });

  return mergedData;
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
