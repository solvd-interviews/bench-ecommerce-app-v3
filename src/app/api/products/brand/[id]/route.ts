import { brandProduct } from "@/lib/utils/products";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  if (!request.body) {
    return NextResponse.json({ error: "No body sent." }, { status: 400 });
  }

  try {
    // Parse request body to get isBlocked status
    const body = await request.json();

    if (!body) {
      return new NextResponse("Invalid Data", { status: 400 });
    }
    const { isBranded } = body;
    if (typeof isBranded !== "boolean") {
      return NextResponse.json(
        { error: "isBranded not found" },
        { status: 400 }
      );
    }
    // Call blockProduct function to update product
    const updatedProduct = await brandProduct(id, isBranded);

    // Return success response
    return NextResponse.json({
      message: `Product ${id} branded`,
      updatedProduct,
    });
  } catch (error) {
    console.error("Error branding product:", error);
    return NextResponse.json(
      { error: "Error branding product" },
      { status: 500 }
    );
  }
};
