import CategoryComponent from "@/components/CategoryComponent";
import { fetchAllCategories } from "@/lib/utils/categories";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";

const page = async () => {
  const { categories } = await fetchAllCategories();

  return (
    <div className="w-full h-full p-4">
      <div className="flex gap-4 items-center">
        <Link href={"/"}>
          <LuArrowLeft size={40} />
        </Link>
        <h2 className="text-3xl ">All categories</h2>
      </div>

      {Array.isArray(categories) && categories.length > 0 && (
        <div className=" flex flex-wrap gap-2 mt-10">
          {categories.map((cat) => (
            <CategoryComponent cat={cat} key={cat._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default page;
