import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      where: {
        isArchived: false, // enlève cette ligne si tu veux aussi les archivés
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des contacts." },
      { status: 500 }
    );
  }
}
