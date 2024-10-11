import dbConnect from "../dbConnect";
import CategoryModel from "../models/CategoryModel";

export const fetchCategoriesPagination = async (
  page = 1,
  limit = 10,
  sort: string,
  order: string
) => {
  await dbConnect();

  const prom1 = CategoryModel.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ [sort]: order == "asc" ? 1 : -1 })
    .exec();
  const prom2 = CategoryModel.countDocuments();
  const [categories, totalCategories] = await Promise.all([prom1, prom2]);

  return {
    categories,
    totalPages: Math.ceil(totalCategories / limit),
    currentPage: page,
  };
};
export const fetchAllCategories = async () => {
  await dbConnect();

  const categories = await CategoryModel.find();

  return {
    categories,
  };
};

export const fetchOneCategoryById = async (id: string) => {
  await dbConnect();

  const category = await CategoryModel.findById(id);

  return {
    category,
  };
};

export const deleteCategory = async (id: string) => {
  await dbConnect();
  const res = await CategoryModel.findByIdAndDelete(id);
  return res;
};
