import { config } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import OrderModel from "@/lib/models/OrderModel";
import { paypal } from "@/lib/paypal";
import { getServerSession } from "next-auth";

export const POST = async (
  req: any,
  { params }: { params: { id: string } }
) => {
  const { user } = await getServerSession(config);

  if (!user) {
    return Response.json(
      { message: "unauthorized" },
      {
        status: 401,
      }
    );
  }
  try {
    await dbConnect();

    const order = await OrderModel.findById(params.id);
    if (order) {
      const { orderID } = await req.json();
      const captureData = await paypal.capturePayment(orderID);
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: captureData.id,
        update_time: captureData.update_time,
        email_address: captureData.payer.email_address,
      };
      
      const updatedOrder = await order.save();
      return Response.json(updatedOrder);
    } else {
      return Response.json(
        { message: "Order not found" },
        {
          status: 404,
        }
      );
    }
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
};
