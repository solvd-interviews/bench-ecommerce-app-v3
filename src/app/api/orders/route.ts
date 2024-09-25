import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/lib/models/ProductModel";
import OrderModel, { OrderItem } from "@/lib/models/OrderModel";
import { round2 } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { config } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

import { fetchOrdersPagination } from "@/lib/utils/orders";

export const POST = async (req: any) => {
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
    const payload = await req.json();
    await dbConnect();
    const dbProductPrices = await ProductModel.find(
      {
        _id: { $in: payload.items.map((x: { _id: string }) => x._id) },
      },
      "price"
    );
    const dbOrderItems = payload.items.map((x: { _id: string }) => ({
      ...x,
      product: x._id,
      price: dbProductPrices.find((p) => x._id.toString() === p._id.toString())
        .price,
      _id: undefined,
    }));
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);
    const newOrder = new OrderModel({
      items: dbOrderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      user: user._id,
    });

    const createdOrder = await newOrder.save();
    return Response.json(
      { message: "Order has been created", order: createdOrder },
      {
        status: 201,
      }
    );
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    );
  }
};

const calcPrices = (orderItems: OrderItem[]) => {
  // Calculate the items price
  const itemsPrice = round2(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  // Calculate the shipping price
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  // Calculate the tax price
  const taxPrice = round2(Number((0.15 * itemsPrice).toFixed(2)));
  // Calculate the total price
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

export interface MongoFilterOrder {
  orderNumber: { $eq: number };
  createdAt: { $gte: Date };
  updatedAt: { $gte: Date };
  paidAt: { $gte: Date };
  paymentMethod: { $regex: string; $options: string };
  itemsPrice: { $eq: number };
  shippingPrice: { $eq: number };
  totalPrice: { $eq: number };
  taxPrice: { $eq: number };
  isPaid: boolean;
  isDelivered: boolean;
  $expr: {
    $eq: [{ $floor: string }, number];
  };
}

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "10");
  const page = parseInt(searchParams.get("page") || "1");
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  if (!limit || !page || !sort || !order) {
    return NextResponse.json(
      { error: "The params are wrong" },
      { status: 400 }
    );
  }

  const query: Partial<MongoFilterOrder> = {};

  const paymentMethod = searchParams.get("paymentMethod");
  console.log("paymentMethod ", paymentMethod);
  if (paymentMethod) {
    query["paymentMethod"] = { $regex: paymentMethod, $options: "i" };
  }

  const itemsPrice = parseFloat(searchParams.get("itemsPrice")!);
  if (!isNaN(itemsPrice)) {
    query["$expr"] = {
      $eq: [{ $floor: "$itemsPrice" }, Math.floor(itemsPrice)],
    };
  }

  const shippingPrice = parseFloat(searchParams.get("shippingPrice")!);
  if (!isNaN(shippingPrice)) {
    query["$expr"] = {
      $eq: [{ $floor: "$shippingPrice" }, Math.floor(shippingPrice)],
    };
  }

  const totalPrice = parseFloat(searchParams.get("totalPrice")!);
  if (!isNaN(totalPrice)) {
    query["$expr"] = {
      $eq: [{ $floor: "$totalPrice" }, Math.floor(totalPrice)],
    };
  }

  const taxPrice = parseFloat(searchParams.get("taxPrice")!);
  if (!isNaN(taxPrice)) {
    query["$expr"] = { $eq: [{ $floor: "$taxPrice" }, Math.floor(taxPrice)] };
  }

  const createDate = searchParams.get("createDate");
  if (createDate) {
    query["createdAt"] = { $gte: new Date(createDate) };
  }

  const updatedDate = searchParams.get("updatedDate");
  if (updatedDate) {
    query["updatedAt"] = { $gte: new Date(updatedDate) };
  }
  const paidAt = searchParams.get("paidDate");
  if (paidAt) {
    query["paidAt"] = { $gte: new Date(paidAt) };
  }

  if (searchParams.has("id")) {
    const id = parseFloat(searchParams.get("id")!);
    if (!isNaN(id)) {
      query["orderNumber"] = { $eq: id };
    }
  }

  const isDelivered = searchParams.get("isDelivered");
  if (isDelivered !== null) {
    query["isDelivered"] = isDelivered === "true";
  }

  const isPaid = searchParams.get("isPaid");
  if (isPaid !== null) {
    query["isPaid"] = isPaid === "true";
  }

  const { orders, totalPages, currentPage } = await fetchOrdersPagination(
    page,
    limit,
    sort,
    order,
    query
  );

  return NextResponse.json(
    { orders, totalPages, currentPage },
    { status: 200 }
  );
};
