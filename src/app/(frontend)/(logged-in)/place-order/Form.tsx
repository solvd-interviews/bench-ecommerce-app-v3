"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCartService from "@/lib/hooks/useCartStore";
import { CheckoutSteps } from "@/components/CheckoutSteps";
import Link from "next/link";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import SummaryProd from "@/components/SummaryProd";

const Form = () => {
  const router = useRouter();
  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    clear,
  } = useCartService();

  const { trigger: placeOrder, isMutating: isPlacing } = useSWRMutation(
    `/api/orders/mine`,
    async (url) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod,
          shippingAddress,
          items,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        clear();
        toast.success("Order placed successfully");
        return router.push(`/order/${data.order._id}`);
      } else {
        toast.error(data.message);
      }
    }
  );

  useEffect(() => {
    if (!paymentMethod) {
      return router.push("/payment");
    }
    if (items.length === 0) {
      return router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentMethod, router]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <div id="src-app-frontend-loggedin-placeorder-form-container">
      <CheckoutSteps current={4} />

      <div
        className="grid gap-4 md:grid-cols-4 md:gap-5 my-4"
        id="src-app-frontend-loggedin-placeorder-grid"
      >
        <div
          className="overflow-x-auto md:col-span-3"
          id="src-app-frontend-loggedin-placeorder-details-container"
        >
          <div
            className="card bg-white shadow-xl"
            id="src-app-frontend-loggedin-placeorder-shipping-card"
          >
            <div
              className="card-body"
              id="src-app-frontend-loggedin-placeorder-shipping-card-body"
            >
              <h2
                className="card-title"
                id="src-app-frontend-loggedin-placeorder-shipping-title"
              >
                Shipping Address
              </h2>
              <p id="src-app-frontend-loggedin-placeorder-shipping-name">
                {shippingAddress.fullName}
              </p>
              <p id="src-app-frontend-loggedin-placeorder-shipping-address">
                {shippingAddress.address}, {shippingAddress.city},{" "}
                {shippingAddress.postalCode}, {shippingAddress.country}{" "}
              </p>
              <div id="src-app-frontend-loggedin-placeorder-shipping-edit-button-container">
                <Link
                  className="btn btn-primary"
                  href="/shipping"
                  id="src-app-frontend-loggedin-placeorder-shipping-edit-button"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <div
            className="card bg-white shadow-xl mt-4"
            id="src-app-frontend-loggedin-placeorder-payment-card"
          >
            <div
              className="card-body"
              id="src-app-frontend-loggedin-placeorder-payment-card-body"
            >
              <h2
                className="card-title"
                id="src-app-frontend-loggedin-placeorder-payment-title"
              >
                Payment Method
              </h2>
              <p id="src-app-frontend-loggedin-placeorder-payment-method">
                {paymentMethod}
              </p>
              <div id="src-app-frontend-loggedin-placeorder-payment-edit-button-container">
                <Link
                  className="btn btn-primary"
                  href="/payment"
                  id="src-app-frontend-loggedin-placeorder-payment-edit-button"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
          <SummaryProd items={items} itemsPrice={itemsPrice} edit={true} />
        </div>
        <div id="src-app-frontend-loggedin-placeorder-summary-container">
          <div
            className="card bg-white shadow-xl px-3"
            id="src-app-frontend-loggedin-placeorder-summary-card"
          >
            <div
              className="card-body"
              id="src-app-frontend-loggedin-placeorder-summary-card-body"
            >
              <h2
                className="card-title"
                id="src-app-frontend-loggedin-placeorder-summary-title"
              >
                Order Summary
              </h2>
              <ul
                className="space-y-3"
                id="src-app-frontend-loggedin-placeorder-summary-list"
              >
                <li id="src-app-frontend-loggedin-placeorder-summary-items">
                  <div className=" flex justify-between">
                    <div id="src-app-frontend-loggedin-placeorder-summary-items-label">
                      Items{" "}
                    </div>
                    <div id="src-app-frontend-loggedin-placeorder-summary-items-price">{`  ${itemsPrice}`}</div>
                  </div>
                </li>
                <li id="src-app-frontend-loggedin-placeorder-summary-tax">
                  <div className=" flex justify-between">
                    <div id="src-app-frontend-loggedin-placeorder-summary-tax-label">
                      Tax{" "}
                    </div>
                    <div id="src-app-frontend-loggedin-placeorder-summary-tax-price">{`  ${taxPrice}`}</div>
                  </div>
                </li>
                <li id="src-app-frontend-loggedin-placeorder-summary-shipping">
                  <div className=" flex justify-between">
                    <div id="src-app-frontend-loggedin-placeorder-summary-shipping-label">
                      Shipping{" "}
                    </div>
                    <div id="src-app-frontend-loggedin-placeorder-summary-shipping-price">{`  ${shippingPrice}`}</div>
                  </div>
                </li>
                <li id="src-app-frontend-loggedin-placeorder-summary-total">
                  <div className=" flex justify-between">
                    <div id="src-app-frontend-loggedin-placeorder-summary-total-label">
                      Total{" "}
                    </div>
                    <div id="src-app-frontend-loggedin-placeorder-summary-total-price">{`  ${totalPrice}`}</div>
                  </div>
                </li>

                <li id="src-app-frontend-loggedin-placeorder-summary-placeorder-button-container">
                  <button
                    onClick={() => placeOrder()}
                    disabled={isPlacing}
                    className="btn btn-primary w-full"
                    id="src-app-frontend-loggedin-placeorder-summary-placeorder-button"
                  >
                    {isPlacing && (
                      <span
                        className="loading loading-spinner"
                        id="src-app-frontend-loggedin-placeorder-summary-placeorder-spinner"
                      ></span>
                    )}
                    Place Order
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
