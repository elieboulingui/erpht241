import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get("contactId");

  if (!contactId) {
    return NextResponse.json(
      { error: "L'ID du contact est requis." },
      { status: 400 }
    );
  }

  try {
    const contact = await prisma.contact.findUnique({
      where: {
        id: contactId,
      },
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Contact introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du contact." },
      { status: 500 }
    );
  }
}
