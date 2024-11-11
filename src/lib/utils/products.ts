import mongoose from "mongoose";
import dbConnect from "../dbConnect";
import CategoryModel from "../models/CategoryModel";
import OrderModel from "../models/OrderModel";
import ProductModel, { Product } from "../models/ProductModel";
import { MongoFilterProduct } from "@/app/api/products/route";

export const fetchProducts = async () => {
  await dbConnect();
  const res = await ProductModel.find({ isBlocked: false }).sort({
    createdAt: -1,
  });
  return res;
};
export const fetchBrandedProducts = async () => {
  await dbConnect();
  const res = await ProductModel.find({
    isBlocked: false,
    isBranded: true,
  }).sort({
    createdAt: -1,
  });
  return res;
};

export const blockProduct = async (id: string, block: boolean) => {
  await dbConnect();
  const res = await ProductModel.findByIdAndUpdate(
    id,
    { $set: { isBlocked: block } },
    { new: true }
  );
  return res;
};

export const brandProduct = async (id: string, brand: boolean) => {
  await dbConnect();
  const res = await ProductModel.findByIdAndUpdate(
    id,
    { $set: { isBranded: brand } },
    { new: true }
  );
  return res;
};

export const deleteProduct = async (id: string) => {
  await dbConnect();
  const res = await ProductModel.findByIdAndDelete(id);
  return res;
};

// Fetch products by category ID
export const fetchProductsByCategoryId = async (categoryId: string) => {
  await dbConnect();

  // Query products that have the provided categoryId in their categories array
  const products = await ProductModel.find({
    categories: { $in: [categoryId] }, // Use $in operator to check if categoryId exists in the categories array
    isBlocked: false, // Optionally filter non-blocked products
  })
    .sort({ createdAt: -1 })
    .populate({
      path: "categories", // Populating the categories field for each product
      model: CategoryModel, // Referencing CategoryModel explicitly
    })
    .exec();

  return { products };
};

export const fetchProductsPagination = async (
  page = 1,
  limit = 10,
  sort: string,
  order: string,
  query: Partial<MongoFilterProduct>
) => {
  await dbConnect();
  const prom1 = ProductModel.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ [sort]: order == "asc" ? 1 : -1 })
    .populate({
      path: "categories", // Ensure the path matches your field in ProductModel
      model: CategoryModel, // Explicitly reference the CategoryModel if needed
    })
    .exec();
  const prom2 = ProductModel.countDocuments(query);
  const [products, totalProducts] = await Promise.all([prom1, prom2]);

  return {
    products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
  };
};

export const countProducts = async () => {
  const numberOfProducts = await ProductModel.countDocuments();
  return numberOfProducts;
};

export const fetchProductsLast30Days = async () => {
  await dbConnect();

  // Get the current date and subtract 30 days
  const today = new Date();
  const last30Days = new Date(today.setDate(today.getDate() - 30));

  // Find products added in the last 30 days
  const res = await ProductModel.find({
    isBlocked: false,
    createdAt: { $gte: last30Days }, // Fetch products where createdAt is greater than or equal to 30 days ago
  }).sort({ createdAt: -1 });

  return res;
};

export const fetchTendencyProductsLast15Days = async () => {
  await dbConnect();

  // Get the current date and subtract 15 days
  const today = new Date();
  const last15Days = new Date(today.setDate(today.getDate() - 15));

  // Step 1: Aggregate the sales data for products in the last 15 days
  const productSales = await OrderModel.aggregate([
    {
      $match: {
        isPaid: true, // Only paid orders
        paidAt: { $gte: last15Days }, // Orders in the last 15 days
      },
    },
    { $unwind: "$items" }, // Break the order into individual products
    {
      $group: {
        _id: "$items.product", // Group by product ID
        name: { $first: "$items.name" }, // Get product name
        totalSold: { $sum: "$items.qty" }, // Sum the quantities sold
      },
    },
    {
      $sort: { totalSold: -1 }, // Sort by total sold in descending order (most sold first)
    },
  ]);

  // Step 2: Fetch full product details for the top-selling products
  const productIds = productSales.map((item) => item._id);
  const products = await ProductModel.find({ _id: { $in: productIds } });

  // Step 3: Merge the sales data with the product details
  const result = productSales.map((sale) => {
    const product = products.find(
      (prod) => prod._id.toString() === sale._id.toString()
    );
    return {
      productId: sale._id,
      name: sale.name,
      totalSold: sale.totalSold,
      ...product._doc, // Include the full product details
    };
  });

  return result;
};

type FetchProductFilters = {
  name?: string;
  minPriceFilter?: number;
  maxPriceFilter?: number;
  categories?: string;
  ascOrder?: string;
  sortBy?: string;
};

export const fetchProductsByFilters = async ({
  name,
  minPriceFilter,
  maxPriceFilter,
  categories,
  ascOrder,
  sortBy,
}: FetchProductFilters): Promise<{
  products: Product[];
  minPriceLimit: number;
  maxPriceLimit: number;
}> => {
  await dbConnect();

  // Create the base query object
  const query: any = {
    isBlocked: false,
  };

  // Add regex for name search if name is provided
  if (name) {
    query.name = { $regex: new RegExp(name, "i") }; // Case-insensitive regex
  }

  // Add price filters if provided
  if (minPriceFilter !== undefined) {
    query.price = { ...query.price, $gte: minPriceFilter };
  }
  if (maxPriceFilter !== undefined) {
    query.price = { ...query.price, $lte: maxPriceFilter };
  }


  // Handle filtering by categories
  if (categories) {
    // Convert the comma-separated string to an array of trimmed IDs
    const categoryArray = categories
      .split(",")
      .map((id) => new mongoose.Types.ObjectId(id.trim()));
    query.categories = { $in: categoryArray };
  }


  const sortField = sortBy || "createdAt"; // Default to "createdAt" if sortBy is not provided
  const sortOrder = ascOrder === "true" ? 1 : -1; // 1 for ascending, -1 for descending

  // Fetch products using the constructed query
  const query1 = ProductModel.find(query)
    .populate({
      path: "categories",
      model: CategoryModel,
    })
    .sort({ [sortField]: sortOrder })
    .collation({ locale: "en", strength: 2 })  // Case-insensitive collation

    .exec();

  // Remove price filters for the aggregation query
  delete query.price;

  // Aggregation to find min and max prices
  const query2 = ProductModel.aggregate([
    { $match: query }, // Apply the same query filters
    {
      $group: {
        _id: null,
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);

  // Use Promise.all to run both queries concurrently
  const [products, priceRange] = await Promise.all([query1, query2]);


  // Extract min and max price from the aggregation result
  const minPriceValue = priceRange[0]?.minPrice || 0;
  const maxPriceValue = priceRange[0]?.maxPrice || 0;

  return {
    products,
    minPriceLimit: minPriceValue,
    maxPriceLimit: maxPriceValue,
  };
};
