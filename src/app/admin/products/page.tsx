import ProductTable from "@/components/ProductTable";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <div className="flex gap-5 items-center px-4 h-16 min-h-16 justify-center ">
        <div className="flex-1"></div>
        <h2 className="md:text-3xl font-bold text-center flex-1">
          Products dashboard
        </h2>
        <div className="flex-1 flex items-center justify-end">
          <button className="btn btn-primary ">
            <Link
              href={"/admin/products/create"}
              className="flex items-center gap-2"
            >
              <p className="hidden lg:flex">Create a new product</p>
              <p className=" lg:hidden">Create</p>
            </Link>
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-hidden flex flex-col ">
        <ProductTable />
      </div>
    </>
  );
};

export default Page;
