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
    prop: "userNumber",
    defOrder: "desc",
    logic: true,
    icon: "number",
    skeletonStyle: "h-4 w-4",
    skeletonQuantity: 1,
  },
  /* {
    label: "Content",
    logic: false,
    prop: "",
    defOrder: "asc",
    skeletonStyle: "h-20 w-24",
    skeletonQuantity: 1,
  }, */
  {
    label: "Name",
    prop: "name",
    defOrder: "asc",
    logic: true,
    icon: "str",
    skeletonStyle: "h-4 w-56",
    skeletonQuantity: 1,
  },
  {
    label: "Email",
    prop: "email",
    defOrder: "asc",
    logic: false,
    icon: "str",
    skeletonStyle: "h-4 w-56",
    skeletonQuantity: 3,
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
    label: "Updated At",
    prop: "updatedAt",
    defOrder: "desc",
    logic: true,
    icon: "str",
    skeletonStyle: "h-4 w-20",
    skeletonQuantity: 1,
  },
  {
    label: "Status",
    logic: false,
    prop: "",
    defOrder: "asc",
    skeletonStyle: "h-7 w-12",
    skeletonQuantity: 1,
  },

  /* {
    label: "Price",
    prop: "price",
    defOrder: "asc",
    logic: true,
    icon: "number",
    skeletonStyle: "h-4 w-10",
    skeletonQuantity: 1,
  },
  {
    label: "Stock",
    prop: "stock",
    defOrder: "asc",
    logic: true,
    icon: "number",
    skeletonStyle: "h-4 w-10",
    skeletonQuantity: 1,
  }, */
  {
    label: "Blocked",
    prop: "isBlocked",
    defOrder: "asc",
    logic: true,
    icon: "str",
    skeletonStyle: "h-7 w-12",
    skeletonQuantity: 1,
  },
  {
    label: "Admin",
    prop: "isAdmin",
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
    skeletonQuantity: 2,
  },
];
