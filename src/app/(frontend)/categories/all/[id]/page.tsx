import { fetchOneCategoryById } from "@/lib/utils/categories";
import { fetchProductsByCategoryId } from "@/lib/utils/products";
import Link from "next/link";
import React from "react";
import { LuArrowLeft } from "react-icons/lu";
import Card from "@/components/Card";

const SingleCategory = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { category } = await fetchOneCategoryById(id);
  const { products } = await fetchProductsByCategoryId(id);

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex gap-4 items-center">
        <Link href={"/categories/all"}>
          <LuArrowLeft size={40} />
        </Link>
        <h2 className="text-4xl">Category </h2>
        <div
          style={{ backgroundColor: category.color }}
          className={"p-2 rounded-md select-none"}
        >
          {category.name}
        </div>
      </div>
      <p className="text-1xl mt-5">{category.description}</p>
      {products && products.length > 0 ? (
        <div className="w-full mt-6 grid place-items-center gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
          {products.map((product) => (
            <Card key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 mt-4">
          No products found for this category.
        </div>
      )}
    </div>
  );
};

export default SingleCategory;
