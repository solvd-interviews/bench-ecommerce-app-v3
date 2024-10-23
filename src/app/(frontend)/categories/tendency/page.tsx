import Card from "@/components/Card";
import { fetchTendencyProductsLast15Days } from "@/lib/utils/products";
import Link from "next/link";
import React from "react";
import { LuArrowLeft } from "react-icons/lu";

const TendencyProducts = async () => {
  const tendencyProd = await fetchTendencyProductsLast15Days();
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex gap-4 items-center">
        <Link href={"/"}>
          <LuArrowLeft size={40} />
        </Link>
        <h2 className="text-4xl">Trending products </h2>
      </div>
      <p className="text-1xl mt-5">
        All the products that were added in the last fifty days most selled are
        here!
      </p>
      {tendencyProd && tendencyProd.length > 0 ? (
        <div className="w-full mt-6 grid place-items-center gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
          {tendencyProd.map((product) => (
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

export default TendencyProducts;
