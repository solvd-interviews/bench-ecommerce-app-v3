"use client";
import { BarChart } from "@mui/x-charts";
import React from "react";

const BarChartComponent = ({ topFiveProd }: { topFiveProd: any }) => {
  const formattedDays = topFiveProd.daysArray.map((day: number) => {
    const date = new Date(
      new Date().setDate(new Date().getDate() - (30 - day))
    );

    // Format the date to "Aug 25"
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  });

  /**
   * In the bar chart time scale type is not allowed. Therefore I implemented a formattedDays function to be as similar as in time scale type.
   */
  return (
    <BarChart
      margin={{ top: 110 }}
      width={500}
      height={300}
      series={topFiveProd.salesData.map((data: any, index: number) => ({
        data,
        label: topFiveProd.productNames[index],
        id: topFiveProd.productIds[index],
        stack: "total",
      }))}
      xAxis={[{ data: formattedDays, scaleType: "band" }]}
    />
  );
};

export default BarChartComponent;
