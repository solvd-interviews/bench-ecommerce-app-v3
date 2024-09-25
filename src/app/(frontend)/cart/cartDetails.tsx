"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useCartService from "@/lib/hooks/useCartStore";
import { useEffect, useState } from "react";
import { LuArrowRight, LuShoppingCart, LuTrash2 } from "react-icons/lu";

export default function CartDetails() {
  const router = useRouter();
  const { items, itemsPrice, decrease, increase, removeItem, clear } =
    useCartService();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <>
      <h1 className="py-2 text-2xl w-full mb-5" id="cart-title">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="flex items-center gap-4" id="cart-empty">
          <h2 className="text-2xl" id="cart-empty-message">
            Cart is empty!{" "}
          </h2>
          <Link href="/" id="cart-go-shopping-link">
            <button className="btn btn-primary" id="cart-go-shopping-button">
              Go shopping! <LuArrowRight size={25} />
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5 gap-2" id="cart-content">
          <div
            className="overflow-x-auto md:col-span-3"
            id="cart-items-container"
          >
            <table className="table shadow-xl" id="cart-items-table">
              <thead id="cart-items-table-head">
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody id="cart-items-table-body">
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="bg-white"
                    id={`cart-item-${item._id}`}
                  >
                    <td id={`cart-item-details-${item._id}`}>
                      <div className="h-20 min-w-40 flex items-center">
                        <Link
                          href={`/${item._id}`}
                          className="flex items-center"
                          id={`cart-item-link-${item._id}`}
                        >
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                              id={`cart-item-image-${item._id}`}
                            ></Image>
                          ) : (
                            <div
                              className="w-28 h-28 bg-slate-200"
                              id={`cart-item-placeholder-${item._id}`}
                            ></div>
                          )}
                          <span
                            className="px-2"
                            id={`cart-item-name-${item._id}`}
                          >
                            {item.name} {item.color} {item.size}
                          </span>
                        </Link>
                      </div>
                    </td>
                    <td id={`cart-item-quantity-${item._id}`}>
                      <div className="w-48 h-12 flex items-center">
                        <button
                          className="btn btn-primary w-10"
                          type="button"
                          onClick={() => decrease(item)}
                          id={`cart-item-decrease-${item._id}`}
                        >
                          -
                        </button>
                        <div
                          className="w-12 text-center"
                          id={`cart-item-qty-display-${item._id}`}
                        >
                          {item.qty}
                        </div>
                        <button
                          className="btn btn-primary w-10"
                          type="button"
                          onClick={() => increase(item)}
                          id={`cart-item-increase-${item._id}`}
                        >
                          +
                        </button>
                        <div className="border-l-2 border-gray-200 ml-4 h-full flex items-center px-2">
                          <LuTrash2
                            size={30}
                            className="text-gray-600 hover:cursor-pointer"
                            onClick={() => {
                              removeItem(item);
                            }}
                            id={`cart-item-remove-${item._id}`}
                          />
                        </div>
                      </div>
                    </td>
                    <td id={`cart-item-price-${item._id}`}>${item.price}</td>
                    <td id={`cart-item-total-${item._id}`}>
                      <div className="min-w-20">
                        ${Math.round(item.price * item.qty * 100) / 100}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div id="cart-summary-container">
            <div className="card bg-white shadow-xl" id="cart-summary">
              <div className="card-body" id="cart-summary-body">
                <ul>
                  <li className="mb-4" id="cart-clear-container">
                    <button
                      className="btn btn-secondary"
                      onClick={clear}
                      id="cart-clear-button"
                    >
                      <p className="text-gray-500 font-bold">Clear cart</p>
                      <LuShoppingCart size={25} className="text-gray-500" />
                    </button>
                  </li>
                  <li id="cart-subtotal-container">
                    <div className="pb-3 text-xl" id="cart-subtotal">
                      Subtotal ({items.reduce((a, c) => a + c.qty, 0)}) : $
                      {itemsPrice}
                    </div>
                  </li>
                  <li id="cart-checkout-container">
                    <button
                      onClick={() => router.push("/shipping")}
                      className="btn btn-primary w-full"
                      id="cart-checkout-button"
                    >
                      Proceed to Checkout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
