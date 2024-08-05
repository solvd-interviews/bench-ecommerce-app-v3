import { uploadFileLocally } from "@/lib/utils/cloudinary";
import ProductModel from "@/lib/models/ProductModel";
import { deleteImage, getPublicIdFromUrl } from "@/lib/utils/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  if (!request.body) {
    return NextResponse.json({ error: "No body sent." }, { status: 400 });
  }

  try {
    // Parse request body to get isBlocked status
    const formData = await request.formData();

    if (!formData) {
      return new NextResponse("Invalid formData", { status: 400 });
    }

    console.log("create product ", formData);
    let length = formData.get("imgLength");
    if (!length || typeof length !== "string") {
      return NextResponse.json(
        { message: "Not correct data." },
        { status: 400 }
      );
    }
    const price = formData.get("price");
    if (!price || typeof price !== "string") {
      return NextResponse.json(
        { message: "Not correct price." },
        { status: 400 }
      );
    }

    const name = formData.get("name");
    console.log("name: ", name);

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { message: "Not correct name." },
        { status: 400 }
      );
    }

    const description = formData.get("description");
    console.log("description: ", description);

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { message: "Not correct description." },
        { status: 400 }
      );
    }

    const stock = formData.get("stock");
    console.log("stock: ", stock);

    if (!stock || typeof stock !== "string") {
      return NextResponse.json(
        { message: "Not correct stock." },
        { status: 400 }
      );
    }
    const isBlocked = formData.get("isBlocked");
    console.log("isBlocked: ", isBlocked);

    if (!isBlocked || typeof isBlocked !== "string") {
      return NextResponse.json(
        { message: "Not correct isBlocked." },
        { status: 400 }
      );
    }

    const filesDeleted = JSON.parse(
      formData.get("filesDeleted")?.toString() || ""
    );

    console.log("filesDeleted: ", filesDeleted);
    let promisesDelete: Promise<{ ok: boolean }>[] = [];

    if (Array.isArray(filesDeleted) && filesDeleted.length > 0) {
      console.log("filesDeleted true ");

      filesDeleted.forEach((_, index) => {
        console.log("index delete", index);
        promisesDelete.push(
          deleteImage(getPublicIdFromUrl(filesDeleted[index]))
        );
      });
      console.log("promisesDelete: ", promisesDelete);
      const res = await Promise.all(promisesDelete);
      console.log("res prom all delete: ", res);
    }

    console.log("find by id");
    let product = await ProductModel.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    console.log("product fetched: ", product);

    let promises: (Promise<string | undefined> | string)[] = [];
    for (let index = 0; index < parseInt(length); index++) {
      let file = formData.get("image-" + index);
      if (file instanceof File) {
        promises.push(uploadFileLocally(file));
      } else if (typeof file === "string") {
        promises.push(file);
      } else {
        return NextResponse.json(
          { error: "File type not correct" },
          { status: 404 }
        );
      }
    }

    console.log("promises files: ", promises);

    const urls = await Promise.all(promises);
    console.log("urls: ", urls);

    // Update product fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.isBlocked = isBlocked;
    product.images = urls;

    // Save the updated product
    console.log("before save: ", product);
    const res = await product.save();
    console.log("res is: ", res);

    // Return success response
    return NextResponse.json({
      message: `Product ${id} updated successfully`,
      product: res,
    });
  } catch (error) {
    console.error("Error blocking product:", error);
    return NextResponse.json(
      { error: "Error blocking product" },
      { status: 500 }
    );
  }
};
