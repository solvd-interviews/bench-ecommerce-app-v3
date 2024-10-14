export const tablePropertyAndSkeletonArr: {
  label: string;
  prop: string;
  skeletonStyle: string;
  skeletonQuantity: number;
}[] = [
  {
    label: "Id",
    prop: "orderNumber",
    skeletonStyle: "h-4 w-4",
    skeletonQuantity: 1,
  },

  {
    label: "Name",
    prop: "name",
    skeletonStyle: "h-4 w-56",
    skeletonQuantity: 1,
  },
  {
    label: "Description",
    prop: "description",
    skeletonStyle: "h-4 w-56",
    skeletonQuantity: 1,
  },
  {
    label: "Color",
    prop: "color",
    skeletonStyle: "h-4 w-56",
    skeletonQuantity: 1,
  },
  {
    label: "Created At",
    prop: "created_at",
    skeletonStyle: "h-4 w-56",
    skeletonQuantity: 1,
  },

  {
    label: "Actions",
    prop: "",
    skeletonStyle: "h-10 w-20",
    skeletonQuantity: 1,
  },
];
