"use client";
import useCartService from "@/lib/hooks/useCartStore";
import Link from "next/link";
import { LuShoppingCart } from "react-icons/lu";

const Cart = () => {
  const { items } = useCartService();

  return (
    <Link className="flex min-w-20 justify-between" href="/cart" id="cart-link">
      <LuShoppingCart className="min-w-10" size={30} id="cart-icon" />

      {items.length !== 0 ? (
        <div
          className={`badge badge-secondary bg-primary text-white font-bold ${
            items.reduce((a, c) => a + c.qty, 0) > 9 ? "min-w-10" : "min-w-9"
          }`}
          id="cart-badge" // ID for the badge displaying item count
        >
          {items.reduce((a, c) => a + c.qty, 0)}
        </div>
      ) : (
        <div className={`badge badge-secondary font-bold`} id="cart-badge-empty">0</div>
      )}
    </Link>
  );
};

export default Cart;
