import Link from "next/link";
import LogOutButtonClient from "../LogOutButtonClient";
import { LuShield } from "react-icons/lu";
import ToggleMenu from "./client";
import { getServerSession } from "next-auth";
import Cart from "./cart";

const Header = async ({ isAdmin = false }) => {
  const session = await getServerSession();

  return (
    <>
      <header className="w-full flex justify-around items-center p-2 fixed h-16 z-10 bg-white border-b-2">
        <div className="flex gap-2">
          {isAdmin ? (
            <Link href={"/admin"}>
              <div className="flex gap-2 items-center ">
                <p className="text-2xl font-bold" id="admin-title">
                  Admin
                </p>
                <LuShield size={25} id="admin-icon" />
              </div>
            </Link>
          ) : (
            <Link href={"/"}>
              <svg viewBox="0 0 492.1 121.4" className="w-20" id="logo">
                <path d="M61.4,113.2c-6.2,4.8-14.5,7.4-25.8,7.4c-12.7,0-26-3.9-35.6-13l10.3-16.3c6.8,5.8,18.1,10.3,25,10.3 c6.8,0,11.6-1.7,11.6-7.2s-12.3-8.2-15.4-9.2c-3.3-0.9-8-2.2-12-3.9c-3.9-1.7-14.4-7-14.4-22.1c0-16.4,14.4-26.5,32-26.5 s27.6,6.5,32.3,10.4l-8.9,16.1C55.7,55.4,46.1,51,39.3,51c-6.5,0-10.1,1.7-10.1,6.2s6.5,6.5,12.3,8.2c5.8,1.7,8.4,2.6,12,3.9 c3.8,1.4,8,3.6,11,6.3c2.7,2.7,6.8,8.2,6.8,17.1C71.3,101.3,67.6,108.2,61.4,113.2L61.4,113.2z M134,120c27.4,0,45.7-17.2,45.7-42.8 c0-25.7-18.4-43-45.7-43c-27.5,0-45.9,17.3-45.9,43C88.1,102.8,106.6,120,134,120z M134,54.8c12,0,19.2,9.4,19.2,21.9 S146,98.6,134,98.6c-12.2,0-19.2-9.4-19.2-21.9C114.9,64.2,121.9,54.8,134,54.8z M228.1,119.6h-27.4V1.5h27.4V119.6z M441.6,0h-24 v44c-4.1-5.7-15-9.2-23-9.2c-27.5-0.1-44.8,17.1-44.8,42.8c0,25.6,18.4,42.8,45.9,42.8c27.2,0,45.5-17,45.7-42.3 c0.1-0.7,0.2-1.5,0.2-2.3L441.6,0L441.6,0z M395.7,99c-12.2,0-19.2-9.4-19.2-21.9s7-21.9,19.2-21.9c12,0,19.2,9.4,19.2,21.9 C414.8,89.6,407.6,99,395.7,99z M339.9,35.3l-34.7,84.4h-25.7l-34.6-84.4h28.6l19.2,53.4l19-53.4H339.9z"></path>
                <circle cx="476.2" cy="105.5" r="15.9"></circle>
              </svg>
            </Link>
          )}
        </div>

        <ToggleMenu isAdmin={isAdmin} />

        <nav className="hidden sm:flex gap-3">
          <ul className="flex gap-3 items-center">
            {isAdmin ? (
              <>
                <li className="hover:underline">
                  <Link href={"/admin"} id="admin-home-link">
                    Admin&apos;s Home
                  </Link>
                </li>
                <li className="hover:underline">
                  <Link href={"/"} id="user-home-link">
                    User&apos;s Home
                  </Link>
                </li>
                <li className="hover:underline">
                  <Link href={"/admin/products"} id="products-link">
                    Products
                  </Link>
                </li>
                <li className="hover:underline">
                  <Link href={"/admin/users"} id="users-link">
                    Users
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="hover:underline">
                  <Link href={"/orders-history"} id="orders-link">
                    Orders
                  </Link>
                </li>
                <li className="hover:underline">
                  <Cart />
                </li>
              </>
            )}
          </ul>
        </nav>

        {session ? (
          <div className="hidden sm:flex gap-4 items-center">
            <h2
              className="font-bold text-white"
              style={{ textShadow: "#000 0px 0 5px" }}
              id="user-name"
            >
              {session?.user?.name}
            </h2>
            <LogOutButtonClient />
          </div>
        ) : (
          <Link href={"/login"} className="hidden sm:block" id="login-link">
            <button className="btn btn-primary" id="login-button">
              Login
            </button>
          </Link>
        )}
      </header>
      <div className="w-full h-16 min-h-16"></div>
    </>
  );
};

export default Header;
