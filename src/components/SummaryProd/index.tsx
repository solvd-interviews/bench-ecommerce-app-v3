import { OrderItem } from "@/lib/models/OrderModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SummaryProd = ({
  edit = false,
  items,
  itemsPrice,
}: {
  edit?: boolean;
  items: OrderItem[];
  itemsPrice: number;
}) => {
  return (
    <div className="card bg-white shadow-xl mt-4 overflow-hidden">
      <div className="card-body overflow-auto">
        <h2 className="card-title">Items</h2>
        <table className="table ">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: OrderItem) => (
              <tr key={item._id}>
                <td>
                  <Link
                    href={`/product/${item._id}`}
                    className="flex items-center min-w-28"
                  >
                    <Image
                      src={item.image || ""}
                      alt={item.name}
                      width={50}
                      height={50}
                    ></Image>
                    <span className="px-2">{item.name}</span>
                  </Link>
                </td>
                <td>{item.qty}</td>
                <td>${item.price}</td>
                <td>${item.price * item.qty}</td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td className="pt-8">${itemsPrice}</td>
            </tr>
          </tbody>
        </table>
        {edit && (
          <div>
            <Link className="btn btn-primary" href="/cart">
              Edit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryProd;
