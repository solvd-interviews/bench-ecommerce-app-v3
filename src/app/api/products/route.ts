import { fetchProductsPagination } from "@/lib/utils/products";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export interface MongoFilterProduct {
  name: { $regex: string; $options: string };
  createdAt: { $gte: Date };
  updatedAt: { $gte: Date };
  price: { $eq: number };
  stock: { $eq: number };
  id: { $eq: number };
  isBlocked: boolean;
  isBranded: boolean;
}

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  if (!limit || !page || !sort || !order) {
    return NextResponse.json(
      { error: "The params are wrong" },
      { status: 400 }
    );
  }

  const query: Partial<MongoFilterProduct> = {};

  const name = searchParams.get("name");
  if (name) {
    query["name"] = { $regex: name, $options: "i" };
  }

  const createDate = searchParams.get("createDate");
  if (createDate) {
    query["createdAt"] = { $gte: new Date(createDate) };
  }

  const updatedDate = searchParams.get("updatedDate");
  if (updatedDate) {
    query["updatedAt"] = { $gte: new Date(updatedDate) };
  }

  if (searchParams.has("price")) {
    const price = parseFloat(searchParams.get("price")!);
    if (!isNaN(price)) {
      query["price"] = { $eq: price };
    }
  }

  if (searchParams.has("id")) {
    const id = parseFloat(searchParams.get("id")!);
    if (!isNaN(id)) {
      query["id"] = { $eq: id };
    }
  }

  if (searchParams.has("stock")) {
    const stock = parseInt(searchParams.get("stock")!);
    if (!isNaN(stock)) {
      query["stock"] = { $eq: stock };
    }
  }

  const block = searchParams.get("block");
  if (block !== null) {
    query["isBlocked"] = block === "true";
  }

  const brand = searchParams.get("brand");
  if (brand !== null) {
    query["isBranded"] = brand === "true";
  }

  const { products, totalPages, currentPage } = await fetchProductsPagination(
    page,
    limit,
    sort,
    order,
    query
  );

  return NextResponse.json(
    { products, totalPages, currentPage },
    { status: 200 }
  );
};
