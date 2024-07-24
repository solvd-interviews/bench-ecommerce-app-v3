import { Metadata } from "next";
import Form from "./Form";

export const metadata: Metadata = {
  title: "Shipping Address",
};

export default async function ShippingPage() {
  return (
    <div className="p-4">
      <Form />
    </div>
  );
}
