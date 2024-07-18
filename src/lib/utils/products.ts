import dbConnect from "../dbConnect";
import ProductModel from "../models/ProductModel";
import { Filter } from "@/components/ProductTable/types";

interface MongoFilter {
  id: number | { $eq: number };
  name: string | { $regex: string; $options: string };
  createdAt: Date | { $gte: Date };
  updatedAt: Date | { $gte: Date };
  price: number | { $eq: number };
  stock: number | { $eq: number };
  isBlocked: boolean;
}

export const fetchProducts = async () => {
  await dbConnect();
  const res = await ProductModel.find({ isBlocked: false }).sort({
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

export const deleteProduct = async (id: string) => {
  await dbConnect();
  const res = await ProductModel.findByIdAndDelete(id);
  return res;
};

export const fetchProductsPagination = async (
  page = 1,
  limit = 10,
  sort: string,
  order: string,
  filters: Filter
) => {
  await dbConnect();
  const query: Partial<MongoFilter> = {};

  if (filters.id) query['id'] = filters.id;
  if (filters.name) query['name'] = { $regex: filters.name, $options: 'i' };
  if (filters.createDate) query['createdAt'] = { $gte: new Date(filters.createDate) };
  if (filters.updatedDate) query['updatedAt'] = { $gte: new Date(filters.updatedDate) };
  if (typeof filters.price === 'string') {
    query['price'] = { $eq: parseFloat(filters.price) };
  } else if (typeof filters.price === 'number') {
    query['price'] = { $eq: filters.price };
  }
  if (typeof filters.stock === 'string') {
    query['stock'] = { $eq: parseInt(filters.stock) };
  } else if (typeof filters.stock === 'number') {
    query['stock'] = { $eq: filters.stock };
  }
  if (filters.block !== null) query['isBlocked'] = filters.block;

  const prom1 = ProductModel.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ [sort]: order == "asc" ? 1 : -1 })
    .exec();
  const prom2 = ProductModel.countDocuments(query);
  const [products, totalProducts] = await Promise.all([prom1, prom2]);

  return {
    products,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
  };
};
