import { Metadata } from "next";
import Form from "./Form";

export const metadata: Metadata = {
  title: "Payment Method",
};

export default async function PaymentPage() {
  return (
    <div className="p-4">
      <Form />
    </div>
  );
}
