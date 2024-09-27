import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import mongoose from "mongoose";
import OrderModel, { Order, OrderItem } from "@/lib/models/OrderModel";

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    if (!params.id || !mongoose.Types.ObjectId.isValid(params.id)) {
      return new NextResponse(
        JSON.stringify({ message: "Order id not correct" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    await dbConnect();
    const order = await OrderModel.findById(params.id);

    const resDolarBlue = await fetch("https://dolarapi.com/v1/dolares/blue");
    const resDolarBlueJson = await resDolarBlue.json();
    const blueDolarPriceInArs = parseFloat(resDolarBlueJson.venta);

    const orderItemsToPreference: {
      title: string;
      quantity: number;
      unit_price: number;
      id: string;
    }[] = order.items.map((item: OrderItem) => {
      return {
        title: item.name,
        quantity: item.qty,
        unit_price: item.price * blueDolarPriceInArs,
        id: item._id,
      };
    });

    // Step 2: Initialize the client object
    const mpClient = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
    });

    const preference = new Preference(mpClient);

    const { protocol, host } = new URL(request.url);
    const baseUrl = `${protocol}//${host}`;

    const preferenceResponse = await preference.create({
      body: {
        items: orderItemsToPreference,
        back_urls: {
          success: `${baseUrl}/api/orders/pay/${order._id}`,
          failure: "",
          pending: "",
        },
      },
    });
    console.log(
      "url to succesfully redirect is: ",
      `https://bench-ecommerce-app-v3.vercel.app/api/orders/pay/${order._id}`
    );

    return new NextResponse(JSON.stringify({ preferenceResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error handling upload:", error);
    return NextResponse.json(
      { message: "Internal server error", error: JSON.stringify(error) },
      { status: 500 }
    );
  }
};
