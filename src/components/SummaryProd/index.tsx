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
    <div
      className="card bg-white shadow-xl mt-4 overflow-hidden"
      id="summary-prod-card"
    >
      <div className="card-body overflow-auto">
        <h2 className="card-title" id="summary-prod-title">
          Items
        </h2>
        <table className="table" id="summary-prod-table">
          <thead>
            <tr>
              <th id="summary-prod-item-header">Item</th>
              <th id="summary-prod-quantity-header">Quantity</th>
              <th id="summary-prod-price-header">Price</th>
              <th id="summary-prod-total-header">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: OrderItem) => (
              <tr key={item._id} id={`summary-prod-row-${item._id}`}>
                <td>
                  <Link
                    href={`/${item._id}`}
                    className="flex items-center min-w-28"
                    id={`summary-prod-link-${item._id}`}
                  >
                    <Image
                      src={item.image || ""}
                      alt={item.name}
                      width={50}
                      height={50}
                      id={`summary-prod-image-${item._id}`}
                    />
                    <span className="px-2" id={`summary-prod-name-${item._id}`}>
                      {item.name}
                    </span>
                  </Link>
                </td>
                <td id={`summary-prod-quantity-${item._id}`}>{item.qty}</td>
                <td id={`summary-prod-price-${item._id}`}>${item.price}</td>
                <td id={`summary-prod-total-${item._id}`}>
                  ${item.price * item.qty}
                </td>
              </tr>
            ))}
            <tr id="summary-prod-total-row">
              <td></td>
              <td></td>
              <td></td>
              <td className="pt-8" id="summary-prod-items-price">
                ${itemsPrice}
              </td>
            </tr>
          </tbody>
        </table>
        {edit && (
          <div id="summary-prod-edit-button">
            <Link
              className="btn btn-primary"
              href="/cart"
              id="summary-prod-edit-link"
            >
              Edit
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryProd;
