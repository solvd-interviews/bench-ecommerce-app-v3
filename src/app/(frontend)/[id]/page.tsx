"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Product } from "@/lib/models/ProductModel";
import Image from "next/image";
import { register } from "swiper/element/bundle";
import AddToCart from "@/components/AddToCart";

register();

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "swiper-container": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          navigation?: string;
          pagination?: string;
          loop?: string;
        },
        HTMLElement
      >;
      "swiper-slide": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

interface ProductState {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

const ProductDetailPage: React.FC = () => {
  const [state, setState] = useState<ProductState>({
    product: null,
    loading: false,
    error: null,
  });

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

  const { product, loading, error } = state;

  if (error) return <p id="product-detail-error">{error}</p>;
  if (loading || !product) return <></>;

  return (
    <div
      className="flex flex-col md:flex-row justify-around items-start my-8 mx-auto p-4 max-w-4xl"
      id="product-detail-page-container"
    >
      <div className="w-full md:w-1/2 px-2 py-4" id="product-image-container">
        {product.images && product.images.length > 1 ? (
          <swiper-container
            navigation="true"
            pagination="true"
            id="product-swiper-container"
          >
            {product.images.map((image, index) => (
              <swiper-slide key={index} id={`product-swiper-slide-${index}`}>
                <Image
                  src={image}
                  alt={`Slide ${index}`}
                  width={400}
                  height={400}
                  className="object-cover w-full"
                  id={`product-image-${index}`}
                />
              </swiper-slide>
            ))}
          </swiper-container>
        ) : (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover w-full"
            id="product-single-image"
          />
        )}
      </div>
      <div className="w-full md:w-1/2 px-2 py-4" id="product-details-container">
        <h1 className="text-xl md:text-2xl font-bold" id="product-name">
          {product.name}
        </h1>
        <p className="my-2 md:my-4" id="product-description">
          {product.description}
        </p>
        <p className="text-lg md:text-xl font-semibold" id="product-price">
          ${product.price}
        </p>

        {product.stock > 0 ? (
          <AddToCart
            item={{
              ...product,
              qty: 0,
              color: "",
              size: "",
              image: product.images[0] || null,
            }}
          />
        ) : (
          <button
            className="btn btn-primary disabled mt-2"
            disabled
            id="product-no-stock-button"
          >
            No stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
