/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      name: string;
      email: string;
      isAdmin: boolean;
      isBlocked: boolean;
      externalProvider?: string;
    };
  }

  interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    isBlocked: boolean;
    externalProvider?: string;
  }

  interface JWT {
    user: {
      _id: string;
      name: string;
      email: string;
      isAdmin: boolean;
      isBlocked: boolean;
      externalProvider?: string;
    };
  }
}
