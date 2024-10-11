import Link from "next/link";
import React from "react";
import { LuArrowLeft } from "react-icons/lu";
import Card from "@/components/Card";
import { fetchProductsLast30Days } from "@/lib/utils/products";

const NewProductCategory = async () => {
  const newProducts = await fetchProductsLast30Days();

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex gap-4 items-center">
        <Link href={"/"}>
          <LuArrowLeft size={40} />
        </Link>
        <h2 className="text-4xl">New products </h2>
      </div>
      <p className="text-1xl mt-5">
        All the products that were added in the last thirty days are here!
      </p>
      {newProducts && newProducts.length > 0 ? (
        <div className="w-full mt-6 grid place-items-center gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
          {newProducts.map((product) => (
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

export default NewProductCategory;
