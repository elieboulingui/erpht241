// app/api/user-organisations/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Importation de ta logique d'auth
import prisma from "@/lib/prisma"; // Prisma Client pour accéder à la base de données

export async function GET() {
  try {
    // Récupérer la session via la logique d'auth

    // Récupérer les organisations où l'utilisateur est soit membre (avec rôle ADMIN), soit propriétaire
    const organisations = await prisma.contact.findMany()
    return NextResponse.json(organisations);
  } catch (error) {
    console.error("Error fetching user organizations:", error);
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 });
  }
}
