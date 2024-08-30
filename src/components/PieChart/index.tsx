"use client";

import { PieChart } from "@mui/x-charts";

const PieChartComponent = ({ data }: { data: any }) => {
  return (
    <PieChart
      series={[
        {
          data,
          innerRadius: 30,
          outerRadius: 100,
          paddingAngle: 5,
          cornerRadius: 5,
        },
      ]}
      margin={{ right: 250 }}
      width={630}
      height={200}
    />
  );
};

export default PieChartComponent;
