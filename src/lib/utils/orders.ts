import dbConnect from "../dbConnect";
import OrderModel from "../models/OrderModel";

export const countOrders = async () => {
  await dbConnect();
  return await OrderModel.countDocuments();
};

export async function lastThirtyDaysOrdersPaid() {
  await dbConnect();
  const lastThirtyDaysOrdersPaid = await OrderModel.aggregate([
    {
      // Match paid orders within the last 30 days
      $match: {
        isPaid: true,
        paidAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    },
    {
      // Group by full date (year, month, and day)
      $group: {
        _id: {
          year: { $year: "$paidAt" },
          month: { $month: "$paidAt" },
          day: { $dayOfMonth: "$paidAt" },
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
        count: 1,
      },
    },
  ]);

  return lastThirtyDaysOrdersPaid;
}
export async function lastThirtyDaysOrdersNotPaid() {
  await dbConnect();
  const lastThirtyDaysOrdersNotPaid = await OrderModel.aggregate([
    {
      // Match paid orders within the last 30 days
      $match: {
        isPaid: false,
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
      // Sort by full date (year, month, day)
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
    {
      // Project the data into a format that MUI chart can use
      $project: {
        _id: 0,
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
        count: 1,
      },
    },
  ]);
  return lastThirtyDaysOrdersNotPaid;
}
export async function lastThirtyDaysOrders() {
  await dbConnect();
  const lastThirtyDaysOrders = await OrderModel.aggregate([
    {
      // Match paid orders within the last 30 days
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
      // Sort by full date (year, month, day)
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
    {
      // Project the data into a format that MUI chart can use
      $project: {
        _id: 0,
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
        count: 1,
      },
    },
  ]);
  return lastThirtyDaysOrders;
}

export async function lastThirtyDaysSales() {
  await dbConnect();
  const lastThirtyDaysSales = await OrderModel.aggregate([
    {
      // Match orders that were paid in the last 30 days
      $match: {
        paidAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
        isPaid: true, // Ensure that only paid orders are counted
      },
    },
    {
      // Group by full date (year, month, and day) and sum the totalPrice for each day
      $group: {
        _id: {
          year: { $year: "$paidAt" },
          month: { $month: "$paidAt" },
          day: { $dayOfMonth: "$paidAt" },
        },
        totalSales: { $sum: "$totalPrice" },
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
        totalSales: 1,
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
  return lastThirtyDaysSales;
}

export async function topFiveProductsLastThirtyDays() {
  await dbConnect();

  const topProducts = await OrderModel.aggregate([
    {
      // Match paid orders within the last 30 days
      $match: {
        isPaid: true,
        paidAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    },
    {
      // Unwind the items array to group by individual products
      $unwind: "$items",
    },
    {
      // Group by product and day, summing up the total sales and total sold per day
      $group: {
        _id: {
          product: "$items.product",
          year: { $year: "$paidAt" },
          month: { $month: "$paidAt" },
          day: { $dayOfMonth: "$paidAt" },
        },
        name: { $first: "$items.name" },
        totalSales: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
        totalSold: { $sum: "$items.qty" },
      },
    },
    {
      // Sort by total sales per product, descending
      $sort: { totalSales: -1 },
    },
    {
      // Project the data with the correct dayNumber calculation
      $project: {
        _id: 0,
        name: "$name",
        productId: "$_id.product",
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
        dailySales: {
          totalSales: "$totalSales",
        },
        totalSales: "$totalSales",
        totalSold: "$totalSold",
      },
    },
    {
      // Group again by product to accumulate sales and sold quantities, maintaining daily sales
      $group: {
        _id: {
          productId: "$productId",
          name: "$name",
        },
        totalSales: { $sum: "$totalSales" },
        totalSold: { $sum: "$totalSold" },
        dailySales: {
          $push: {
            dayNumber: "$dayNumber",
            totalSales: "$dailySales.totalSales",
          },
        },
      },
    },
    {
      // Sort by total sales, descending and limit to top 5 products
      $sort: { totalSales: -1 },
    },
    {
      $limit: 5,
    },
    {
      // Final project for output formatting
      $project: {
        _id: 0,
        name: "$_id.name",
        productId: "$_id.productId",
        totalSales: "$totalSales",
        totalSold: "$totalSold",
        dailySales: "$dailySales",
      },
    },
  ]);

  return topProducts;
}
