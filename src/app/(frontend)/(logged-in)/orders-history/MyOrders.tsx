"use client";
import ButtonProductStatus from "@/components/ButtonProductStatus";
import { Order } from "@/lib/models/OrderModel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuArrowRight } from "react-icons/lu";
import useSWR from "swr";

export default function MyOrders() {
  const router = useRouter();
  const { data: orders, error } = useSWR(`/api/orders/mine`);

  if (error) return "An error has occurred.";
  if (!orders) return <span className="loading loading-spinner w-20"></span>;

  return orders.length > 0 ? (
    <table
      className="table bg-white shadow-xl"
      id="src-app-frontend-loggedin-orders-history-table"
    >
      <thead id="src-app-frontend-loggedin-orders-history-thead">
        <tr id="src-app-frontend-loggedin-orders-history-thead-row">
          <th id="src-app-frontend-loggedin-orders-history-th-number">N°</th>
          <th id="src-app-frontend-loggedin-orders-history-th-date">DATE</th>
          <th id="src-app-frontend-loggedin-orders-history-th-total">TOTAL</th>
          <th id="src-app-frontend-loggedin-orders-history-th-paid">PAID</th>
          <th id="src-app-frontend-loggedin-orders-history-th-delivered">
            DELIVERED
          </th>
        </tr>
      </thead>
      <tbody id="src-app-frontend-loggedin-orders-history-tbody">
        {[...orders].reverse().map((order: Order) => (
          <tr
            onClick={() => {
              router.push(`order/${order._id}`);
            }}
            key={order._id}
            className="hover:cursor-pointer hover:bg-slate-50"
            id={`src-app-frontend-loggedin-orders-history-tr-${order._id}`}
          >
            <td
              id={`src-app-frontend-loggedin-orders-history-order-number-${order._id}`}
            >
              {order.orderNumber}
            </td>
            <td
              id={`src-app-frontend-loggedin-orders-history-order-date-${order._id}`}
            >
              {order.createdAt.split("T")[0]}
            </td>
            <td
              id={`src-app-frontend-loggedin-orders-history-order-total-${order._id}`}
            >
              ${order.totalPrice}
            </td>
            <td
              id={`src-app-frontend-loggedin-orders-history-order-paid-${order._id}`}
            >
              <ButtonProductStatus
                type="pay"
                paidAt={order.paidAt}
                isPaid={order.isPaid}
                id={`src-app-frontend-loggedin-orders-history-order-paid-status-${order._id}`}
              />
            </td>
            <td
              id={`src-app-frontend-loggedin-orders-history-order-delivered-${order._id}`}
            >
              <ButtonProductStatus
                type="ship"
                isDelivered={order.isDelivered}
                isPaid={order.isPaid}
                deliveredAt={order.deliveredAt}
                id={`src-app-frontend-loggedin-orders-history-order-delivered-status-${order._id}`}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div
      className="w-full h-full flex justify-center items-center"
      id="src-app-frontend-loggedin-orders-history-empty"
    >
      <div
        className="card bg-white shadow-xl max-w-60 p-4 flex flex-col"
        id="src-app-frontend-loggedin-orders-history-empty-card"
      >
        <h2
          className="card-title"
          id="src-app-frontend-loggedin-orders-history-empty-title"
        >
          No orders yet!
        </h2>
        <Link href="/">
          <button
            className="btn btn-primary mt-4"
            id="src-app-frontend-loggedin-orders-history-empty-button"
          >
            Go shopping! <LuArrowRight size={25} />
          </button>
        </Link>
      </div>
    </div>
  );
}
