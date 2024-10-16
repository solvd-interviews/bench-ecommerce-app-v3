"use client";
import { useState, useEffect, useCallback } from "react";
import Pagination from "../Pagination";
import Accordion from "../Accordion";
import { toast } from "sonner";
import { LuTrash2 } from "react-icons/lu";
import { Filter, OrderTableState } from "./types";
import { tablePropertyAndSkeletonArr } from "./constants";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import FormMarkup from "./FormMarkup";

const defaultValues = {
  id: null as number | null,
  itemsPrice: null as number | null,
  taxPrice: null as number | null,
  shippingPrice: null as number | null,
  totalPrice: null as number | null,
  createDate: null as string | null,
  updatedDate: null as string | null,
  paidDate: null as string | null,
  paymentMethod: "PayPal" as string | null,
  isDelivered: false,
  isPaid: false,
};

const OrderTable = () => {
  const [tableState, setTableState] = useState<OrderTableState>({
    isLoading: true,
    page: 1,
    totalPages: undefined,
    currentOrders: [],
    limit: 5,
    sort: {
      prop: "orderNumber",
      order: "desc",
    },
  });
  const [filters, setFilters] = useState(defaultValues);

  const {
    isLoading,
    totalPages,
    currentOrders,
    limit,
    sort: { prop, order },
  } = tableState;

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    let newValue: string | number | boolean | null = value;

    if (type === "number") {
      newValue = value === "" ? null : Number(value);
    } else if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      newValue = e.target.checked;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    type FilterAccumulator = Partial<Filter>;

    const cleanFilters = Object.entries(filters).reduce<FilterAccumulator>(
      (acc, [key, value]) => {
        const safeKey = key as keyof Filter;

        // Ensure non-null, non-undefined values are considered
        if (value) {
          switch (safeKey) {
            case "id":
            case "totalPrice":
            case "shippingPrice":
            case "taxPrice":
            case "itemsPrice":
              // Correctly handle number and string types, ensure no trim operation on number
              if (typeof value === "number") {
                acc[safeKey] = value;
              } else if (typeof value === "string") {
                acc[safeKey] = value.trim() ? Number(value.trim()) : null;
              }
              break;
            case "paymentMethod":
              // Ensure the name is treated as a string and passed even if it's an empty string
              if (typeof value === "string") {
                acc[safeKey] = value.trim(); // Remove excess whitespace
              }
              break;
            case "isDelivered":
            case "isPaid":
              // Boolean values do not need trimming or conversion
              acc[safeKey] = Boolean(value);
              break;
            case "createDate":
            case "updatedDate":
            case "paidDate":
              // Handle string type for dates, check and convert only if it's a non-empty string
              if (typeof value === "string" && value.trim()) {
                acc[safeKey] = new Date(value.trim());
              } else {
                acc[safeKey] = null;
              }
              break;
          }
        }
        return acc;
      },
      {}
    );

    fetchOrders(cleanFilters, tableState.sort);
  };

  const fetchOrders = useCallback(
    async (
      filters: Partial<Filter>,
      sorting: { prop: string; order: string }
    ) => {
      setTableState((prevState) => ({ ...prevState, isLoading: true }));

      // Initialize URLSearchParams with mandatory parameters
      const queryParams = new URLSearchParams({
        page: String(tableState.page),
        limit: String(tableState.limit),
        sort: tableState.sort.prop,
        order: tableState.sort.order,
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.set(key, String(value));
        }
      });
      const url = `/api/orders?${queryParams.toString()}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setTableState((prevState) => ({
          ...prevState,
          isLoading: false,
          totalPages: data.totalPages,
          currentOrders: data.orders,
        }));
      } catch (error) {
        toast.error("Failed to fetch orders. Try again later.");
        setTableState((prevState) => ({ ...prevState, isLoading: false }));
      }
    },
    [tableState.page, tableState.limit, tableState.sort]
  );

  const handleDeleteOrder = async (id: string) => {
   
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      return true;
    } catch (error) {
      toast.error("There was an error deleting the order. Try again later.");
      return false;
    }
  };

  const handleDeliverOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/deliver/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      return true;
    } catch (error) {
      toast.error("There was an error editing the order. Try again later.");

      return false;
    }
  };

  const handlePayOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/pay/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      return true;
    } catch (error) {
      toast.error("There was an error editing the order. Try again later.");

      return false;
    }
  };

  useEffect(() => {
    fetchOrders(filters, tableState.sort);
  }, []);

  return (
    <>
      <div
        id="src-components-orderTable-index-mainContainer"
        className="overflow-y-auto h-full bg-white "
      >
        <div
          id="src-components-orderTable-index-mainContainer-filters-container"
          className="filter-section flex justify-around p-3 bg-blue-100 w-full overflow-x-auto "
        >
          <div
            id="src-components-orderTable-index-mainContainer-filters-container-subContainer"
            className="hidden sm:block bg-blue-100"
          >
            <FormMarkup
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              filters={filters}
            />
          </div>
          <div
            className="block sm:hidden w-full"
            id="src-components-orderTable-index-mainContainer-filters-container-subContainer2"
          >
            <Accordion title="Filter options" startsOpen={false}>
              <FormMarkup
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                filters={filters}
              />
            </Accordion>
          </div>
        </div>
        <div className="w-full overflow-x-auto">
          <table
            className="w-full "
            id="src-components-orderTable-index-mainContainer-table"
          >
            <thead id="src-components-orderTable-index-mainContainer-table-thead">
              <tr id="src-components-orderTable-index-mainContainer-table-thead-tr">
                {tablePropertyAndSkeletonArr.map((e, index) => {
                  if (e.logic) {
                    return (
                      <th
                        id={
                          "src-components-orderTable-index-mainContainer-table-thead-tr-th-" +
                          index +
                          1
                        }
                        key={index}
                        className={`py-2 px-4 text-left hover:underline hover:cursor-pointer max-w-32 ${
                          prop === e.prop && "bg-primary text-white"
                        }`}
                        onClick={() => {
                          const newOrder =
                            prop === e.prop
                              ? order === "asc"
                                ? "desc"
                                : "asc"
                              : e.defOrder;

                          setTableState((prevState) => ({
                            ...prevState,
                            sort: {
                              prop: e.prop,
                              order: newOrder,
                            },
                          }));
                          fetchOrders(filters, {
                            prop: e.prop,
                            order: newOrder,
                          });
                        }}
                      >
                        <div
                          className="flex gap-1 justify-between"
                          id={
                            "src-components-orderTable-index-mainContainer-table-thead-tr-th-div-" +
                            index +
                            1
                          }
                        >
                          <p
                            id={
                              "src-components-orderTable-index-mainContainer-table-thead-tr-th-p-" +
                              index +
                              1
                            }
                          >
                            {e.label}
                          </p>
                          {prop === e.prop &&
                            (order === "asc" ? (
                              <IoIosArrowDown
                                size={25}
                                id={
                                  "src-components-orderTable-index-mainContainer-table-thead-tr-th-div-icondown" +
                                  index +
                                  1
                                }
                              />
                            ) : (
                              <IoIosArrowUp
                                size={25}
                                id={
                                  "src-components-orderTable-index-mainContainer-table-thead-tr-th-iconup-" +
                                  index +
                                  1
                                }
                              />
                            ))}
                        </div>
                      </th>
                    );
                  } else {
                    return (
                      <th
                        key={index}
                        className="py-2 px-4 text-left "
                        id={
                          "src-components-orderTable-index-mainContainer-table-thead-tr-th-" +
                          index +
                          1
                        }
                      >
                        {e.label}
                      </th>
                    );
                  }
                })}
              </tr>
            </thead>
            <tbody id="src-components-orderTable-index-mainContainer-table-tbody">
              {isLoading ? (
                Array(limit)
                  .fill(null)
                  .map((_, indexL) => (
                    <tr
                      key={indexL}
                      className="h-32"
                      id={
                        "src-components-orderTable-index-mainContainer-table-tbody-tr-loading-" +
                        indexL
                      }
                    >
                      {tablePropertyAndSkeletonArr.map((e, indexE) => (
                        <td
                          key={indexE}
                          className="py-2 px-4 "
                          id={
                            "src-components-orderTable-index-mainContainer-table-tbody-tr-loading-" +
                            indexL +
                            "-" +
                            indexE
                          }
                        >
                          <div
                            className="flex flex-col gap-1"
                            id={
                              "src-components-orderTable-index-mainContainer-table-tbody-tr-loading-" +
                              indexL +
                              "-" +
                              indexE +
                              "-container"
                            }
                          >
                            {Array(e.skeletonQuantity)
                              .fill(null)
                              .map((_, indexZ) => (
                                <div
                                  key={indexZ}
                                  className={
                                    "skeleton animate-skeleton-fast " +
                                    e.skeletonStyle
                                  }
                                  id={
                                    "src-components-orderTable-index-mainContainer-table-tbody-tr-loading-" +
                                    indexL +
                                    "-" +
                                    indexE +
                                    "-container-skeleton-" +
                                    indexZ
                                  }
                                ></div>
                              ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))
              ) : currentOrders && currentOrders.length > 0 ? (
                currentOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f1f5f8" : "",
                    }}
                    id="src-components-orderTable-index-mainContainer-table-tbody-tr"
                  >
                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrNumber"
                    >
                      {order.orderNumber}
                    </td>
                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrName"
                    >
                      {order.paymentMethod}
                    </td>
                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrEmail"
                    >
                      {order.itemsPrice}
                    </td>
                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrCreated"
                    >
                      {order.shippingPrice}
                    </td>
                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrUpdated"
                    >
                      {order.taxPrice}
                    </td>
                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrUpdated"
                    >
                      {order.totalPrice}
                    </td>
                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrUpdated"
                    >
                      {order.paidAt}
                    </td>
                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrUpdated"
                    >
                      {order.createdAt}
                    </td>

                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrBlockContainer"
                    >
                      <input
                        className="toggle toggle-error"
                        type="checkbox"
                        id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrBlockContainer-input"
                        checked={order.isDelivered}
                        onClick={() => {
                          toast.custom((t) => (
                            <div
                              id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrBlockContainer-alert"
                              className="flex flex-col gap-2 items-center bg-white p-2 rounded-xl shadow-xl border-2 "
                            >
                              <p
                                className="text-lg text-center"
                                id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrBlockContainer-alert-p"
                              >
                                Are you sure you want to mark order{" "}
                                {order.orderNumber} as{" "}
                                {order.isDelivered
                                  ? "Not delivered"
                                  : "Delivered"}
                                ?
                              </p>
                              <div className="flex  gap-2">
                                <button
                                  className="btn btn-neutral min-w-20"
                                  onClick={async () => {
                                    toast.dismiss(t);
                                  }}
                                  id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrBlockContainer-alert-cancel"
                                >
                                  Cancel
                                </button>
                                <button
                                  id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrBlockContainer-alert-create"
                                  className="btn btn-warning min-w-20"
                                  onClick={async () => {
                                    toast.dismiss(t);
                                    setTableState((prevState) => ({
                                      ...prevState,
                                      currentOrders:
                                        prevState.currentOrders.map((e) => {
                                          if (e._id === order._id) {
                                            e.isDelivered = !e.isDelivered;
                                          }
                                          return e;
                                        }),
                                    }));
                                    handleDeliverOrder(order._id);
                                  }}
                                >
                                  {order.isDelivered
                                    ? "Not delivered"
                                    : "Delivered"}
                                </button>
                              </div>
                            </div>
                          ));
                        }}
                      />
                    </td>
                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrAdminContainer"
                    >
                      <input
                        className="toggle toggle-error"
                        type="checkbox"
                        id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrAdminContainer-input"
                        checked={order.isPaid}
                        onClick={() => {
                          toast.custom((t) => (
                            <div
                              id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrAdminContainer-alert"
                              className="flex flex-col gap-2 items-center bg-white p-2 rounded-xl shadow-xl border-2 "
                            >
                              <p
                                className="text-lg text-center"
                                id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrAdminContainer-alert-p"
                              >
                                Are you sure you want to mark order{" "}
                                {order.orderNumber} as{" "}
                                {order.isPaid ? "Unpaid" : "Paid"}?
                              </p>
                              <div className="flex  gap-2">
                                <button
                                  id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrAdminContainer-alert-cancel"
                                  className="btn btn-neutral min-w-20"
                                  onClick={async () => {
                                    toast.dismiss(t);
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrAdminContainer-alert-create"
                                  className="btn btn-warning min-w-20"
                                  onClick={async () => {
                                    toast.dismiss(t);
                                    setTableState((prevState) => ({
                                      ...prevState,
                                      currentOrders:
                                        prevState.currentOrders.map((e) => {
                                          if (e._id === order._id) {
                                            e.isPaid = !e.isPaid;
                                          }
                                          return e;
                                        }),
                                    }));
                                    handlePayOrder(order._id);
                                  }}
                                >
                                  {order.isPaid ? "Unpaid" : "Paid"}
                                </button>
                              </div>
                            </div>
                          ));
                        }}
                      />
                    </td>
                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-actions"
                    >
                      <LuTrash2
                        id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-actions-delete"
                        className="hover:cursor-pointer"
                        size={30}
                        onClick={() => {
                          toast.custom((t) => (
                            <div className="flex flex-col gap-2 items-center bg-white p-2 rounded-xl shadow-xl border-2">
                              <p className="text-lg text-center">
                                Are you sure you want to delete order{" "}
                                {order.orderNumber}?
                              </p>
                              <div className="flex gap-2">
                                <button
                                  className="btn btn-neutral w-20"
                                  onClick={async () => {
                                    toast.dismiss(t);
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="btn btn-error w-20"
                                  onClick={async () => {
                                    toast.dismiss(t);
                                    setTableState((prevState) => ({
                                      ...prevState,
                                      currentOrders:
                                        prevState.currentOrders.filter(
                                          (e) => e._id !== order._id
                                        ),
                                    }));
                                    handleDeleteOrder(order._id);
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ));
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr id="src-components-orderTable-index-mainContainer-table-tbody-tr">
                  <td
                    colSpan={11}
                    className="py-10 text-center"
                    id="src-components-orderTable-index-mainContainer-table-tbody-tr-td"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages ? (
        <Pagination
          pages={totalPages}
          limit={limit}
          setState={setTableState}
          loading={false}
        />
      ) : (
        <Pagination
          pages={2}
          limit={limit}
          setState={setTableState}
          loading={true}
        />
      )}
    </>
  );
};

export default OrderTable;
