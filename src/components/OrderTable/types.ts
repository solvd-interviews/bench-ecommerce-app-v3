import { Order } from "@/lib/models/OrderModel";

export interface OrderTableState {
  isLoading: boolean;
  page: number;
  totalPages: undefined | number;
  currentOrders: Order[];
  limit: number;
  sort: {
    prop: string;
    order: "asc" | "desc";
  };
}

export interface Filter {
  id: number | null;
  createDate: Date | string | null;
  updatedDate: Date | string | null;
  paidDate: Date | string | null;
  totalPrice: number | null;
  shippingPrice: number | null;
  itemsPrice: number | null;
  taxPrice: number | null;
  paymentMethod: string | null;
  isPaid: boolean | null;
  isDelivered: boolean | null;
}
