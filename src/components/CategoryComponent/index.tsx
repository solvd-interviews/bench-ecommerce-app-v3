"use client";
import { Category } from "@/lib/models/CategoryModel";
import { useRouter } from "next/navigation";

const CategoryComponent = ({ cat }: { cat: Category }) => {
  const router = useRouter();
  return (
    <div
      style={{ backgroundColor: cat.color }}
      className={"p-2 rounded-md select-none cursor-pointer hover:scale-95"}
      onClick={() => {
        router.push("/categories/all/" + cat._id);
      }}
    >
      {cat.name}
    </div>
  );
};

export default CategoryComponent;
