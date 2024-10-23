import Link from "next/link";
import { LuShield } from "react-icons/lu";
import { getServerSession } from "next-auth";
import Cart from "./cart";
import AvatarMenu from "../AvatarMenu";
import Search from "../Search";

const Header = async ({ isAdmin = false }) => {
  const session = await getServerSession();
  console.log("session is ", session);
  return (
    <>
      <header className="w-full flex justify-around items-center p-2 fixed h-16 z-10 bg-white border-b-2">
        <div className="flex gap-2">
          {isAdmin ? (
            <Link href={"/admin"}>
              <div className="flex gap-2 items-center ">
                <p
                  className="hidden sm:block text-2xl font-bold"
                  id="admin-title"
                >
                  Admin
                </p>
                <LuShield size={25} id="admin-icon" />
              </div>
            </Link>
          ) : (
            <Link href={"/"}>
              <svg
                viewBox="0 0 492.1 121.4"
                className="w-20 hidden sm:block"
                id="logo"
              >
                <path d="M61.4,113.2c-6.2,4.8-14.5,7.4-25.8,7.4c-12.7,0-26-3.9-35.6-13l10.3-16.3c6.8,5.8,18.1,10.3,25,10.3 c6.8,0,11.6-1.7,11.6-7.2s-12.3-8.2-15.4-9.2c-3.3-0.9-8-2.2-12-3.9c-3.9-1.7-14.4-7-14.4-22.1c0-16.4,14.4-26.5,32-26.5 s27.6,6.5,32.3,10.4l-8.9,16.1C55.7,55.4,46.1,51,39.3,51c-6.5,0-10.1,1.7-10.1,6.2s6.5,6.5,12.3,8.2c5.8,1.7,8.4,2.6,12,3.9 c3.8,1.4,8,3.6,11,6.3c2.7,2.7,6.8,8.2,6.8,17.1C71.3,101.3,67.6,108.2,61.4,113.2L61.4,113.2z M134,120c27.4,0,45.7-17.2,45.7-42.8 c0-25.7-18.4-43-45.7-43c-27.5,0-45.9,17.3-45.9,43C88.1,102.8,106.6,120,134,120z M134,54.8c12,0,19.2,9.4,19.2,21.9 S146,98.6,134,98.6c-12.2,0-19.2-9.4-19.2-21.9C114.9,64.2,121.9,54.8,134,54.8z M228.1,119.6h-27.4V1.5h27.4V119.6z M441.6,0h-24 v44c-4.1-5.7-15-9.2-23-9.2c-27.5-0.1-44.8,17.1-44.8,42.8c0,25.6,18.4,42.8,45.9,42.8c27.2,0,45.5-17,45.7-42.3 c0.1-0.7,0.2-1.5,0.2-2.3L441.6,0L441.6,0z M395.7,99c-12.2,0-19.2-9.4-19.2-21.9s7-21.9,19.2-21.9c12,0,19.2,9.4,19.2,21.9 C414.8,89.6,407.6,99,395.7,99z M339.9,35.3l-34.7,84.4h-25.7l-34.6-84.4h28.6l19.2,53.4l19-53.4H339.9z"></path>
                <circle cx="476.2" cy="105.5" r="15.9"></circle>
              </svg>
              <svg className="w-8 sm:hidden" viewBox="0 0 32 32">
                <path
                  className="MuiBox-root mui-4azwwl"
                  d="M31.464 26.1122C31.464 29.1387 29.0229 31.5599 25.9716 31.5599C22.9203 31.5599 20.4792 29.1387 20.4792 26.1122C20.4792 23.0857 22.9203 20.6646 25.9716 20.6646C29.0229 20.7078 31.464 23.129 31.464 26.1122Z"
                ></path>
                <path
                  className="MuiBox-root mui-ie7z86"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M24.0742 18.2004C20.5146 19.1447 17.9197 22.368 17.9197 26.2401C17.9197 27.659 18.2681 28.9907 18.8848 30.1552C17.1206 30.8816 14.9894 31.2572 12.4038 31.2572C8.04477 31.2572 3.4242 29.9169 0.111328 26.804L3.64215 21.2266C5.99603 23.2154 9.91916 24.7287 12.273 24.7287C14.6269 24.7287 16.2834 24.1234 16.2834 22.2643C16.2834 20.6515 13.0687 19.722 11.5338 19.2782C11.2993 19.2104 11.104 19.1539 10.9653 19.1081C9.83198 18.8054 8.17554 18.3298 6.82424 17.7678C5.47294 17.1625 1.85494 15.3466 1.85494 10.2015C1.85494 4.58091 6.82424 1.12207 12.9269 1.12207C19.0295 1.12207 22.4296 3.37032 24.086 4.71062L21.0347 10.2015C19.3783 8.90447 16.0654 7.39122 13.7115 7.39122C11.4448 7.39122 10.2243 7.99652 10.2243 9.50977C10.2243 11.023 12.491 11.758 14.4961 12.3201C14.5719 12.3429 14.6461 12.3653 14.7187 12.3872C16.5678 12.9453 17.4209 13.2028 18.6372 13.6604C19.9449 14.136 21.427 14.871 22.4296 15.8222C22.9467 16.3351 23.5906 17.112 24.0742 18.2004Z"
                ></path>
              </svg>
            </Link>
          )}
        </div>

        <nav className=" sm:flex gap-3">
          <ul className="flex gap-3 items-center">
            <li className="hover:underline">
              <Search />
            </li>
            <li className="hover:underline hidden sm:flex">
              <Cart />
            </li>
          </ul>
        </nav>

        {session ? (
          <AvatarMenu
            name={session?.user?.name}
            email={session?.user?.email}
            isAdmin={isAdmin}
            image={session?.user?.image}
            elementsList={
              isAdmin
                ? [
                    { label: "User's Home", href: "/" },
                    { label: "Categories", href: "/admin/categories" },
                    { label: "Orders", href: "/admin/orders" },
                    { label: "Users", href: "/admin/users" },
                    { label: "Products", href: "/admin/products" },
                  ]
                : [
                    { label: "My orders", href: "/orders-history" },
                    { label: "Settings", href: "/settings" },
                  ]
            }
          />
        ) : (
          <Link href={"/login"} id="login-link">
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
