"use client";
import useCartService from "@/lib/hooks/useCartStore";
import { OrderItem } from "@/lib/models/OrderModel";
import { useEffect, useState } from "react";

export default function AddToCart({ item }: { item: OrderItem }) {
  const { items, increase, decrease } = useCartService();
  const [existItem, setExistItem] = useState<OrderItem | undefined>();

  useEffect(() => {
    setExistItem(items.find((x) => x._id === item._id));
  }, [items, item]);

  const addToCartHandler = () => {
    increase(item);
  };

  return existItem ? (
    <div className="mt-2 flex items-center">
      <button
        className="btn btn-primary w-10"
        type="button"
        onClick={() => decrease(existItem)}
      >
        -
      </button>
      <div className="px-2 w-10 text-center">{existItem.qty}</div>
      <button
        className="btn btn-primary w-10"
        type="button"
        onClick={() => increase(existItem)}
      >
        +
      </button>
    </div>
  ) : (
    <button
      className={"btn btn-primary mt-4 w-full md:w-auto"}
      type="button"
      onClick={addToCartHandler}
    >
      Add to cart
    </button>
  );
}
