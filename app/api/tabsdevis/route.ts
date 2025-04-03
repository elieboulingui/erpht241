import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get("contactId");

    // Vérification si le contactId est fourni
    if (!contactId) {
      return NextResponse.json(
        { error: "L'ID du contact est requis." },
        { status: 400 }
      );
    }

    console.log("Contact ID reçu:", contactId);

    // Vérifier si des devis existent pour ce contact
    const allDevis = await prisma.devis.findMany({
      where: {
        contactId: contactId,
        isArchived: false,
      },
      select: {
        id: true,
        devisNumber: true,
        status: true,
        totalAmount: true,
      },
    });

    console.log("Devis récupérés :", allDevis);

    // Vérification s'il y a des devis trouvés
    if (allDevis.length === 0) {
      return NextResponse.json(
        { message: "Aucun devis trouvé pour ce contact." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: allDevis }, { status: 200 });

  } catch (error) {
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des devis." },
      { status: 500 }
    );
  }
}
