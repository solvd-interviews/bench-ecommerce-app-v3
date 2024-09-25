"use client";

interface FormMarkupProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  filters: {
    id: number | null;
    itemsPrice: number | null;
    taxPrice: number | null;
    shippingPrice: number | null;
    totalPrice: number | null;
    createDate: string | null;
    updatedDate: string | null;
    paidDate: string | null;
    paymentMethod: string | null;
    isDelivered: boolean;
    isPaid: boolean;
  };
}

const FormMarkup = ({
  handleSubmit,
  handleChange,
  filters,
}: FormMarkupProps) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-3 py-2"
      id="src-components-orderTable-index-form"
    >
      {/* order ID Filter */}
      <div id="src-components-orderTable-index-form-idFilterContainer">
        <label
          htmlFor="orderId"
          className="block text-sm font-medium text-gray-700"
          id="src-components-orderTable-index-form-idFilterContainer-label"
        >
          ID
        </label>
        <input
          type="number"
          id="src-components-orderTable-index-form-idFilterContainer-inputorderId"
          name="id"
          className="mt-1 block w-32 pl-3 pr-10 py-2 text-base  border-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="123"
          value={filters.id === null ? "" : filters.id}
          onChange={handleChange}
        />
      </div>

      {/* paymentMethod Filter */}
      <div id="src-components-orderTable-index-form-paymentMethodFilterContainer">
        <label
          htmlFor="paymentMethod"
          className="block text-sm font-medium text-gray-700"
          id="src-components-orderTable-index-form-paymentMethodFilterContainer-label"
        >
          Payment Method
        </label>
        <select
          id="src-components-orderTable-index-form-paymentMethodFilterContainer-select"
          name="paymentMethod"
          className="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.paymentMethod === null ? "" : filters.paymentMethod}
          onChange={handleChange}
        >
          <option value="PayPal">PayPal</option>
          <option value="MercadoPago">MercadoPago</option>
          <option value={""}>-</option>
        </select>
      </div>

      {/* order itemsPrice Filter */}
      <div id="src-components-orderTable-index-form-itemsPriceFilterContainer">
        <label
          htmlFor="itemsPrice"
          className="block text-sm font-medium text-gray-700"
          id="src-components-orderTable-index-form-itemsPriceFilterContainer-label"
        >
          Items Price
        </label>
        <input
          type="number"
          id="src-components-orderTable-index-form-itemsPriceFilterContainer-inputorderId"
          name="itemsPrice"
          className="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="123"
          value={filters.itemsPrice === null ? "" : filters.itemsPrice}
          onChange={handleChange}
        />
      </div>
      {/* shippingPrice  Filter */}
      <div id="src-components-orderTable-index-form-shippingPriceFilterContainer">
        <label
          htmlFor="shippingPrice"
          className="block text-sm font-medium text-gray-700"
          id="src-components-orderTable-index-form-shippingPriceFilterContainer-label"
        >
          Shipping Price
        </label>
        <input
          type="number"
          id="src-components-orderTable-index-form-shippingPriceFilterContainer-input"
          name="shippingPrice"
          className="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="23"
          value={filters.shippingPrice === null ? "" : filters.shippingPrice}
          onChange={handleChange}
        />
      </div>
      {/* taxPrice Filter */}
      <div id="src-components-orderTable-index-form-taxPriceFilterContainer">
        <label
          htmlFor="taxPrice"
          className="block text-sm font-medium text-gray-700"
          id="src-components-orderTable-index-form-taxPriceFilterContainer-label"
        >
          Tax Price
        </label>
        <input
          type="number"
          id="src-components-orderTable-index-form-taxPriceFilterContainer-inputorderId"
          name="taxPrice"
          className="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="44"
          value={filters.taxPrice === null ? "" : filters.taxPrice}
          onChange={handleChange}
        />
      </div>
      {/* totalPrice Filter */}
      <div id="src-components-orderTable-index-form-totalPriceFilterContainer">
        <label
          htmlFor="totalPrice"
          className="block text-sm font-medium text-gray-700"
          id="src-components-orderTable-index-form-totalPriceFilterContainer-label"
        >
          Total Price
        </label>
        <input
          type="number"
          id="src-components-orderTable-index-form-totalPriceFilterContainer-input"
          name="totalPrice"
          className="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          placeholder="77"
          value={filters.totalPrice === null ? "" : filters.totalPrice}
          onChange={handleChange}
        />
      </div>

      {/* Paid Date Filter */}
      <div id="src-components-orderTable-index-form-paidFilterContainer">
        <label
          htmlFor="paidDate"
          className="block text-sm font-medium text-gray-700"
          id="src-components-orderTable-index-form-paidFilterContainer-label"
        >
          Paid
        </label>
        <input
          type="date"
          id="src-components-orderTable-index-form-paidFilterContainer-input"
          name="paidDate"
          className="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.paidDate ?? ""}
          onChange={handleChange}
        />
      </div>

      {/* Create Date Filter */}
      <div id="src-components-orderTable-index-form-createFilterContainer">
        <label
          htmlFor="createDate"
          className="block text-sm font-medium text-gray-700"
          id="src-components-orderTable-index-form-createFilterContainer-label"
        >
          Created
        </label>
        <input
          type="date"
          id="src-components-orderTable-index-form-createFilterContainer-input"
          name="createDate"
          className="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.createDate ?? ""}
          onChange={handleChange}
        />
      </div>

      {/* Updated Date Filter */}
      <div id="src-components-orderTable-index-form-updateFilterContainer">
        <label
          htmlFor="updatedDate"
          id="src-components-orderTable-index-form-updateFilterContainer-label"
          className="block text-sm font-medium text-gray-700"
        >
          Updated
        </label>
        <input
          type="date"
          id="src-components-orderTable-index-form-updateFilterContainer-input"
          name="updatedDate"
          className="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-2 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={filters.updatedDate ?? ""}
          onChange={handleChange}
        />
      </div>

      {/* Admin Filter */}
      <div
        className="flex items-center"
        id="src-components-orderTable-index-form-isDeliveredFilterContainer"
      >
        <label
          htmlFor="isDelivered"
          id="src-components-orderTable-index-form-isDeliveredFilterContainer-label"
          className="isDelivered text-sm font-medium text-gray-700 mr-2"
        >
          Delivered
        </label>
        <input
          type="checkbox"
          id="src-components-orderTable-index-form-isDeliveredFilterContainer-input"
          name="isDelivered"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-2 border-gray-300 rounded"
          checked={filters.isDelivered || false}
          onChange={handleChange}
        />
      </div>

      {/* Block Filter */}
      <div
        className="flex items-center"
        id="src-components-orderTable-index-form-isPaidFilterContainer"
      >
        <label
          htmlFor="isPaid"
          id="src-components-orderTable-index-form-isPaidFilterContainer-label"
          className="isPaid text-sm font-medium text-gray-700 mr-2"
        >
          Paid
        </label>
        <input
          type="checkbox"
          id="src-components-orderTable-index-form-isPaidFilterContainer-input"
          name="isPaid"
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-2 border-gray-300 rounded"
          checked={filters.isPaid || false}
          onChange={handleChange}
        />
      </div>

      {/* Search Button */}
      <div id="src-components-orderTable-index-form-buttonContainer">
        <button
          id="src-components-orderTable-index-form-buttonContainer-button"
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default FormMarkup;
