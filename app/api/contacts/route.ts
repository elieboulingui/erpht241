import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contactId");

    console.log("API GET /api/contacts appelée avec contactId:", contactId);

    if (!contactId) {
      return NextResponse.json(
        { error: "L'ID du contact est requis." },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.findUnique({
      where: {
        id: contactId,
      },
      include: {
        organisations: true, 
        // Ajoutez d'autres relations si nécessaire
      },
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Contact non trouvé." },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);
    
  } catch (error) {
    console.error("Erreur lors de la récupération du contact:", error);
    return NextResponse.json(
      { 
        error: "Erreur serveur lors de la récupération du contact.",
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
