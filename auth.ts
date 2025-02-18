import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import credentials from "next-auth/providers/credentials";
import authConfig from "./auth.config";
import bcrypt from "bcryptjs"; // assuming bcrypt is used for password hashing

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
    signIn: "/connexion",
    error: "/error",
  },
  providers: [
    credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email) {
          throw new Error("L'email est requis.");
        }

        // Recherche de l'utilisateur par email
        const user = await prisma.user.findUnique({
          where: {
             //@ts-ignore
            email: credentials.email,
          },
        });

        // Si l'utilisateur n'existe pas, on lance une erreur
        if (!user) {
          throw new Error("Email ou Mot de passe incorrect.");
        }

        // Si l'utilisateur existe mais sans mot de passe, se connecter directement
        if (!user.password) {
          return user; // No password set, allow login directly
        }

        // Si un mot de passe est défini, vérifier la correspondance
        if (credentials?.password) {
          const isCorrectPass = await bcrypt.compare(
            // @ts-ignore
            credentials.password,
            user.password
          );

          if (!isCorrectPass) {
            throw new Error("Email ou Mot de passe incorrect.");
          }
        }

        // Retourner l'utilisateur si l'authentification est réussie
        return user;
      },
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
        token.role = user.role; // Assign the role to the JWT
      }
      return token;
    },
  },
});
