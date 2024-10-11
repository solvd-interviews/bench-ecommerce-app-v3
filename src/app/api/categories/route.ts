import { fetchCategoriesPagination } from "@/lib/utils/categories";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  if (!limit || !page) {
    return NextResponse.json(
      { error: "The params are wrong" },
      { status: 400 }
    );
  }

  const { categories, totalPages, currentPage } =
    await fetchCategoriesPagination(page, limit, sort, order);

  return NextResponse.json(
    { categories, totalPages, currentPage },
    { status: 200 }
  );
};
