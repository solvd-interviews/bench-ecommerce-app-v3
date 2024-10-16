"use client";
import { useState, useEffect, useCallback } from "react";
import Pagination from "../Pagination";
import Accordion from "../Accordion";
import Image from "next/image";
import { toast } from "sonner";
import { LuClipboardEdit } from "react-icons/lu";
import { LuTrash2 } from "react-icons/lu";
import { Filter, UserTableState } from "./types";
import { tablePropertyAndSkeletonArr } from "./constants";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { useRouter } from "next/navigation";

const defaultValues = {
  id: null as number | null,
  name: "",
  createDate: null as string | null,
  updatedDate: null as string | null,
  email: "",
  isAdmin: false,
  isBlocked: false,
};

type FilterKeys = keyof typeof defaultValues;

const UserTable = () => {
  const [tableState, setTableState] = useState<UserTableState>({
    isLoading: true,
    page: 1,
    totalPages: undefined,
    currentUsers: [],
    limit: 5,
    sort: {
      prop: "userUser",
      order: "asc",
    },
  });
  const [filters, setFilters] = useState(defaultValues);

  const router = useRouter();

  const {
    isLoading,
    page,
    totalPages,
    currentUsers,
    limit,
    sort: { prop, order },
  } = tableState;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let newValue: string | number | boolean | null = value;

    if (type === "number") {
      newValue = value === "" ? null : Number(value);
    } else if (type === "checkbox") {
      newValue = checked;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  type FilterKeys = keyof typeof defaultValues;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    type FilterAccumulator = Partial<Filter>;

    const cleanFilters = Object.entries(filters).reduce<FilterAccumulator>(
      (acc, [key, value]) => {
        const safeKey = key as keyof Filter;

        // Ensure non-null, non-undefined values are considered
        if (value !== null && value !== undefined) {
          switch (safeKey) {
            case "id":
              // Correctly handle number and string types, ensure no trim operation on number
              if (typeof value === "number") {
                acc[safeKey] = value;
              } else if (typeof value === "string") {
                acc[safeKey] = value.trim() ? Number(value.trim()) : null;
              }
              break;
            case "name":
            case "email":
              // Ensure the name is treated as a string and passed even if it's an empty string
              if (typeof value === "string") {
                acc[safeKey] = value.trim(); // Remove excess whitespace
              }
              break;
            case "isAdmin":
            case "isBlocked":
              // Boolean values do not need trimming or conversion
              acc[safeKey] = Boolean(value);
              break;
            case "createDate":
            case "updatedDate":
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

    fetchUsers(cleanFilters, tableState.sort);
  };

  const fetchUsers = useCallback(
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
        if (value !== null && value !== undefined) {
          queryParams.set(key, String(value));
        }
      });
      const url = `/api/users?${queryParams.toString()}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setTableState((prevState) => ({
          ...prevState,
          isLoading: false,
          totalPages: data.totalPages,
          currentUsers: data.users,
        }));
      } catch (error) {
        console.error("Fetch error: ", error);
        toast.error("Failed to fetch users. Try again later.");
        setTableState((prevState) => ({ ...prevState, isLoading: false }));
      }
    },
    [tableState.page, tableState.limit, tableState.sort]
  );

  const handleDeleteuser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const resJson = await res.json();
      return true;
    } catch (error) {
      console.error("Fetch error: ", error);
      toast.error("There was an error deleting the user. Try again later.");
      return false;
    }
  };

  const handleBlockClick = async (id: string, isBlocked: boolean) => {
    try {
      const res = await fetch(`/api/users/block/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const resJson = await res.json();
      return true;
    } catch (error) {
      console.error("Fetch error: ", error);
      toast.error("There was an error editing the user. Try again later.");

      return false;
    }
  };

  const handleMakeUserAdmin = async (id: string) => {
    try {
      const res = await fetch(`/api/users/admin/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const resJson = await res.json();
      return true;
    } catch (error) {
      console.error("Fetch error: ", error);
      toast.error("There was an error editing the user. Try again later.");

      return false;
    }
  };

  useEffect(() => {
    fetchUsers(filters, tableState.sort);
  }, []);

  const formMarkup = () => (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-3"
      id="src-components-userTable-index-form"
    >
      {/* User ID Filter */}
      <div id="src-components-userTable-index-form-idFilterContainer">
        <label
          htmlFor="userId"
          className="block text-sm font-medium text-gray-700"
          id="src-components-userTable-index-form-idFilterContainer-label"
        >
          ID
        </label>
        <input
          type="number"
          id="src-components-userTable-index-form-idFilterContainer-inputUserId"
          name="id"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="123"
          min="1"
          max="999999"
          value={filters.id === null ? "" : filters.id}
          onChange={handleChange}
        />
      </div>

      {/* user Name Filter */}
      <div id="src-components-userTable-index-form-nameFilterContainer">
        <label
          htmlFor="userName"
          className="block text-sm font-medium text-gray-700"
          id="src-components-userTable-index-form-nameFilterContainer-label"
        >
          Name
        </label>
        <input
          type="text"
          id="src-components-userTable-index-form-nameFilterContainer-input"
          name="name"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="Widget X123"
          maxLength={30}
          value={filters.name}
          onChange={handleChange}
        />
      </div>

      {/* Create Date Filter */}
      <div id="src-components-userTable-index-form-createFilterContainer">
        <label
          htmlFor="createDate"
          className="block text-sm font-medium text-gray-700"
          id="src-components-userTable-index-form-createFilterContainer-label"
        >
          Created
        </label>
        <input
          type="date"
          id="src-components-userTable-index-form-createFilterContainer-input"
          name="createDate"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.createDate ?? ""}
          onChange={handleChange}
        />
      </div>

      {/* Updated Date Filter */}
      <div id="src-components-userTable-index-form-updateFilterContainer">
        <label
          htmlFor="updatedDate"
          id="src-components-userTable-index-form-updateFilterContainer-label"
          className="block text-sm font-medium text-gray-700"
        >
          Updated
        </label>
        <input
          type="date"
          id="src-components-userTable-index-form-updateFilterContainer-input"
          name="updatedDate"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.updatedDate ?? ""}
          onChange={handleChange}
        />
      </div>

      {/* Admin Filter */}
      <div
        className="flex items-center"
        id="src-components-userTable-index-form-isAdminFilterContainer"
      >
        <label
          htmlFor="isAdmin"
          id="src-components-userTable-index-form-isAdminFilterContainer-label"
          className="isAdmin text-sm font-medium text-gray-700 mr-2"
        >
          Admin
        </label>
        <input
          type="checkbox"
          id="src-components-userTable-index-form-isAdminFilterContainer-input"
          name="isAdmin"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={filters.isAdmin || false}
          onChange={handleChange}
        />
      </div>

      {/* Block Filter */}
      <div
        className="flex items-center"
        id="src-components-userTable-index-form-isBlockedFilterContainer"
      >
        <label
          htmlFor="isBlocked"
          id="src-components-userTable-index-form-isBlockedFilterContainer-label"
          className="isBlocked text-sm font-medium text-gray-700 mr-2"
        >
          Blocked
        </label>
        <input
          type="checkbox"
          id="src-components-userTable-index-form-isBlockedFilterContainer-input"
          name="isBlocked"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          checked={filters.isBlocked || false}
          onChange={handleChange}
        />
      </div>

      {/* Search Button */}
      <div id="src-components-userTable-index-form-buttonContainer">
        <button
          id="src-components-userTable-index-form-buttonContainer-button"
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Search
        </button>
      </div>
    </form>
  );

  return (
    <>
      <div
        id="src-components-userTable-index-mainContainer"
        className="overflow-y-auto h-full bg-white"
      >
        <div
          id="src-components-userTable-index-mainContainer-filters-container"
          className="filter-section flex justify-around p-3 bg-blue-100 w-full min-w-max overflow-x-auto"
        >
          <div
            id="src-components-userTable-index-mainContainer-filters-container-subContainer"
            className="hidden sm:block"
          >
            {formMarkup()}
          </div>
          <div
            className="block sm:hidden"
            id="src-components-userTable-index-mainContainer-filters-container-subContainer2"
          >
            <Accordion title="Filter options" startsOpen={false}>
              {formMarkup()}
            </Accordion>
          </div>
        </div>

        <table
          className="w-full "
          id="src-components-userTable-index-mainContainer-table"
        >
          <thead id="src-components-userTable-index-mainContainer-table-thead">
            <tr id="src-components-userTable-index-mainContainer-table-thead-tr">
              {tablePropertyAndSkeletonArr.map((e, index) => {
                if (e.logic) {
                  return (
                    <th
                      id={
                        "src-components-userTable-index-mainContainer-table-thead-tr-th-" +
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
                        fetchUsers(filters, {
                          prop: e.prop,
                          order: newOrder,
                        });
                      }}
                    >
                      <div
                        className="flex gap-1 justify-between"
                        id={
                          "src-components-userTable-index-mainContainer-table-thead-tr-th-div-" +
                          index +
                          1
                        }
                      >
                        <p
                          id={
                            "src-components-userTable-index-mainContainer-table-thead-tr-th-p-" +
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
                                "src-components-userTable-index-mainContainer-table-thead-tr-th-div-icondown" +
                                index +
                                1
                              }
                            />
                          ) : (
                            <IoIosArrowUp
                              size={25}
                              id={
                                "src-components-userTable-index-mainContainer-table-thead-tr-th-iconup-" +
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
                        "src-components-userTable-index-mainContainer-table-thead-tr-th-" +
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
          <tbody id="src-components-userTable-index-mainContainer-table-tbody">
            {isLoading ? (
              Array(limit)
                .fill(null)
                .map((_, indexL) => (
                  <tr
                    key={indexL}
                    className="h-32"
                    id={
                      "src-components-userTable-index-mainContainer-table-tbody-tr-loading-" +
                      indexL
                    }
                  >
                    {tablePropertyAndSkeletonArr.map((e, indexE) => (
                      <td
                        key={indexE}
                        className="py-2 px-4 "
                        id={
                          "src-components-userTable-index-mainContainer-table-tbody-tr-loading-" +
                          indexL +
                          "-" +
                          indexE
                        }
                      >
                        <div
                          className="flex flex-col gap-1"
                          id={
                            "src-components-userTable-index-mainContainer-table-tbody-tr-loading-" +
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
                                  "src-components-userTable-index-mainContainer-table-tbody-tr-loading-" +
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
            ) : currentUsers && currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr
                  key={user._id}
                  style={{ backgroundColor: index % 2 === 0 ? "#f1f5f8" : "" }}
                  id="src-components-userTable-index-mainContainer-table-tbody-tr"
                >
                  <td
                    className="py-2 px-4"
                    id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrNumber"
                  >
                    {user.userNumber}
                  </td>
                  <td
                    className="py-2 px-4"
                    id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrName"
                  >
                    {user.name}
                  </td>
                  <td
                    className="py-2 px-4"
                    id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrEmail"
                  >
                    {user.email}
                  </td>
                  <td
                    className="py-2 px-4"
                    id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrCreated"
                  >
                    {user.createdAt.split("T")[0]}
                  </td>
                  <td
                    className="py-2 px-4"
                    id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrUpdated"
                  >
                    {user.updatedAt.split("T")[0]}
                  </td>
                  <td
                    className={`py-2 px-4 font-bold ${
                      user.isBlocked ? "text-red-500" : "text-gray-600"
                    }`}
                    id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrBlocked"
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </td>{" "}
                  <td
                    className="py-2 px-4"
                    id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrBlockContainer"
                  >
                    <input
                      className="toggle toggle-error"
                      type="checkbox"
                      id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrBlockContainer-input"
                      checked={user.isBlocked}
                      onClick={() => {
                        toast.custom((t) => (
                          <div
                            id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrBlockContainer-alert"
                            className="flex flex-col gap-2 items-center bg-white p-2 rounded-xl shadow-xl border-2 "
                          >
                            <p
                              className="text-lg text-center"
                              id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrBlockContainer-alert-p"
                            >
                              Are you sure you want to{" "}
                              {user.isBlocked ? "Unblock" : "Block"} {user.name}
                              ?
                            </p>
                            <div className="flex  gap-2">
                              <button
                                className="btn btn-neutral min-w-20"
                                onClick={async () => {
                                  toast.dismiss(t);
                                }}
                                id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrBlockContainer-alert-cancel"
                              >
                                Cancel
                              </button>
                              <button
                                id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrBlockContainer-alert-create"
                                className="btn btn-warning min-w-20"
                                onClick={async () => {
                                  toast.dismiss(t);
                                  setTableState((prevState) => ({
                                    ...prevState,
                                    currentUsers: prevState.currentUsers.map(
                                      (e) => {
                                        if (e._id === user._id) {
                                          e.isBlocked = !e.isBlocked;
                                        }
                                        return e;
                                      }
                                    ),
                                  }));
                                  handleBlockClick(user._id, !user.isBlocked);
                                }}
                              >
                                {user.isBlocked ? "Unblock" : "Block"}
                              </button>
                            </div>
                          </div>
                        ));
                      }}
                    />
                  </td>
                  <td
                    className="py-2 px-4"
                    id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrAdminContainer"
                  >
                    <input
                      className="toggle toggle-error"
                      type="checkbox"
                      id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrAdminContainer-input"
                      checked={user.isAdmin}
                      onClick={() => {
                        toast.custom((t) => (
                          <div
                            id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrAdminContainer-alert"
                            className="flex flex-col gap-2 items-center bg-white p-2 rounded-xl shadow-xl border-2 "
                          >
                            <p
                              className="text-lg text-center"
                              id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrAdminContainer-alert-p"
                            >
                              Are you sure you want to{" "}
                              {user.isAdmin ? "unmake" : "make"} {user.name}{" "}
                              admin ?
                            </p>
                            <div className="flex  gap-2">
                              <button
                                id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrAdminContainer-alert-cancel"
                                className="btn btn-neutral min-w-20"
                                onClick={async () => {
                                  toast.dismiss(t);
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                id="src-components-userTable-index-mainContainer-table-tbody-tr-td-usrAdminContainer-alert-create"
                                className="btn btn-warning min-w-20"
                                onClick={async () => {
                                  toast.dismiss(t);
                                  setTableState((prevState) => ({
                                    ...prevState,
                                    currentUsers: prevState.currentUsers.map(
                                      (e) => {
                                        if (e._id === user._id) {
                                          e.isAdmin = !e.isAdmin;
                                        }
                                        return e;
                                      }
                                    ),
                                  }));
                                  handleMakeUserAdmin(user._id);
                                }}
                              >
                                {user.isAdmin ? "Unmake" : "Make"}
                              </button>
                            </div>
                          </div>
                        ));
                      }}
                    />
                  </td>
                  <td
                    className="py-2 px-4"
                    id="src-components-userTable-index-mainContainer-table-tbody-tr-td-actions"
                  >
                    <LuTrash2
                      id="src-components-userTable-index-mainContainer-table-tbody-tr-td-actions-delete"
                      className="hover:cursor-pointer"
                      size={30}
                      onClick={() => {
                        toast.custom((t) => (
                          <div className="flex flex-col gap-2 items-center bg-white p-2 rounded-xl shadow-xl border-2">
                            <p className="text-lg text-center">
                              Are you sure you want to delete {user.name}?
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
                                    currentUsers: prevState.currentUsers.filter(
                                      (e) => e._id !== user._id
                                    ),
                                  }));
                                  handleDeleteuser(user._id);
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
              <tr id="src-components-userTable-index-mainContainer-table-tbody-tr">
                <td
                  colSpan={11}
                  className="py-10 text-center"
                  id="src-components-userTable-index-mainContainer-table-tbody-tr-td"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default UserTable;