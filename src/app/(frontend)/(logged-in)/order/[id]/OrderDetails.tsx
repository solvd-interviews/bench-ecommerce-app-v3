"use client";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { User } from "@/lib/models/UserModel";
import SummaryProd from "@/components/SummaryProd";
import ButtonProductStatus from "@/components/ButtonProductStatus";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useEffect, useState } from "react";

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string;
  paypalClientId: string;
}) {
  initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!);
  const [preferenceId, setPreferenceId] = useState(null);

  const { data: session } = useSession();

  const user = session?.user as User | undefined;

  const { data, error, mutate } = useSWR(`/api/orders/${orderId}`);

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
        const mutated = await mutate(`/api/orders/${orderId}`, {
          revalidate: true,
        });
        console.log("mutated", mutated);
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

  useEffect(() => {
    if (data?.paymentMethod === "MercadoPago" && !data?.isPaid) {
      fetch(`/api/mercadopago/create-order/${orderId}`, { method: "POST" })
        .then((res) => {
          return res.json();
        })
        .then((resJson) => {
          console.log("resJson is: ", resJson);
          setPreferenceId(resJson.preferenceResponse.id);
        });
    }
  }, [orderId, data]);

  console.log("data, session", data, session);

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
    <div className="p-4" id="src-app-frontend-loggedin-order-container">
      <h1 className="text-2xl" id="src-app-frontend-loggedin-order-heading">
        Order N° {orderNumber}
      </h1>
      <div
        className="grid gap-4 md:grid-cols-6 md:gap-5 my-4"
        id="src-app-frontend-loggedin-order-grid"
      >
        <div
          className="md:col-span-3 lg:col-span-4 overflow-x-auto pb-8"
          id="src-app-frontend-loggedin-order-details-container"
        >
          <div
            className="card bg-white shadow-xl"
            id="src-app-frontend-loggedin-order-payment-card"
          >
            <div
              className="card-body"
              id="src-app-frontend-loggedin-order-payment-card-body"
            >
              <h2
                className="card-title"
                id="src-app-frontend-loggedin-order-payment-title"
              >
                Payment Method
              </h2>
              <p id="src-app-frontend-loggedin-order-payment-method">
                {paymentMethod}
              </p>
              <ButtonProductStatus
                type="pay"
                isPaid={isPaid}
                paidAt={paidAt}
                id="src-app-frontend-loggedin-order-payment-status"
              />
            </div>
          </div>
          <div
            className="card bg-white shadow-xl mt-4"
            id="src-app-frontend-loggedin-order-shipping-card"
          >
            <div
              className="card-body"
              id="src-app-frontend-loggedin-order-shipping-card-body"
            >
              <h2
                className="card-title"
                id="src-app-frontend-loggedin-order-shipping-title"
              >
                Shipping Address
              </h2>
              <p id="src-app-frontend-loggedin-order-shipping-name">
                {shippingAddress.fullName}
              </p>
              <p id="src-app-frontend-loggedin-order-shipping-address">
                {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              <ButtonProductStatus
                type="ship"
                isPaid={isPaid}
                isDelivered={isDelivered}
                deliveredAt={deliveredAt}
                id="src-app-frontend-loggedin-order-shipping-status"
              />
            </div>
          </div>
          <SummaryProd items={items} itemsPrice={itemsPrice} />
        </div>
        <div
          className="md:col-span-3 lg:col-span-2"
          id="src-app-frontend-loggedin-order-summary-container"
        >
          <div
            className="card bg-white shadow-xl overflow-auto p-2"
            id="src-app-frontend-loggedin-order-summary-card"
          >
            <div
              className="card-body"
              id="src-app-frontend-loggedin-order-summary-card-body"
            >
              <h2
                className="card-title"
                id="src-app-frontend-loggedin-order-summary-title"
              >
                Order Summary
              </h2>
              <ul id="src-app-frontend-loggedin-order-summary-list">
                <li id="src-app-frontend-loggedin-order-summary-items">
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>
                <li id="src-app-frontend-loggedin-order-summary-tax">
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li id="src-app-frontend-loggedin-order-summary-shipping">
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li id="src-app-frontend-loggedin-order-summary-total">
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
                <div
                  className="mt-5"
                  id="src-app-frontend-loggedin-order-paypal"
                >
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
                  {!isPaid &&
                    paymentMethod === "MercadoPago" &&
                    preferenceId && (
                      <Wallet
                        initialization={{
                          preferenceId: preferenceId,
                          redirectMode: "blank",
                        }}
                        customization={{ texts: { valueProp: "smart_option" } }}
                      />
                    )}
                </div>
                {user && user.isAdmin && (
                  <div
                    className="mt-10 py-7 border-t-2 border-gray-400 flex flex-col gap-2"
                    id="src-app-frontend-loggedin-order-admin-actions"
                  >
                    <button
                      onClick={() => payOrder()}
                      disabled={isPaying}
                      className="btn btn-primary"
                      id="src-app-frontend-loggedin-order-mark-as-paid"
                    >
                      {isPaying && (
                        <span
                          className="loading loading-spinner"
                          id="src-app-frontend-loggedin-order-paying-spinner"
                        ></span>
                      )}
                      ADMIN | Mark as paid
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={() => deliverOrder()}
                      disabled={isDelivering}
                      id="src-app-frontend-loggedin-order-mark-as-delivered"
                    >
                      {isDelivering && (
                        <span
                          className="loading loading-spinner"
                          id="src-app-frontend-loggedin-order-delivering-spinner"
                        ></span>
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
