import CategoryTable from "@/components/CategoryTable";
import OrderTable from "@/components/OrderTable";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <div
        id="src-app-admin-orders-page-menuContainer"
        className="flex gap-5 items-center px-4 h-16 min-h-16 justify-center "
      >
        <div id="header-spacer-left" className="flex-1"></div>
        <h2
          id="products-dashboard-title"
          className="md:text-3xl font-bold text-center flex-1"
        >
          Categories dashboard
        </h2>
        <div
          id="header-spacer-right"
          className="flex-1 flex items-center justify-end"
        >
          <button id="create-product-button" className="btn btn-primary">
            <Link
              href={"/admin/categories/create"}
              className="flex items-center gap-2"
            >
              <p id="create-product-full" className="hidden lg:flex">
                Create a new category
              </p>
              <p id="create-product-short" className="lg:hidden">
                Create
              </p>
            </Link>
          </button>
        </div>
      </div>
      <div
        id="src-app-admin-orders-page-contentContainer"
        className="flex-grow overflow-hidden flex flex-col "
      >
        <CategoryTable />
      </div>
    </>
  );
};

export default Page;
