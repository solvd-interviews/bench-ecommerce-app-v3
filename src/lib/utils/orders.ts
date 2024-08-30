import { getStartDate30DAgo, normalizeDate, starter30DAgo } from ".";
import dbConnect from "../dbConnect";
import OrderModel from "../models/OrderModel";

export const countOrders = async () => {
  await dbConnect();
  return await OrderModel.countDocuments();
};

export async function lastThirtyDaysOrdersPaid() {
  await dbConnect();

  const { allDates } = starter30DAgo();

  // Step 2: Aggregate paid order counts by date
  const orderCounts = await OrderModel.aggregate([
    {
      $match: {
        isPaid: true,
        paidAt: { $gte: getStartDate30DAgo() },
      },
    },
    {
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
      $sort: { date: 1 },
    },
  ]);

  // Step 3: Merge the full date range with the order counts
  const mergedData = allDates.map((date) => {
    const orderData = orderCounts.find((order) => {
      return normalizeDate(order.date) === normalizeDate(date);
    });
    return orderData || { date, count: 0 };
  });

  return mergedData;
}

export async function lastThirtyDaysOrdersNotPaid() {
  await dbConnect();

  // Step 1: Generate an array of all dates for the last 30 days
  const { allDates } = starter30DAgo();

  // Step 2: Aggregate not paid order counts by date
  const orderCounts = await OrderModel.aggregate([
    {
      $match: {
        isPaid: false,
        createdAt: { $gte: getStartDate30DAgo() },
      },
    },
    {
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
      $sort: { date: 1 },
    },
  ]);

  // Step 3: Merge the full date range with the order counts
  const mergedData = allDates.map((date) => {
    const orderData = orderCounts.find((order) => {
      return normalizeDate(order.date) === normalizeDate(date);
    });
    return orderData || { date, count: 0 };
  });

  return mergedData;
}

export async function lastThirtyDaysOrders() {
  await dbConnect();

  // Step 1: Generate an array of all dates for the last 30 days
  const { allDates } = starter30DAgo();

  // Step 2: Aggregate all order counts by date
  const orderCounts = await OrderModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: getStartDate30DAgo(),
        },
      },
    },
    {
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
      $sort: { date: 1 },
    },
  ]);
  // Step 3: Merge the full date range with the order counts
  const mergedData = allDates.map((date) => {
    const orderData = orderCounts.find((order) => {
      return normalizeDate(order.date) === normalizeDate(date);
    });
    return orderData || { date, count: 0 };
  });

  return mergedData;
}

export async function lastThirtyDaysSales() {
  await dbConnect();

  // Step 1: Generate an array of all dates for the last 30 days
  const { allDates } = starter30DAgo();

  // Step 2: Aggregate sales data by date
  const salesCounts = await OrderModel.aggregate([
    {
      $match: {
        paidAt: {
          $gte: getStartDate30DAgo(),
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
        totalSales: 1,
      },
    },
  ]);

  // Step 3: Merge the full date range with the sales data
  const mergedData = allDates.map((date) => {
    const salesData = salesCounts.find((sale) => {
      return normalizeDate(date) === normalizeDate(sale.date);
    });
    return salesData || { date, totalSales: 0 };
  });

  return mergedData;
}

export async function topFiveProductsLastThirtyDays() {
  await dbConnect();

  const startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() - 30);
  startDate.setUTCHours(0, 0, 0, 0);

  const topProducts = await OrderModel.aggregate([
    {
      $match: {
        isPaid: true,
        paidAt: { $gte: startDate },
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        name: { $first: "$items.name" },
        totalSales: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
      },
    },
    {
      $sort: { totalSales: -1 },
    },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        name: "$name",
        totalSales: 1,
      },
    },
  ]);

  // Format the data for the PieChart
  const pieChartData = topProducts.map((product, index) => ({
    id: index,
    value: product.totalSales,
    label: product.name,
  }));

  return pieChartData;
}
