import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const opportunityId = url.searchParams.get("id");

    if (!opportunityId) {
      return NextResponse.json(
        { error: "ID de l'opportunité manquant." },
        { status: 400 }
      );
    }

    // Récupérer l'opportunité avec le contact associé
    const opportunityWithContact = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      include: { contact: true }, // Inclure le contact lié à l'opportunité
    });

    if (!opportunityWithContact || !opportunityWithContact.contact) {
      return NextResponse.json(
        { error: "Opportunité ou contact non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer tous les rendez-vous associés au contact
    const meetings = await prisma.meeting.findMany({
      where: { contactId: opportunityWithContact.contact.id },
      include: {
        participants: true, // Inclure les participants (si vous avez besoin de ces informations)
      },
    });

    return NextResponse.json(meetings, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des rendez-vous." },
      { status: 500 }
    );
  }
}
