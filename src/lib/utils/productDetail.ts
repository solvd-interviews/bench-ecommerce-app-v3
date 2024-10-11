import dbConnect from "../dbConnect";
import CategoryModel from "../models/CategoryModel";
import ProductModel, { Product } from "../models/ProductModel";

export const fetchProductById = async (id: string): Promise<Product | null> => {
  await dbConnect();
  try {
    const product = await ProductModel.findById(id).populate({
      path: "categories", // Ensure the path matches your field in ProductModel
      model: CategoryModel, // Explicitly reference the CategoryModel if needed
    });
    if (!product) {
      console.error("No product found with id: ", id);
      return null;
    }
    return product.toObject() as Product;
  } catch (error) {
    console.error("Error fetching product by id: ", id, error);
    throw new Error("Failed to fetch product");
  }
};
