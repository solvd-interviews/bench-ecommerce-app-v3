"use client";
import useCartService from "@/lib/hooks/useCartStore";
import { Product } from "@/lib/models/ProductModel";
import { useRouter } from "next/navigation";

const BuyButton = ({ product }: { product: Product }) => {
  const { increase } = useCartService();
  const router = useRouter();

  if (product.stock > 0) {
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
  } else {
    return (
      <button className="btn btn-primary disabled mt-2" disabled>
        No stock
      </button>
    );
  }
};

export default BuyButton;
