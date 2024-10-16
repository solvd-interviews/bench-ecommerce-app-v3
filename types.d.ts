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
