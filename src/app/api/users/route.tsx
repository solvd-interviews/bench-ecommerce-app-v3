import { fetchProductsPagination } from "@/lib/utils/products";
import { fetchUsersPagination } from "@/lib/utils/users";
import { NextRequest, NextResponse } from "next/server";

export interface MongoFilterUser {
  name: { $regex: string; $options: string };
  createdAt: { $gte: Date };
  updatedAt: { $gte: Date };
  email: { $regex: string; $options: string };
  userNumber: { $eq: number };
  isAdmin: boolean;
  isBlocked: boolean;
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

  const query: Partial<MongoFilterUser> = {};

  const name = searchParams.get("name");
  if (name) {
    query["name"] = { $regex: name, $options: "i" };
  }

  const email = searchParams.get("email");
  if (email) {
    query["email"] = { $regex: email, $options: "i" };
  }

  const createDate = searchParams.get("createDate");
  if (createDate) {
    query["createdAt"] = { $gte: new Date(createDate) };
  }

  const updatedDate = searchParams.get("updatedDate");
  if (updatedDate) {
    query["updatedAt"] = { $gte: new Date(updatedDate) };
  }

  if (searchParams.has("id")) {
    const id = parseFloat(searchParams.get("id")!);
    if (!isNaN(id)) {
      query["userNumber"] = { $eq: id };
    }
  }

  const isAdmin = searchParams.get("isAdmin");
  if (isAdmin !== null) {
    query["isAdmin"] = isAdmin === "true";
  }
  const isBlocked = searchParams.get("isBlocked");
  if (isBlocked !== null) {
    query["isBlocked"] = isBlocked === "true";
  }

  const { users, totalPages, currentPage } = await fetchUsersPagination(
    page,
    limit,
    sort,
    order,
    query
  );

  return NextResponse.json({ users, totalPages, currentPage }, { status: 200 });
};
