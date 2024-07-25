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

  /* if (!mounted)
    return <span className="loading loading-spinner w-28 m-9"></span>; */
  if (!mounted) return <></>;

  return (
    <>
      <h1 className="py-2 text-2xl w-full mb-5 ">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="flex items-center gap-4">
          <h2 className="text-2xl ">Cart is empty! </h2>
          <Link href="/">
            <button className="btn btn-primary">
              Go shopping! <LuArrowRight size={25} />
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5 gap-2">
          <div className="overflow-x-auto md:col-span-3">
            <table className="table shadow-xl">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody className="">
                {items.map((item) => (
                  <tr key={item._id} className="bg-white">
                    <td>
                      <div className="h-20 min-w-40 flex items-center">
                        <Link
                          href={`/${item._id}`}
                          className="flex items-center"
                        >
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                          ) : (
                            <div className="w-28 h-28 bg-slate-200"></div>
                          )}

                          <span className="px-2">
                            {item.name} {item.color} {item.size}
                          </span>
                        </Link>
                      </div>
                    </td>
                    <td>
                      <div className="w-48 h-12 flex items-center">
                        <button
                          className="btn btn-primary w-10"
                          type="button"
                          onClick={() => decrease(item)}
                        >
                          -
                        </button>
                        <div className="w-12 text-center">{item.qty}</div>
                        <button
                          className="btn btn-primary w-10"
                          type="button"
                          onClick={() => increase(item)}
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
                          />
                        </div>
                      </div>
                    </td>
                    <td>${item.price}</td>
                    <td>
                      <div className="min-w-20">
                        ${Math.round(item.price * item.qty * 100) / 100}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="card bg-white shadow-xl ">
              <div className="card-body">
                <ul>
                  <li className="mb-4">
                    <button className="btn btn-secondary  " onClick={clear}>
                      <p className="text-gray-500 font-bold">Clear cart</p>{" "}
                      <LuShoppingCart size={25} className="text-gray-500" />
                    </button>
                  </li>
                  <li>
                    <div className="pb-3 text-xl">
                      Subtotal ({items.reduce((a, c) => a + c.qty, 0)}) : $
                      {itemsPrice}
                    </div>
                  </li>
                  <li>
                    <button
                      onClick={() => router.push("/shipping")}
                      className="btn btn-primary w-full"
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
