// File: /app/search/page.tsx

import { redirect } from "next/navigation";
import { fetchProductsByFilters } from "../../../lib/utils/products";
import Card from "@/components/Card";
import Filters from "./filters";

const Page = async ({
  searchParams,
}: {
  searchParams: {
    query?: string;
    maxPrice?: number;
    minPrice?: number;
    categories?: string;
    ascOrder?: string;
    sortBy?: string;
  };
}) => {
  const query = searchParams.query;
  const minPriceFilter = searchParams.minPrice;
  const maxPriceFilter = searchParams.maxPrice;
  const categories = searchParams.categories;
  const ascOrder = searchParams.ascOrder;
  const sortBy = searchParams.sortBy;

  if (!query) {
    redirect("/");
  }

  const { products, minPriceLimit, maxPriceLimit } =
    await fetchProductsByFilters({
      name: query,
      minPriceFilter,
      maxPriceFilter,
      categories,
      ascOrder,
      sortBy,
    });

  

  /* 
    TODO 2): implement filter by price and categories 
  */

  return (
    <div className="flex flex-col md:flex-row w-full h-full p-4 gap-4">
      <Filters
        minPriceLimit={minPriceLimit}
        maxPriceLimit={maxPriceLimit}
        minPriceFilter={minPriceFilter}
        maxPriceFilter={maxPriceFilter}
        categoriesFilter={categories}
        ascOrderFilter={ascOrder}
        sortByFilter={sortBy}
      />
      <main className="w-full h-full px-2 ">
        <h1 className="text-3xl">
          Search results for: {query} ({products.length})
        </h1>
        <div className="py-4 w-full mt-2  flex flex-wrap gap-4  ">
          {products &&
            products.map((prod) => <Card key={prod._id} product={prod} />)}
        </div>
      </main>
    </div>
    /* 
    TODO 3): implement logic if no results were found. Show top 5 most searched texts. 
    TODO 4): show history of products visited at home until 5. 
  */
  );
};

export default Page;
