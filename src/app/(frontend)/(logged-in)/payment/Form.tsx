"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useCartService from "@/lib/hooks/useCartStore";
import { CheckoutSteps } from "@/components/CheckoutSteps";

const Form = () => {
  const router = useRouter();
  const { savePaymentMethod, paymentMethod, shippingAddress } =
    useCartService();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    savePaymentMethod(selectedPaymentMethod);
    router.push("/place-order");
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push("/shipping");
    }
    setSelectedPaymentMethod(paymentMethod || "PayPal");
  }, [paymentMethod, router, shippingAddress.address]);

  return (
    <div id="src-app-frontend-loggedin-payment-form-container">
      <CheckoutSteps current={2} />

      <div
        className="max-w-sm mx-auto card bg-white shadow-xl my-4"
        id="src-app-frontend-loggedin-payment-form-card"
      >
        <div
          className="card-body"
          id="src-app-frontend-loggedin-payment-form-card-body"
        >
          <h1
            className="card-title"
            id="src-app-frontend-loggedin-payment-form-card-title"
          >
            Payment Method
          </h1>
          <form
            onSubmit={handleSubmit}
            id="src-app-frontend-loggedin-payment-form"
          >
            {["PayPal", "MercadoPago"].map((payment) => (
              <div
                key={payment}
                id={`src-app-frontend-loggedin-payment-form-${payment}`}
              >
                <label
                  className="label cursor-pointer"
                  id={`src-app-frontend-loggedin-payment-label-${payment}`}
                >
                  <span
                    className="label-text"
                    id={`src-app-frontend-loggedin-payment-label-text-${payment}`}
                  >
                    {payment}
                  </span>
                  <input
                    type="radio"
                    name="paymentMethod"
                    className="radio"
                    value={payment}
                    checked={selectedPaymentMethod === payment}
                    onChange={() => setSelectedPaymentMethod(payment)}
                    id={`src-app-frontend-loggedin-payment-radio-${payment}`}
                  />
                </label>
              </div>
            ))}

            <div
              className="my-2"
              id="src-app-frontend-loggedin-payment-form-next-button-container"
            >
              <button
                type="submit"
                className="btn btn-primary w-full"
                id="src-app-frontend-loggedin-payment-form-next-button"
              >
                Next
              </button>
            </div>
            <div
              className="my-2"
              id="src-app-frontend-loggedin-payment-form-back-button-container"
            >
              <button
                type="button"
                className="btn w-full my-2"
                onClick={() => router.back()}
                id="src-app-frontend-loggedin-payment-form-back-button"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
