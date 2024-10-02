"use client";

import { Product } from "@/lib/models/ProductModel";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";

const BrandedProducts = ({ brandedProd }: { brandedProd: Product[] }) => {
  const router = useRouter();

  return (
    <div className="w-full ">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="w-full shadow-xl  rounded-xl overflow-hidden"
      >
        {brandedProd.map((product) => (
          <SwiperSlide
            key={product._id}
            onClick={() => router.push(`/${product._id}`)}
          >
            <img
              src={product.images[0]} // Use the first image of the product
              alt={product.name}
              className="object-cover w-full h-[150px] md:h-[300px]" // Adjust height as needed
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BrandedProducts;
