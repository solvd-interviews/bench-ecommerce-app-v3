import BrandedProducts from "@/components/BrandedProducts";
import Card from "@/components/Card";
import { fetchBrandedProducts, fetchProducts } from "@/lib/utils/products";
import Link from "next/link";

export default async function Home() {
  const [res, resBranded] = await Promise.all([
    fetchProducts(),
    fetchBrandedProducts(),
  ]);
  return (
    <div className="w-full   flex-col p-4 sm:p-10 gap-4 items-center  justify-center ">
      <div className="w-full flex justify-center">
        <BrandedProducts brandedProd={resBranded} />
      </div>
      <div className="w-full flex justify-center mt-6 sm:mt-10 gap-4">
        <Link
          className=" w-56 h-  rounded-xl flex flex-col justify-center items-center shadow-xl bg-secondary bg-cover bg-center"
          href={"/categories/tendency"}
          style={{ backgroundImage: `url('/tendency.png')` }}
        >
          <span
            className="text-3xl sm:text-4xl font-bold text-white "
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
          >
            Trending
          </span>
        </Link>

        <Link
          className=" w-56 h-  rounded-xl flex flex-col justify-center items-center shadow-xl bg-secondary bg-cover bg-center"
          href={"/categories/new"}
          style={{ backgroundImage: `url('/new.png')` }}
        >
          <span
            className="text-3xl sm:text-4xl font-bold text-white "
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
          >
            New
          </span>
        </Link>

        <Link
          className=" w-56 py-4  rounded-xl flex flex-col justify-center items-center shadow-xl bg-secondary bg-cover bg-center"
          href={"/categories/all"}
          style={{ backgroundImage: `url('/Categories.png')` }}
        >
          <span
            className="text-3xl sm:text-4xl font-bold text-white "
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
          >
            Categories
          </span>
        </Link>
      </div>
      <div className="w-full mt-6 sm:mt-10 grid place-items-center gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
        {res.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
