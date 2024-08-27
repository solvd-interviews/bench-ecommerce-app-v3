import ProductTable from "@/components/ProductTable";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <div
        id="products-dashboard-header"
        className="flex gap-5 items-center px-4 h-16 min-h-16 justify-center"
      >
        <div id="products-dashboard-header-left" className="flex-1"></div>
        <h2
          id="products-dashboard-title"
          className="md:text-3xl font-bold text-center flex-1"
        >
          Products dashboard
        </h2>
        <div
          id="products-dashboard-header-right"
          className="flex-1 flex items-center justify-end"
        >
          <button id="create-product-button" className="btn btn-primary">
            <Link
              id="create-product-link"
              href={"/admin/products/create"}
              className="flex items-center gap-2"
            >
              <p id="create-product-text-lg" className="hidden lg:flex">
                Create a new product
              </p>
              <p id="create-product-text-sm" className="lg:hidden">
                Create
              </p>
            </Link>
          </button>
        </div>
      </div>
      <div
        id="products-dashboard-content"
        className="flex-grow overflow-hidden flex flex-col"
      >
        <ProductTable />
      </div>
    </>
  );
};

export default Page;
