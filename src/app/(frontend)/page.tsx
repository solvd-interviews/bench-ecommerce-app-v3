import BrandedProducts from "@/components/BrandedProducts";
import Card from "@/components/Card";
import { fetchBrandedProducts, fetchProducts } from "@/lib/utils/products";

export default async function Home() {
  const res = await fetchProducts();
  const resBranded = await fetchBrandedProducts();
  return (
    <div className="w-full   flex-col p-4 sm:p-10 gap-4 items-center  justify-center ">
      {/* Full-width slider for the first image of branded products */}
      <div className="w-full flex justify-center">
        <BrandedProducts brandedProd={resBranded} />
      </div>
      <div className="w-full mt-6 sm:mt-10 grid place-items-center gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
        {res.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
