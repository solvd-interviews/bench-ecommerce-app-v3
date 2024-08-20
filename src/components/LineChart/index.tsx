"use client";
import * as React from "react";
import { LineChart, LineChartProps } from "@mui/x-charts/LineChart";

export default function BasicLineChart({
  xAxis = [{ data: [1, 2, 3, 5, 8, 10] }],
  series = [
    {
      data: [2, 5.5, 2, 8.5, 1.5, 5],
    },
  ],
}: LineChartProps) {
  console.log("xAxis ", xAxis, "series", series);
  return (
    <LineChart
      xAxis={xAxis}
      series={series}
      width={350}
      height={300}
      margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
    />
  );
}
