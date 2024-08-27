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
    <div className="mt-2 flex items-center" id="cart-item-controls">
      <button
        className="btn btn-primary w-10"
        type="button"
        onClick={() => decrease(existItem)}
        id="decrease-item-button"
      >
        -
      </button>
      <div className="px-2 w-10 text-center" id="item-quantity">
        {existItem.qty}
      </div>
      <button
        className="btn btn-primary w-10"
        type="button"
        onClick={() => increase(existItem)}
        id="increase-item-button"
      >
        +
      </button>
    </div>
  ) : (
    <button
      className={"btn btn-primary mt-4 w-full md:w-auto"}
      type="button"
      onClick={addToCartHandler}
      id="add-to-cart-button"
    >
      Add to cart
    </button>
  );
}
