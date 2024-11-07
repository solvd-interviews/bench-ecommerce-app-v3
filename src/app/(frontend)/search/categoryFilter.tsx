"use client";

import { Category } from "@/lib/models/CategoryModel";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryFilter({
  categories,
  categoriesFilter,
}: {
  categories: Category[];
  categoriesFilter?: string;
}) {
  console.log("categoriesFilter ", categoriesFilter);
  const router = useRouter();
  const params = useSearchParams();
  const [categoriesArr, setCategoriesArr] = useState<string[]>(
    categoriesFilter ? categoriesFilter.split(",") : []
  );

  useEffect(() => {
    if (
      JSON.stringify(categoriesArr) !==
      JSON.stringify(categoriesFilter ? categoriesFilter.split(",") : [])
    ) {
      const updatedParams = new URLSearchParams(params.toString());
      // Update or set the minPrice parameter
      updatedParams.set("categories", categoriesArr.toString());

      // Push the updated query parameters to the URL
      router.push("/search?" + updatedParams.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesArr.length]);

  return (
    <div className="w-full h-24 flex flex-wrap gap-2 justify-center items-center ">
      {Array.isArray(categories) && categories.length > 0 ? (
        categories.map((cat) => (
          <div
            key={cat._id}
            style={{ backgroundColor: cat.color }}
            className={`p-2 rounded-md shadow-xl  select-none ${
              categoriesArr.includes(cat._id)
                ? "border-4 "
                : "hover:cursor-pointer hover:scale-95"
            }`}
            onClick={() => {
              if (categoriesArr.includes(cat._id)) {
                setCategoriesArr((prevState) =>
                  prevState.filter((subCat) => subCat !== cat._id)
                );
              } else {
                setCategoriesArr((prevState) => [...prevState, cat._id]);
              }
            }}
          >
            {cat.name}
          </div>
        ))
      ) : (
        <p>No categories.</p>
      )}
    </div>
  );
}
