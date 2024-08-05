"use client";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { User } from "@/lib/models/UserModel";
import SummaryProd from "@/components/SummaryProd";
import ButtonProductStatus from "@/components/ButtonProductStatus";

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string;
  paypalClientId: string;
}) {
  const { data: session } = useSession();

  const user = session?.user as User | undefined;

  const { data, error } = useSWR(`/api/orders/${orderId}`);

  const { trigger: payOrder, isMutating: isPaying } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`${url}/pay`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Order paid successfully");
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    }
  );
  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`${url}/deliver`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      res.ok
        ? toast.success("Order delivered successfully")
        : toast.error(data.message);
    }
  );

  if (error) return error.message;
  if (!data || !session)
    return <span className="loading loading-spinner w-20"></span>;

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
    orderNumber,
  } = data;

  function createPayPalOrder() {
    return fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((order) => order.id);
  }
  function onApprovePayPalOrder(data: any) {
    return fetch(`/api/orders/${orderId}/capture-paypal-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((orderData) => {
        toast.success("Order paid successfully");
      });
  }
  return (
    <div className=" p-4">
      <h1 className="text-2xl ">Order N° {orderNumber}</h1>
      <div className="grid gap-4 md:grid-cols-6 md:gap-5 my-4 ">
        <div className="md:col-span-3 lg:col-span-4 overflow-x-auto pb-8">
          <div className="card bg-white shadow-xl  ">
            <div className="card-body">
              <h2 className="card-title">Payment Method</h2>
              <p>{paymentMethod}</p>
              <ButtonProductStatus type="pay" isPaid={isPaid} paidAt={paidAt} />
            </div>
          </div>
          <div className="card bg-white shadow-xl mt-4 ">
            <div className="card-body">
              <h2 className="card-title">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}{" "}
              </p>
              <ButtonProductStatus
                type="ship"
                isPaid={isPaid}
                isDelivered={isDelivered}
                deliveredAt={deliveredAt}
              />
            </div>
          </div>
          <SummaryProd items={items} itemsPrice={itemsPrice} />
        </div>
        <div className="md:col-span-3 lg:col-span-2 ">
          <div className="card bg-white shadow-xl overflow-auto p-2">
            <div className="card-body">
              <h2 className="card-title">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
                <div className="mt-5">
                  {!isPaid && paymentMethod === "PayPal" && (
                    <PayPalScriptProvider
                      options={{ clientId: paypalClientId }}
                    >
                      <PayPalButtons
                        createOrder={createPayPalOrder}
                        onApprove={onApprovePayPalOrder}
                      />
                    </PayPalScriptProvider>
                  )}
                </div>
                {user && user.isAdmin && (
                  <div className="mt-10 py-7 border-t-2 border-gray-400 flex flex-col gap-2">
                    <button
                      onClick={() => payOrder()}
                      disabled={isPaying}
                      className="btn btn-primary    "
                    >
                      {isPaying && (
                        <span className="loading loading-spinner"></span>
                      )}
                      ADMIN | Mark as paid
                    </button>

                    <button
                      className="btn btn-primary  "
                      onClick={() => deliverOrder()}
                      disabled={isDelivering}
                    >
                      {isDelivering && (
                        <span className="loading loading-spinner"></span>
                      )}
                      ADMIN | Mark as delivered
                    </button>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
