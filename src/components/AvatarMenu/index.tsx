"use client";
import { useState, useEffect, useRef } from "react";
import LogOutButtonClient from "../LogOutButtonClient";
import Link from "next/link";
import Cart from "../Header/cart";

interface AvatarMenuProps {
  name: string;
  email: string;
  image?: string;
  elementsList: { label: string; href: string }[];
  isAdmin: boolean;
}

const getInitials = (name: string) => {
  const initials = name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
  return initials;
};

const AvatarMenu: React.FC<AvatarMenuProps> = ({
  name,
  email,
  image,
  elementsList,
  isAdmin,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setMenuOpen((prevOpen) => !prevOpen);
  };

  // UseEffect to detect clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false); // Close the menu if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Avatar */}
      <div className="avatar cursor-pointer" onClick={toggleMenu}>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-primary`}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name}
              className="w-full h-full rounded-full"
            />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-xl">
              {getInitials(name)}
            </span>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          id="userDropdown"
          className="z-10 absolute right-0  cursor-default bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
        >
          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
            {isAdmin && <div className="font-bold text-lg">Admin</div>}
            <div>{name}</div>
            <div className="font-medium truncate">{email}</div>
          </div>
          <div
            className="px-4 py-2 w-full flex sm:hidden"
            onClick={() => {
              setMenuOpen(false);
            }}
          >
            <Cart />
          </div>
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="avatarButton"
          >
            {elementsList.map((element, idx) => (
              <li key={idx}>
                <Link
                  href={element.href}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                >
                  {element.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="px-4 py-2 w-full flex">
            <LogOutButtonClient />
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarMenu;
