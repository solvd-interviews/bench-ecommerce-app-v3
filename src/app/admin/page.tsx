import BasicLineChart from "@/components/LineChart";
import { lastThirtyDaysUsers } from "@/lib/utils/users";

const page = async () => {
  const userChartData = await lastThirtyDaysUsers();
  console.log("userChartData", userChartData);
  return (
    <div className="flex flex-col w-full h-full">
      <div className="  w-full flex p-4">
        <div className="flex  flex-col gap:1 justify-start p-4 rounded-xl items-center bg-white shadow-xl ">
          <h1 className="text-2xl font-bold">Last month registered users</h1>
          <BasicLineChart
            xAxis={[{ data: userChartData.map((entry) => entry.dayNumber) }]}
            series={[
              {
                data: userChartData.map((entry) => entry.count),
                area: true,
                color: "#00CC77",
              },
            ]}
          />
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
  );
};

export default page;
