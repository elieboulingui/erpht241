import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const stepId = url.searchParams.get("stepId");

    const opportunities = await prisma.opportunity.findMany({
      where: stepId ? { stepId } : {},
      include: {
        step: true,
        contact: true,
      },
    });

    if (opportunities.length === 0) {
      return NextResponse.json(
        { message: "Aucune opportunité trouvée." },
        { status: 404 }
      );
    }

    const contacts = opportunities
      .filter(
        (opp): opp is typeof opp & { contact: NonNullable<typeof opp.contact> } =>
          opp.contact !== null
      )
      .map((opp) => ({
        id: opp.contact.id,
        name: opp.contact.name,
        logo: opp.contact.logo,
        adresse: opp.contact.adresse,
        status_contact: opp.contact.status_contact,
        email: opp.contact.email,
        phone: opp.contact.phone,
        niveau: opp.contact.niveau,
        tags: opp.contact.tags,
        sector: opp.contact.sector,
        createdAt: opp.contact.createdAt,
        updatedAt: opp.contact.updatedAt,
        isArchived: opp.contact.isArchived,
        archivedAt: opp.contact.archivedAt,
        archivedBy: opp.contact.archivedBy,
        createdByUserId: opp.contact.createdByUserId,
        updatedByUserId: opp.contact.updatedByUserId,
      }));

    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des contacts :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des contacts." },
      { status: 500 }
    );
  }
}
