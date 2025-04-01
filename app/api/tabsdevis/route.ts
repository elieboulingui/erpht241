import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extraction de l'ID du contact depuis l'URL
  const contactId = searchParams.get("contactId");
console.log(contactId)
  // Si le contactId n'est pas fourni, retourner une erreur
  if (!contactId) {
    return NextResponse.json(
      { error: "L'ID du contact est requis." },
      { status: 400 }
    );
  }

  try {
    // Récupérer tous les devis associés au contactId
    const allDevis = await prisma.devis.findMany({
      where: {
        contactId: contactId, // Filtrer par contactId
        isArchived: false, // Filtrer uniquement les devis non archivés
      },
    });

    // Retourner tous les devis pour ce contact
    return NextResponse.json(
      { data: allDevis },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur dans l'API:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des devis." },
      { status: 500 }
    );
  }
}
