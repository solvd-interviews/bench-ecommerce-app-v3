import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
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
    const noti_url = process.env.NGROK_URL || `${protocol}//${host}`;

    const preferenceResponse = await preference.create({
      body: {
        items: orderItemsToPreference,
        back_urls: {
          success: `${baseUrl}/order/${order._id}`,
          failure: `${baseUrl}/order/${order._id}`,
          pending: `${baseUrl}/order/${order._id}`,
        },
        notification_url: `${noti_url}/api/mercadopago/webhook`,
        external_reference: order._id.toString(),

        auto_return: "approved",
      },
    });

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
