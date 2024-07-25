"use client";
import useCartService from "@/lib/hooks/useCartStore";
import { Product } from "@/lib/models/ProductModel";
import { useRouter } from "next/navigation";

const BuyButton = ({ product }: { product: Product }) => {
  const { increase } = useCartService();
  const router = useRouter();

  return (
    <button
      className="btn btn-primary"
      onClick={() => {
        increase({
          ...product,
          qty: 0,
          color: "",
          size: "",
          image: product.images[0] || null,
        });
        router.push("/cart");
      }}
    >
      Buy Now
    </button>
  );
};

export default BuyButton;
