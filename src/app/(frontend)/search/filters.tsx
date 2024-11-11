import { fetchAllCategories } from "@/lib/utils/categories";
import RangeSlider from "./priceFilter";
import CategoryFilter from "./categoryFilter";
import { LuTrash } from "react-icons/lu";
import Sort from "./sort";

const Filters = async ({
  minPriceLimit,
  maxPriceLimit,
  minPriceFilter,
  maxPriceFilter,
  categoriesFilter,
  ascOrderFilter,
  sortByFilter,
}: {
  minPriceLimit: number;
  maxPriceLimit: number;
  minPriceFilter?: number;
  maxPriceFilter?: number;
  categoriesFilter?: string;
  ascOrderFilter?: string;
  sortByFilter?: string;
}) => {
  if (isNaN(minPriceLimit) || isNaN(maxPriceLimit)) {
    return;
  }

  const { categories } = await fetchAllCategories();

  return (
    <div className="flex flex-col gap-2 w-full md:w-72 h-full justify-center items-center">
      <div className=" bg-white flex flex-col gap-2 p-4 rounded-md shadow-md">
        <h2 className="text-2xl">Filter</h2>
        <div>
          <div>Price</div>
          {/*  <div
          className="hover:scale-105 text-primary "
          onClick={(event) => {
            event.stopPropagation();
            maxPriceFilter = undefined;
            minPriceFilter = undefined
          }}
        >
          <LuTrash />
        </div> */}
        </div>
        <div className="px-2 text-primary">
          <RangeSlider
            minPriceLimit={minPriceLimit}
            maxPriceLimit={maxPriceLimit}
            minPriceFilter={minPriceFilter ? minPriceFilter : minPriceLimit}
            maxPriceFilter={maxPriceFilter ? maxPriceFilter : maxPriceLimit}
          />
        </div>
        <div>Category</div>
        <CategoryFilter
          categories={categories}
          categoriesFilter={categoriesFilter}
        />
      </div>
      <Sort ascOrderFilter={ascOrderFilter} sortByFilter={sortByFilter} />
    </div>
  );
};

export default Filters;
