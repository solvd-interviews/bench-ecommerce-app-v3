"use client";
import useCartService from "@/lib/hooks/useCartStore";
import { useRouter } from "next/navigation";

const BuyButton = ({ productJsonStr }: { productJsonStr: string }) => {
  const productJson = JSON.parse(productJsonStr);
  const { increase } = useCartService();
  const router = useRouter();

  if (productJson && productJson.stock && productJson.stock > 0) {
    return (
      <button
        className="btn btn-primary"
        id="buy-button"
        onClick={() => {
          increase({
            ...productJson,
            qty: 0,
            color: "",
            size: "",
            image: productJson.images[0] || null,
          });
          router.push("/cart");
        }}
      >
        Buy Now
      </button>
    );
  } else {
    return (
      <button
        className="btn btn-primary disabled mt-2"
        id="no-stock-button"
        disabled
      >
        No stock
      </button>
    );
  }
};

export default BuyButton;
