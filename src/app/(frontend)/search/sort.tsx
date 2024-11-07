"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LuArrowDown } from "react-icons/lu";
import { LuArrowUp } from "react-icons/lu";

const Sort = ({
  ascOrderFilter,
  sortByFilter,
}: {
  ascOrderFilter?: string;
  sortByFilter?: string;
}) => {
  const [asc, setAsc] = useState(ascOrderFilter || "true");
  const [filterByProperty, setFilterByProperty] = useState(
    sortByFilter || "createdAt"
  );
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const updatedParams = new URLSearchParams(params.toString());
    // Update or set the minPrice parameter
    updatedParams.set("ascOrder", asc.toString());
    updatedParams.set("sortBy", filterByProperty.toString());

    // Push the updated query parameters to the URL
    router.push("/search?" + updatedParams.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asc, filterByProperty]);

  return (
    <div className=" bg-white flex flex-col gap-2 p-4 rounded-md shadow-md w-full">
      <div className="flex gap-2 items-center ">
        <h2 className="text-2xl">Sort</h2>
        <div>
          {asc === "true" ? (
            <LuArrowDown
              size={25}
              className="text-primary cursor-pointer"
              onClick={() => {
                setAsc("false");
              }}
            />
          ) : (
            <LuArrowUp
              size={25}
              className="text-primary cursor-pointer"
              onClick={() => {
                setAsc("true");
              }}
            />
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2 p-1 items-center">
        <div
          className={`px-2 py-1 bg-primary text-white font-bold rounded-md cursor-pointer shadow-xl 
            ${filterByProperty === "price" && "border-4"}`}
          onClick={() => {
            setFilterByProperty("price");
          }}
        >
          Price
        </div>
        <div
          className={`px-2 py-1 bg-primary text-white font-bold rounded-md cursor-pointer shadow-xl ${
            filterByProperty === "name" && "border-4"
          }`}
          onClick={() => {
            setFilterByProperty("name");
          }}
        >
          Name
        </div>

        <div
          className={`px-2 py-1 bg-primary text-white font-bold rounded-md cursor-pointer shadow-xl ${
            filterByProperty === "stock" && "border-4"
          }`}
          onClick={() => {
            setFilterByProperty("stock");
          }}
        >
          Stock
        </div>
      </div>
    </div>
  );
};

export default Sort;
