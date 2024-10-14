"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import LogOutButtonClient from "../LogOutButtonClient";

const ToggleMenu = ({ isAdmin = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) // Cast to Node
    ) {
      setIsMobileMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
      document.addEventListener(
        "touchstart",
        handleClickOutside as EventListener
      ); // Add touch event
    } else {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
      document.removeEventListener(
        "touchstart",
        handleClickOutside as EventListener
      ); // Remove touch event
    }
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside as EventListener
      );
      document.removeEventListener(
        "touchstart",
        handleClickOutside as EventListener
      ); // Clean up touch event
    };
  }, [isMobileMenuOpen, handleClickOutside]);

  return (
    <div className="sm:hidden flex items-center relative" ref={menuRef}>
      <button
        onClick={toggleMobileMenu}
        className="mr-2"
        id="toggle-menu-button"
      >
        {isMobileMenuOpen ? (
          <AiOutlineClose size={25} />
        ) : (
          <AiOutlineMenu size={25} />
        )}
      </button>
      {isMobileMenuOpen && (
        <nav
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-full right-1 mt-2 bg-gray-200 shadow-lg min-w-max rounded-lg"
          id="mobile-menu" // ID for the mobile menu
        >
          <ul className="flex flex-col gap-2 p-2">
            {isAdmin ? (
              <>
                <li className="hover:bg-gray-600 hover:text-white p-1 rounded">
                  <Link className="p-3" href={"/admin"} id="admin-home-link">
                    Admin&apos;s Home
                  </Link>
                </li>
                <li className="hover:bg-gray-600 hover:text-white p-1 rounded">
                  <Link className="p-3" href={"/"} id="user-home-link">
                    User&apos;s Home
                  </Link>
                </li>
                <li className="hover:bg-gray-600 hover:text-white p-1 rounded">
                  <Link
                    className="p-3"
                    href={"/admin/products"}
                    id="products-link"
                  >
                    Products
                  </Link>
                </li>
                <li className="hover:bg-gray-600 hover:text-white p-1 rounded">
                  <Link className="p-3" href={"/admin/users"} id="users-link">
                    Users
                  </Link>
                </li>
                <li className="hover:bg-gray-600 hover:text-white p-1 rounded">
                  <Link
                    className="p-3"
                    href={"/admin/categories"}
                    id="orders-link"
                  >
                    Categories
                  </Link>
                </li>
                <li className="hover:bg-gray-600 hover:text-white p-1 rounded">
                  <Link className="p-3" href={"/admin/orders"} id="orders-link">
                    Orders
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="hover:bg-gray-600 hover:text-white p-1 rounded">
                  <Link className="p-3" href={"/orders"} id="orders-link">
                    Orders
                  </Link>
                </li>
                <li className="hover:bg-gray-600 hover:text-white p-1 rounded">
                  <Link className="p-3" href={"/cart"} id="cart-link">
                    Cart
                  </Link>
                </li>
                <li className="p-1 rounded flex justify-center">
                  {session ? (
                    <LogOutButtonClient />
                  ) : (
                    <Link
                      href={"/login"}
                      className="w-full h-full max-w-24"
                      id="login-link"
                    >
                      <button
                        className="btn btn-primary w-full max-w-24"
                        id="login-button"
                      >
                        Login
                      </button>
                    </Link>
                  )}
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ToggleMenu;
