"use client";
import { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import { useRouter, useSearchParams } from "next/navigation";

function valuetext(value: number) {
  return `$${value}`;
}

export default function RangeSlider({
  minPriceLimit,
  maxPriceLimit,
  minPriceFilter,
  maxPriceFilter,
}: {
  minPriceLimit: number;
  maxPriceLimit: number;
  minPriceFilter: number;
  maxPriceFilter: number;
}) {
  const [value, setValue] = useState<[number, number]>([
    minPriceFilter,
    maxPriceFilter,
  ]);

  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (value[0] !== minPriceFilter) {
      // Create a new URLSearchParams object from the existing parameters
      const updatedParams = new URLSearchParams(params.toString());
      // Update or set the minPrice parameter
      updatedParams.set("minPrice", value[0].toString());

      // Push the updated query parameters to the URL
      router.push("/search?" + updatedParams.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value[0]]);

  useEffect(() => {
    if (value[1] !== maxPriceFilter) {
      // Create a new URLSearchParams object from the existing parameters
      const updatedParams = new URLSearchParams(params.toString());
      // Update or set the minPrice parameter
      updatedParams.set("maxPrice", value[1].toString());

      // Push the updated query parameters to the URL
      router.push("/search?" + updatedParams.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value[1]]);

  const handleChange = (event: Event, value: number | number[]) => {
    if (Array.isArray(value) && value.length === 2) {
      setValue([value[0], value[1]]);
    }
  };

  return (
    <Slider
      getAriaLabel={() => "Price"}
      value={value}
      max={maxPriceLimit}
      min={0}
      onChange={handleChange}
      valueLabelDisplay="auto"
      getAriaValueText={valuetext}
      sx={{ color: "#00CC66" }}
    />
  );
}
