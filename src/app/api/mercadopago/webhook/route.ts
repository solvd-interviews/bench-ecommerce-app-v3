import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import MercadoPagoConfig from "mercadopago";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get("id");

    const mpClient = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    });

    try {
      const response = await fetch(
        "https://api.mercadopago.com/v1/payments/" + id,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + mpClient.accessToken,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        const { status, status_detail, external_reference } = data;

        if (status === "approved" && status_detail === "accredited") {
          await dbConnect();

          // Find the order using the external_reference which should be the order ID
          const order = await OrderModel.findById(external_reference);

          if (!order) {
            return NextResponse.json(
              { message: "Order not found" },
              { status: 404 }
            );
          }

          // Step 4: Mark the order as paid
          order.isPaid = true;
          order.paidAt = new Date();
          await order.save();

          return NextResponse.json(
            { message: "Order marked as paid" },
            { status: 200 }
          );
        }
      }
    } catch (error) {
      throw new Error("There was an error receiving the webhook");
    }

    return new NextResponse(
      JSON.stringify({ message: "webhook running correctly" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error handling upload:", error);
    return NextResponse.json(
      { message: "Internal server error", error: JSON.stringify(error) },
      { status: 500 }
    );
  }
};
