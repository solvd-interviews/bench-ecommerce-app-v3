"use client";
import * as React from "react";
import { LineChart, LineChartProps } from "@mui/x-charts/LineChart";

interface BasicLineChartProps extends LineChartProps {
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
}

export default function BasicLineChart({
  xAxis = [{ data: [1, 2, 3, 5, 8, 10] }],
  series = [
    {
      data: [2, 5.5, 2, 8.5, 1.5, 5],
    },
  ],
  width = 300,
  height = 300,
  marginTop = 30,
  marginLeft = 30,
  marginBottom = 30,
}: BasicLineChartProps) {
  return (
    <LineChart
      xAxis={xAxis}
      series={series}
      width={width}
      height={height}
      margin={{
        left: marginLeft,
        right: 30,
        top: marginTop,
        bottom: marginBottom,
      }}
    />
  );
}
