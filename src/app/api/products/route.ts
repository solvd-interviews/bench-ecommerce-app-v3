import { fetchProductsPagination } from "@/lib/utils/products";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

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

  const filters = {
    id: parseInt(searchParams.get("id") ?? "0"),
    name: searchParams.get("name"),
    createDate: searchParams.get("createDate") ? new Date(searchParams.get("createDate") as string) : null,
    updatedDate: searchParams.get("updatedDate") ? new Date(searchParams.get("updatedDate") as string) : null,
    price: parseFloat(searchParams.get("price") ?? "0"),
    stock: parseInt(searchParams.get("stock") ?? "0"),
    block: searchParams.get("block") === "true",
  }

  const { products, totalPages, currentPage } = await fetchProductsPagination(
    page,
    limit,
    sort,
    order,
    filters
  );

  return NextResponse.json(
    { products, totalPages, currentPage },
    { status: 200 }
  );
};
