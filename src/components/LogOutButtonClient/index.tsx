"use client";
import { LuLogOut } from "react-icons/lu";
import { signOut, useSession } from "next-auth/react";
import useCartService from "@/lib/hooks/useCartStore";

export default function LogOutButtonClient() {
  const { data: session } = useSession();
  const { init } = useCartService();

  return (
    <button
      id="logout-button"
      className="btn btn-primary w-full max-w-24"
      onClick={() => {
        signOut();
        init();
      }}
    >
      <p id="logout-text" className="hidden md:flex">
        Logout
      </p>
      <LuLogOut id="logout-icon" />
    </button>
  );
}
