import dbConnect from "@/lib/dbConnect";
import { logicRules } from "@/lib/logic";
import CategoryModel from "@/lib/models/CategoryModel";
import { NextRequest, NextResponse } from "next/server";

const {
  name: { minName, maxName },
  description: { minDesc, maxDesc },
} = logicRules.category;

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { color, name, description } = body;


    // Verifications for name and description
    if (!name || name.length < minName || name.length > maxName) {
      return NextResponse.json(
        {
          message: `Name should be between ${minName} and ${maxName} characters`,
        },
        { status: 400 }
      );
    }

    if (
      !description ||
      description.length < minDesc ||
      description.length > maxDesc
    ) {
      return NextResponse.json(
        {
          message: `Description should be between ${minDesc} and ${maxDesc} characters`,
        },
        { status: 400 }
      );
    }

    if (!color || color.length < 2) {
      return NextResponse.json(
        {
          message: `Color is required.`,
        },
        { status: 400 }
      );
    }

    const category = {
      color,
      name,
      description,
    };

    await dbConnect();

    const categoryMongo = new CategoryModel(category);

    const resMongo = await categoryMongo.save();

    return NextResponse.json({ res: resMongo }, { status: 201 });
  } catch (error) {
    console.error("Error handling upload:", error);
    return NextResponse.json(
      { message: "Internal server error", error: JSON.stringify(error) },
      { status: 500 }
    );
  }
};
