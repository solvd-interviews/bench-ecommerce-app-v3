"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { Product } from "@/lib/models/ProductModel";
import Image from "next/image";
import AddToCart from "@/components/AddToCart";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


interface ProductState {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

const ProductDetailPage: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [state, setState] = useState<ProductState>({
    product: null,
    loading: false,
    error: null,
  });

  const swiperRef = useRef<SwiperClass | null>(null);

  const { id } = useParams();

  useEffect(() => {
    if (typeof id === "string") {
      setState((prevState) => ({ ...prevState, loading: true }));
      fetch(`/api/${id}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Failed to fetch product");
          }
        })
        .then((data) => {
          setState({ product: data, loading: false, error: null });
        })
        .catch((err) => {
          setState({
            product: null,
            loading: false,
            error: err.message || "Failed to load product",
          });
          console.error("Fetch error:", err);
        });
    }
  }, [id]);

  // Ensures that when a thumbnail is clicked, Swiper will move,
  // and when navigation is used, the thumbnail selection updates.
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(selectedImageIndex);

      swiperRef.current.on('slideChange', () => {
        setSelectedImageIndex(swiperRef.current!.activeIndex);
      });
    }
  }, [selectedImageIndex]);

  const { product, loading, error } = state;

  if (error) return <p id="product-detail-error">{error}</p>;
  if (loading || !product) return <></>;

  return (
      <div id="src-app-(frontend)-[id]-page-container" className="flex flex-col md:flex-row justify-around items-start my-8 mx-auto p-4 max-w-4xl">
        <div id="src-app-(frontend)-[id]-page-preview-images" className="w-full md:w-1/4 px-2 py-4 flex flex-col items-center space-y-2 hidden md:flex">
          {/* Image Previews */}
          {product.images?.map((image, index) => (
            <div
              key={index}
              id={`src-app-(frontend)-[id]-page-preview-image-${index}`}
              className={`cursor-pointer border rounded-md overflow-hidden ${index === selectedImageIndex ? "border-blue-500" : "border-gray-300"
                }`}
              onClick={() => {
                swiperRef.current?.slideTo(index);
                setSelectedImageIndex(index);
              }}
            >
              <Image
                src={image}
                alt={`Preview ${index}`}
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div id="src-app-(frontend)-[id]-page-swiper-container" className="w-full md:w-3/4 px-2 py-4">
          {product.images && product.images.length > 1 ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              onSlideChange={(swiper) => setSelectedImageIndex(swiper.activeIndex)}
              onSwiper={(swiperInstance) => {
                swiperRef.current = swiperInstance;
              }}
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={image}
                    alt={`Slide ${index}`}
                    width={400}
                    height={400}
                    className="object-contain rounded w-full h-640"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Image
                id="src-app-(frontend)-[id]-page-single-image"
              src={product.images[0]}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover w-full"
            />
          )}
        </div>

        <div id="src-app-(frontend)-[id]-page-product-details" className="w-full md:w-1/2 px-2 py-4">
          <h1 id="src-app-(frontend)-[id]-page-product-name" className="text-xl md:text-2xl font-bold">{product.name}</h1>
          <p id="src-app-(frontend)-[id]-page-product-description" className="my-2 md:my-4">{product.description}</p>
          <p id="src-app-(frontend)-[id]-page-product-price" className="text-lg md:text-xl font-semibold">${product.price}</p>

          {product.stock > 0 ? (
            <AddToCart
              item={{
                ...product,
                qty: 0,
                color: "",
                size: "",
                image: product.images[selectedImageIndex] || null,
              }}
            />
          ) : (
            <button id="src-app-(frontend)-[id]-page-no-stock-button" className="btn btn-primary disabled mt-2" disabled>
              No stock
            </button>
          )}
        </div>
      </div>
  );
};

export default ProductDetailPage;
