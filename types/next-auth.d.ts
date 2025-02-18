// types/next-auth.d.ts
import NextAuth from "next-auth"

// Étendre le type `User` pour inclure `role`
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string // Ajoute la propriété `role`
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string // Ajoute la propriété `role` ici aussi
  }
}
