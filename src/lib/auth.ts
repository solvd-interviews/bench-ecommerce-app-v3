import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/lib/models/UserModel";
import GoogleProvider from "next-auth/providers/google";

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
          password.length < 6
        ) {
          throw new Error("Invalid email or password.");
        }

        const user = await UserModel.findOne({ email });
        if (user) {
          if (!user.password) {
            throw new Error(
              "This account uses Google Sign-In. Please use the Google button to log in."
            );
          }
          const isMatch = await compare(password, user.password);
          if (isMatch) {
            return user.toObject();
          } else {
            throw new Error("Incorrect email or password.");
          }
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ user, account, trigger, session, token }: any) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      if (user) {
        if (account?.provider === "google") {
          await dbConnect();
          console.log("google user: ", user);
          let dbUser = await UserModel.findOne({ email: user.email });
          if (!dbUser) {
            dbUser = await UserModel.create({
              name: user.name,
              email: user.email,
              isBlocked: false,
              isAdmin: false,
              externalProvider: "Google",
              imgProfile: user.picture,
            });
          }
          token.user = {
            _id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            isBlocked: dbUser.isBlocked,
            isAdmin: dbUser.isAdmin,
            externalProvider: "Google",
            imgProfile: user.picture,
          };
        } else {
          token.user = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            isBlocked: user.isBlocked,
            isAdmin: user.isAdmin,
            externalProvider: user.externalProvider,
          };
        }
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token?.user) {
        session.user = {
          ...session.user,
          _id: token.user._id,
          isAdmin: token.user.isAdmin,
          isBlocked: token.user.isBlocked,
          externalProvider: token.user.externalProvider,
          imgProfile: token.user.picture,
        };
      }
      return session;
    },
  },
};
