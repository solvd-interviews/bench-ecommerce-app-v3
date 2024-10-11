import DeleteButton from "@/components/DeleteButton";
import BasicLineChart from "@/components/LineChart";
import {
  countOrders,
  lastThirtyDaysOrders,
  lastThirtyDaysOrdersNotPaid,
  lastThirtyDaysOrdersPaid,
  lastThirtyDaysSales,
  topFiveProductsLastThirtyDays,
} from "@/lib/utils/orders";
import { countProducts } from "@/lib/utils/products";
import { countUsers, lastThirtyDaysUsers } from "@/lib/utils/users";
import PieChartComponent from "../../components/PieChart/index";

const page = async () => {
  // 30D users
  const userChartData = await lastThirtyDaysUsers();

  // Orders
  const paidOrders30d = await lastThirtyDaysOrdersPaid();
  const notPaidOrders30d = await lastThirtyDaysOrdersNotPaid();
  const orders30d = await lastThirtyDaysOrders();

  // Sales stats
  const totalSales30d = await lastThirtyDaysSales();
  const topFiveProd = await topFiveProductsLastThirtyDays();

  // Items count
  const userCount = await countUsers();
  const productCount = await countProducts();
  const orderCount = await countOrders();

  return (
    <div
      id="src-app-admin-page-mainContainer"
      className="flex flex-col w-full h-full overflow-y-auto"
    >
      <div
        id="src-app-admin-page-mainContainer-gridContainer"
        className="w-full p-4 gap-5 items-center grid grid-cols-1 grid-rows-3 md:grid-cols-2 md:grid-rows-2 xl:grid-cols-3 xl:grid-rows-1"
      >
        <div
          id="src-app-admin-page-mainContainer-gridContainer-newUsers30d"
          className="flex flex-col gap:1 justify-start rounded-xl items-center bg-white shadow-xl overflow-x-auto"
        >
          <h1
            id="src-app-admin-page-mainContainer-gridContainer-newUsers30d-title"
            className="text-2xl font-bold mt-2"
          >
            New users last 30D
            {/* {userChartData.reduce(function (accumulator, currentValue) {
              return accumulator + currentValue.count;
            }, 0)} */}
          </h1>
          <BasicLineChart
            width={400}
            xAxis={[
              {
                data: userChartData.map((entry) => entry.date),
                scaleType: "time",
              },
            ]}
            series={[
              {
                data: userChartData.map((entry) => entry.count),
                area: true,
                color: "#00CC77",
              },
            ]}
          />
        </div>
        <div
          id="src-app-admin-page-mainContainer-gridContainer-smallGrid"
          className="grid grid-cols-2 grid-rows-2 h-full gap-2 min-w-80"
        >
          <div
            id="src-app-admin-page-mainContainer-gridContainer-smallGrid-users"
            className="p-2 flex flex-col gap:1 justify-start rounded-xl items-center bg-white shadow-xl"
          >
            <h1
              id="src-app-admin-page-mainContainer-gridContainer-smallGrid-users-title"
              className="text-2xl font-bold text-center"
            >
              Users
            </h1>
            <p
              id="src-app-admin-page-mainContainer-gridContainer-smallGrid-users-count"
              className="text-4xl w-full h-full flex items-center justify-center"
            >
              {userCount}
            </p>
          </div>
          <div
            id="src-app-admin-page-mainContainer-gridContainer-smallGrid-products"
            className="p-2 flex flex-col gap:1 justify-start rounded-xl items-center bg-white shadow-xl"
          >
            <h1
              id="src-app-admin-page-mainContainer-gridContainer-smallGrid-products-title"
              className="text-2xl font-bold text-center"
            >
              Products
            </h1>
            <p
              id="src-app-admin-page-mainContainer-gridContainer-smallGrid-products-count"
              className="text-4xl w-full h-full flex items-center justify-center"
            >
              {productCount}
            </p>
          </div>
          <div
            id="src-app-admin-page-mainContainer-gridContainer-smallGrid-orders"
            className="p-2 flex flex-col gap:1 justify-start rounded-xl items-center bg-white shadow-xl"
          >
            <h1
              id="src-app-admin-page-mainContainer-gridContainer-smallGrid-orders-title"
              className="text-2xl font-bold text-center"
            >
              Orders
            </h1>
            <p
              id="src-app-admin-page-mainContainer-gridContainer-smallGrid-orders-count"
              className="text-4xl w-full h-full flex items-center justify-center"
            >
              {orderCount}
            </p>
          </div>
          <div
            id="src-app-admin-page-mainContainer-gridContainer-smallGrid-categories"
            className="p-2 flex flex-col gap:1 justify-start rounded-xl items-center bg-white shadow-xl"
          >
            <h1
              id="src-app-admin-page-mainContainer-gridContainer-smallGrid-categories-title"
              className="text-2xl font-bold text-center"
            >
              Categories
            </h1>
            <p
              id="src-app-admin-page-mainContainer-gridContainer-smallGrid-categories-count"
              className="text-4xl w-full h-full flex items-center justify-center"
            >
              {orderCount} {/* TODO: 1) ADD CATEGORY COUNT */}
            </p>
          </div>
        </div>
        <div
          id="src-app-admin-page-mainContainer-gridContainer-top5Products"
          className="flex flex-col gap:1 justify-start rounded-xl items-center bg-white shadow-xl col-span-1 md:col-span-2 lg:col-span-1 overflow-x-auto h-full"
        >
          <h1
            id="src-app-admin-page-mainContainer-gridContainer-top5Products-title"
            className="text-2xl font-bold mt-2"
          >
            Top 5 most sold products 30D
          </h1>
          <div className="w-full h-full flex justify-center items-center p-5">
            <PieChartComponent data={topFiveProd} />
          </div>
        </div>
      </div>
      <div
        id="src-app-admin-page-mainContainer-gridContainer-ordersAndSales"
        className="w-full p-4 gap-5 items-center grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1"
      >
        <div
          id="src-app-admin-page-mainContainer-gridContainer-ordersAndSales-newOrders30d"
          className="flex flex-col gap:1 justify-start rounded-xl items-center bg-white shadow-xl overflow-x-auto"
        >
          <h1
            id="src-app-admin-page-mainContainer-gridContainer-ordersAndSales-newOrders30d-title"
            className="text-2xl font-bold mt-2"
          >
            New orders 30D
          </h1>

          <BasicLineChart
            marginTop={80}
            width={400}
            xAxis={[
              { data: orders30d.map((entry) => entry.date), scaleType: "time" },

              {
                data: paidOrders30d.map((entry) => entry.date),
                scaleType: "time",
              },
              {
                data: notPaidOrders30d.map((entry) => entry.date),
                scaleType: "time",
              },
            ]}
            series={[
              {
                data: orders30d.map((entry) => entry.count),
                color: "#A0A0A0",
                label: "Orders",
                area: true,
              },

              {
                data: paidOrders30d.map((entry) => entry.count),
                label: "Paid orders",
                color: "#00CC77",
                area: true,
              },
              {
                data: notPaidOrders30d.map((entry) => entry.count),
                color: "#DE3163",
                label: "Not paid orders",
                area: true,
              },
            ]}
          />
        </div>
        <div
          id="src-app-admin-page-mainContainer-gridContainer-ordersAndSales-totalSales30d"
          className="flex flex-col gap:1 justify-start rounded-xl items-center bg-white shadow-xl overflow-x-auto"
        >
          <h1
            id="src-app-admin-page-mainContainer-gridContainer-ordersAndSales-totalSales30d-title"
            className="text-2xl font-bold mt-2"
          >
            Total sales 30D
          </h1>
          <BasicLineChart
            width={400}
            marginTop={50}
            marginLeft={40}
            xAxis={[
              {
                data: totalSales30d.map((entry) => entry.date),
                scaleType: "time",
              },
            ]}
            series={[
              {
                data: totalSales30d.map((entry) => entry.totalSales),
                color: "#00CC77",
                area: true,
              },
            ]}
          />
        </div>
      </div>
      <div
        id="src-app-admin-page-mainContainer-gridContainer-deleteButtons"
        className="w-full p-4 gap-5 grid grid-cols-1 grid-rows-4 md:grid-cols-4 md:grid-rows-1"
      >
        <DeleteButton
          id="src-app-admin-page-mainContainer-gridContainer-deleteButtons-deleteAll"
          text={"Delete all"}
          deleteType={"all"}
        />
        <DeleteButton
          id="src-app-admin-page-mainContainer-gridContainer-deleteButtons-deleteProducts"
          text={"Delete products"}
          deleteType={"products"}
        />
        <DeleteButton
          id="src-app-admin-page-mainContainer-gridContainer-deleteButtons-deleteOrders"
          text={"Delete orders"}
          deleteType={"orders"}
        />
        <DeleteButton
          id="src-app-admin-page-mainContainer-gridContainer-deleteButtons-deleteUsers"
          text={"Delete users"}
          deleteType={"users"}
        />
        
      </div>
    </div>
  );
};

export default page;
