import BrandedProducts from "@/components/BrandedProducts";
import Card from "@/components/Card";
import { fetchBrandedProducts, fetchProducts } from "@/lib/utils/products";
import Link from "next/link";

export default async function Home() {
  const [res, resBranded] = await Promise.all([
    fetchProducts(),
    fetchBrandedProducts(),
  ]);
  return (
    <div className="w-full   flex-col p-4 sm:p-10 gap-4 items-center  justify-center ">
      <div className="w-full flex justify-center">
        <BrandedProducts brandedProd={resBranded} />
      </div>
      <div className="w-full flex justify-center mt-6 sm:mt-10 gap-4">
        <Link
          className=" w-56 h-  rounded-xl flex flex-col justify-center items-center shadow-xl bg-secondary bg-cover bg-center"
          href={"/categories/tendency"}
          style={{ backgroundImage: `url('/tendency.png')` }}
        >
          <span
            className="text-3xl sm:text-4xl font-bold text-white "
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
          >
            <svg
              fill="#fff"
              height="60px"
              width="60px"
              version="1.1"
              id="Capa_1"
              viewBox="0 0 611.999 611.999"
              className="sm:hidden"
            >
              <g>
                <path d="M216.02,611.195c5.978,3.178,12.284-3.704,8.624-9.4c-19.866-30.919-38.678-82.947-8.706-149.952   c49.982-111.737,80.396-169.609,80.396-169.609s16.177,67.536,60.029,127.585c42.205,57.793,65.306,130.478,28.064,191.029   c-3.495,5.683,2.668,12.388,8.607,9.349c46.1-23.582,97.806-70.885,103.64-165.017c2.151-28.764-1.075-69.034-17.206-119.851   c-20.741-64.406-46.239-94.459-60.992-107.365c-4.413-3.861-11.276-0.439-10.914,5.413c4.299,69.494-21.845,87.129-36.726,47.386   c-5.943-15.874-9.409-43.33-9.409-76.766c0-55.665-16.15-112.967-51.755-159.531c-9.259-12.109-20.093-23.424-32.523-33.073   c-4.5-3.494-11.023,0.018-10.611,5.7c2.734,37.736,0.257,145.885-94.624,275.089c-86.029,119.851-52.693,211.896-40.864,236.826   C153.666,566.767,185.212,594.814,216.02,611.195z" />
              </g>
            </svg>
            <p className="hidden sm:block">Trending</p>
          </span>
        </Link>

        <Link
          className=" w-56 h-  rounded-xl flex flex-col justify-center items-center shadow-xl bg-secondary bg-cover bg-center"
          href={"/categories/new"}
          style={{ backgroundImage: `url('/new.png')` }}
        >
          <span
            className="text-3xl sm:text-4xl font-bold text-white "
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60px"
              height="60px"
              viewBox="0 0 48 48"
              className="sm:hidden"
              fill="#fff"
            >
              <g id="Layer_2" data-name="Layer 2">
                <g id="invisible_box" data-name="invisible box">
                  <rect width="48" height="48" fill="none" />
                </g>
                <g id="icons_Q2" data-name="icons Q2">
                  <path d="M42.3,24l3.4-5.1a2,2,0,0,0,.2-1.7A1.8,1.8,0,0,0,44.7,16l-5.9-2.4-.5-5.9a2.1,2.1,0,0,0-.7-1.5,2,2,0,0,0-1.7-.3L29.6,7.2,25.5,2.6a2.2,2.2,0,0,0-3,0L18.4,7.2,12.1,5.9a2,2,0,0,0-1.7.3,2.1,2.1,0,0,0-.7,1.5l-.5,5.9L3.3,16a1.8,1.8,0,0,0-1.2,1.2,2,2,0,0,0,.2,1.7L5.7,24,2.3,29.1a2,2,0,0,0,1,2.9l5.9,2.4.5,5.9a2.1,2.1,0,0,0,.7,1.5,2,2,0,0,0,1.7.3l6.3-1.3,4.1,4.5a2,2,0,0,0,3,0l4.1-4.5,6.3,1.3a2,2,0,0,0,1.7-.3,2.1,2.1,0,0,0,.7-1.5l.5-5.9L44.7,32a2,2,0,0,0,1-2.9ZM18,31.1l-4.2-3.2L12.7,27h-.1l.6,1.4,1.7,4-2.1.8L9.3,24.6l2.1-.8L15.7,27l1.1.9h0a11.8,11.8,0,0,0-.6-1.3l-1.6-4.1,2.1-.9,3.5,8.6Zm3.3-1.3-3.5-8.7,6.6-2.6.7,1.8L20.7,22l.6,1.6L25.1,22l.7,1.7L22,25.2l.7,1.9,4.5-1.8.7,1.8Zm13.9-5.7-2.6-3.7-.9-1.5h-.1a14.7,14.7,0,0,1,.4,1.7l.8,4.5-2.1.9-5.9-7.7,2.2-.9,2.3,3.3,1.3,2h0a22.4,22.4,0,0,1-.4-2.3l-.7-4,2-.8L33.8,19,35,20.9h0s-.2-1.4-.4-2.4L34,14.6l2.1-.9,1.2,9.6Z" />
                </g>
              </g>
            </svg>
            <p className="hidden sm:block">New</p>
          </span>
        </Link>

        <Link
          className=" w-56 py-4  rounded-xl flex flex-col justify-center items-center shadow-xl bg-secondary bg-cover bg-center"
          href={"/categories/all"}
          style={{ backgroundImage: `url('/Categories.png')` }}
        >
          <span
            className="text-3xl sm:text-4xl font-bold text-white "
            style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.75)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60px"
              height="60px"
              viewBox="0 0 24 24"
              fill="none"
              className="sm:hidden"
            >
              <g clip-path="url(#clip0_429_11052)">
                <circle
                  cx="17"
                  cy="7"
                  r="3"
                  stroke="#FFF"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle
                  cx="7"
                  cy="17"
                  r="3"
                  stroke="#FFF"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M14 14H20V19C20 19.5523 19.5523 20 19 20H15C14.4477 20 14 19.5523 14 19V14Z"
                  stroke="#FFF"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4 4H10V9C10 9.55228 9.55228 10 9 10H5C4.44772 10 4 9.55228 4 9V4Z"
                  stroke="#FFF"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_429_11052">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <p className="hidden sm:block">Categories</p>
          </span>
        </Link>
      </div>
      <div className="w-full mt-6 sm:mt-10 grid place-items-center gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
        {res.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
