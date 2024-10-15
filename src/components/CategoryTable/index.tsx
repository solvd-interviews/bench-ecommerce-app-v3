"use client";
import { useState, useEffect, useCallback } from "react";
import Pagination from "../Pagination";
import { toast } from "sonner";
import { LuTrash2 } from "react-icons/lu";
import { CategoryTableState } from "./types";
import { tablePropertyAndSkeletonArr } from "./constants";
import { Category } from "@/lib/models/CategoryModel";

const CategoryTable = () => {
  const [tableState, setTableState] = useState<CategoryTableState>({
    isLoading: true,
    page: 1,
    totalPages: undefined,
    currentCategories: [],
    limit: 5,
  });

  const { isLoading, totalPages, currentCategories, limit } = tableState;

  const fetchCategories = useCallback(async () => {
    setTableState((prevState) => ({ ...prevState, isLoading: true }));

    // Initialize URLSearchParams with mandatory parameters
    const queryParams = new URLSearchParams({
      page: String(tableState.page),
      limit: String(tableState.limit),
    });

    const url = `/api/categories?${queryParams.toString()}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setTableState((prevState) => ({
        ...prevState,
        isLoading: false,
        totalPages: data.totalPages,
        currentCategories: data.categories,
      }));
    } catch (error) {
      toast.error("Failed to fetch orders. Try again later.");
      setTableState((prevState) => ({ ...prevState, isLoading: false }));
    }
  }, [tableState.page, tableState.limit]);

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      } else {
        toast.success("The category was deleted succesfully.");
      }

      return true;
    } catch (error) {
      toast.error("There was an error deleting the category. Try again later.");
      return false;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <div
        id="src-components-orderTable-index-mainContainer"
        className="overflow-y-auto h-full bg-white "
      >
        <div className="w-full overflow-x-auto">
          <table
            className="w-full "
            id="src-components-orderTable-index-mainContainer-table"
          >
            <thead id="src-components-orderTable-index-mainContainer-table-thead">
              <tr id="src-components-orderTable-index-mainContainer-table-thead-tr">
                {tablePropertyAndSkeletonArr.map((e, index) => {
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
              ) : currentCategories && currentCategories.length > 0 ? (
                currentCategories.map((category: Category, index: number) => (
                  <tr
                    key={category._id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f1f5f8" : "",
                    }}
                    id="src-components-orderTable-index-mainContainer-table-tbody-tr"
                  >
                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrNumber"
                    >
                      {category.categoryNumber}
                    </td>
                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrName"
                    >
                      {category.name}
                    </td>
                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrEmail"
                    >
                      {category.description}
                    </td>
                    <td
                      className="py-2 px-4 flex gap-3 items-center"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrCreated"
                    >
                      <p>{category.color} </p>
                      <div
                        className="w-5 h-5 "
                        style={{ backgroundColor: category.color }}
                      ></div>
                    </td>
                    <td
                      className="py-2 px-4"
                      id="src-components-orderTable-index-mainContainer-table-tbody-tr-td-usrCreated"
                    >
                      {category.createdAt.split("T")[0]}
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
                                Are you sure you want to delete category{" "}
                                {category.categoryNumber}?
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
                                      currentCategories:
                                        prevState.currentCategories.filter(
                                          (e) => e._id !== category._id
                                        ),
                                    }));
                                    handleDeleteCategory(category._id);
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

export default CategoryTable;
