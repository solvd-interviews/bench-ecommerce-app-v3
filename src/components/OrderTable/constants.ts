export const tablePropertyAndSkeletonArr: {
  label: string;
  prop: string;
  defOrder: "asc" | "desc";
  logic: boolean;
  icon?: "number" | "str";
  skeletonStyle: string;
  skeletonQuantity: number;
}[] = [
  {
    label: "Id",
    prop: "orderNumber",
    defOrder: "desc",
    logic: true,
    icon: "number",
    skeletonStyle: "h-4 w-4",
    skeletonQuantity: 1,
  },

  {
    label: "Payment Method",
    prop: "paymentMethod",
    defOrder: "asc",
    logic: true,
    icon: "str",
    skeletonStyle: "h-4 w-56",
    skeletonQuantity: 1,
  },
  {
    label: "Items Price",
    prop: "itemsPrice",
    defOrder: "asc",
    logic: true,
    icon: "number",
    skeletonStyle: "h-4 w-56",
    skeletonQuantity: 1,
  },
  {
    label: "Shipping Price",
    prop: "shippingPrice",
    defOrder: "asc",
    logic: true,
    icon: "number",
    skeletonStyle: "h-4 w-56",
    skeletonQuantity: 1,
  },
  {
    label: "Tax Price",
    prop: "taxPrice",
    defOrder: "asc",
    logic: true,
    icon: "number",
    skeletonStyle: "h-4 w-56",
    skeletonQuantity: 1,
  },
  {
    label: "Total Price",
    prop: "totalPrice",
    defOrder: "asc",
    logic: true,
    icon: "number",
    skeletonStyle: "h-4 w-56",
    skeletonQuantity: 1,
  },
  {
    label: "Paid At",
    prop: "paidAt",
    defOrder: "desc",
    logic: true,
    icon: "str",
    skeletonStyle: "h-4 w-20",
    skeletonQuantity: 1,
  },
  {
    label: "Created At",
    prop: "createdAt",
    defOrder: "desc",
    logic: true,
    icon: "str",
    skeletonStyle: "h-4 w-20",
    skeletonQuantity: 1,
  },
  {
    label: "Delivered",
    prop: "isDelivered",
    defOrder: "asc",
    logic: true,
    icon: "str",
    skeletonStyle: "h-7 w-12",
    skeletonQuantity: 1,
  },
  {
    label: "Paid",
    prop: "isPaid",
    defOrder: "asc",
    logic: true,
    icon: "str",
    skeletonStyle: "h-7 w-12",
    skeletonQuantity: 1,
  },

  {
    label: "Actions",
    logic: false,
    prop: "",
    defOrder: "asc",
    skeletonStyle: "h-10 w-20",
    skeletonQuantity: 1,
  },
];
