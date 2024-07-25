import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";
export const config = {
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: "email",
        },
        password: { type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }
        const { email, password } = credentials;
        await dbConnect();
        if (
          typeof email !== "string" ||
          email.length < 3 ||
          typeof password !== "string" ||
          email.length < 3
        ) {
          throw new Error("The email or password are incorrect. Err 1.");
        }

        const user = await UserModel.findOne({ email });
        console.log("user: login", user);
        if (user) {
          console.log("user true");
          const isMatch = await compare(password, user.password);
          console.log("first, ", password, user.password, isMatch);
          if (isMatch) {
            console.log("MATCH TRUE");
            return user.toObject();
          } else {
            console.log("MATCH FALSE");

            throw new Error("The email or password are incorrect. Err 2.");
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ user, trigger, session, token }: any) {
      console.log("jwt user: ", user);
      if (user) {
        token.user = {
          _id: user._id.toString(), // Ensure _id is a string
          name: user.name,
          email: user.email,
          isBlocked: user.isBlocked,
          isAdmin: user.isAdmin,
        };
      }
      if (trigger === "update" && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          name: session.user.name,
        };
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          ...session.user,
          _id: token.user._id, // Include _id in session
          isAdmin: token.user.isAdmin,
          isBlocked: token.user.isBlocked,
        };
      }
      return session;
    },
  },
};
