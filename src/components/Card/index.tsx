import { Product } from "@/lib/models/ProductModel";
import Image from "next/image";
import Link from "next/link";
import BuyButton from "./button";

const Card = ({ product }: { product: Product }) => {
  return (
    <div
      className={`card bg-base-100 sm:w-96 w-full md:w-80 lg:w-96 shadow-xl  rounded-t-xl overflow-hidden ${
        product.stock < 1 && "opacity-70"
      }`}
      id={`card-${product.id}`} // Unique ID for the card
    >
      <Link href={`/${product.id}`}>
        <figure className="w-full relative h-480" id={`figure-${product.id}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={830}
            height={620}
            className="object-contain"
            priority={true}
          />
        </figure>
      </Link>
      <div className="card-body">
        <Link href={`/${product.id}`}>
          <h2 className="card-title truncate" id={`title-${product.id}`}>
            {product.name}
          </h2>
        </Link>
        <p
          className="overflow-hidden text-ellipsis h-20"
          id={`description-${product.id}`}
        >
          {product.description}
        </p>
        <div className="card-actions mt-4" id={`actions-${product.id}`}>
          <p className="text-xl" id={`price-${product.id}`}>
            ${product.price}
          </p>
          <BuyButton product={product} />
        </div>
      </div>
    </div>
  );
};

export default Card;
