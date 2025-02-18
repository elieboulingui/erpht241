import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import authConfig from "./auth.config";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
      //@ts-ignore
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
  
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login", // This is used for credentials login
    error: "/error", // Custom error page
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email) {
          throw new Error("L'email est requis.");
        }

        const user = await prisma.user.findUnique({
          where: {
                //@ts-ignore
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("Email ou Mot de passe incorrect.");
        }

        if (!user.password) {
          return user; // No password set, allow login directly
        }

        if (credentials?.password) {
          const isCorrectPass = await bcrypt.compare(
                //@ts-ignore
            credentials.password,
            user.password
          );

          if (!isCorrectPass) {
            throw new Error("Email ou Mot de passe incorrect.");
          }
        }

        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
});
