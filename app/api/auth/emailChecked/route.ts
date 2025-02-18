import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  
  // Vérification si l'utilisateur existe
  const user = await prisma.user.findUnique({ where: { email } });

  // Si l'utilisateur existe
  if (user) {
    return NextResponse.json({ exists: true });
  }

  // Si l'utilisateur n'existe pas
  return NextResponse.json({ exists: false });
}
