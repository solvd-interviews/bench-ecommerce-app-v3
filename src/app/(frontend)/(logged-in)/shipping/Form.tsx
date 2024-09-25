"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, ValidationRule } from "react-hook-form";
import useCartService from "@/lib/hooks/useCartStore";
import { CheckoutSteps } from "@/components/CheckoutSteps";
import { ShippingAddress } from "@/lib/models/OrderModel";

const Form = () => {
  const router = useRouter();
  const { saveShippingAddress, shippingAddress } = useCartService();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddress>({
    defaultValues: {
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  });

  useEffect(() => {
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("country", shippingAddress.country);
  }, [setValue, shippingAddress]);

  const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
    saveShippingAddress(form);
    router.push("/payment");
  };

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof ShippingAddress;
    name: string;
    required?: boolean;
    pattern?: ValidationRule<RegExp>;
  }) => (
    <div className="mb-2" id={`form-input-${id}`}>
      <label className="label" htmlFor={id}>
        {name}
      </label>
      <input
        type="text"
        id={id}
        {...register(id, {
          required: required && `${name} is required`,
          pattern,
        })}
        className="input input-bordered w-full max-w-sm"
      />
      {errors[id]?.message && (
        <div className="text-error" id={`error-${id}`}>
          {errors[id]?.message}
        </div>
      )}
    </div>
  );

  return (
    <div id="src-app-frontend-loggedin-shipping-form-container">
      <CheckoutSteps current={1} />

      <div
        className="max-w-sm mx-auto card bg-white shadow-xl my-4"
        id="src-app-frontend-loggedin-shipping-card"
      >
        <div
          className="card-body"
          id="src-app-frontend-loggedin-shipping-card-body"
        >
          <h1
            className="card-title"
            id="src-app-frontend-loggedin-shipping-title"
          >
            Shipping Address
          </h1>
          <form
            onSubmit={handleSubmit(formSubmit)}
            id="src-app-frontend-loggedin-shipping-form"
          >
            <FormInput name="Full Name" id="fullName" required />
            <FormInput name="Address" id="address" required />
            <FormInput name="City" id="city" required />
            <FormInput name="Postal Code" id="postalCode" required />
            <FormInput name="Country" id="country" required />
            <div
              className="my-2"
              id="src-app-frontend-loggedin-shipping-submit-button-container"
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
                id="src-app-frontend-loggedin-shipping-submit-button"
              >
                {isSubmitting && (
                  <span
                    className="loading loading-spinner"
                    id="src-app-frontend-loggedin-shipping-submit-spinner"
                  ></span>
                )}
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
