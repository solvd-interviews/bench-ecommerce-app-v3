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

  console.log("orders:_ ", orders);

  if (error) return "An error has occurred.";
  if (!orders) return <span className="loading loading-spinner w-20"></span>;

  return orders.length > 0 ? (
    <table className="table bg-white shadow-xl">
      <thead>
        <tr>
          <th>N°</th>
          <th>DATE</th>
          <th>TOTAL</th>
          <th>PAID</th>
          <th>DELIVERED</th>
          {/*           <th>ACTION</th>
           */}{" "}
        </tr>
      </thead>
      <tbody>
        {[...orders].reverse().map((order: Order) => (
          <tr
            onClick={() => {
              router.push(`order/${order._id}`);
            }}
            key={order._id}
            className="hover:cursor-pointer  hover:bg-slate-50"
          >
            <td>{order.orderNumber}</td>
            <td>{order.createdAt.split("T")[0]}</td>
            <td>${order.totalPrice}</td>
            <td>
              <ButtonProductStatus
                type="pay"
                paidAt={order.paidAt}
                isPaid={order.isPaid}
              />
            </td>
            <td>
              <ButtonProductStatus
                type="ship"
                isDelivered={order.isDelivered}
                isPaid={order.isPaid}
                deliveredAt={order.deliveredAt}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className="w-full h-full flex justify-center items-center">
      <div className="card bg-white shadow-xl max-w-60 p-4 flex flex-col">
        <h2 className="card-title ">No orders yet! </h2>
        <Link href="/">
          <button className="btn btn-primary mt-4">
            Go shopping! <LuArrowRight size={25} />
          </button>
        </Link>
      </div>
    </div>
  );
}
