import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Récupère l'ID du devis depuis les paramètres de l'URL
    const devisId = request.nextUrl.searchParams.get("id");

    if (!devisId) {
      return NextResponse.json({ error: "L'ID du devis est requis" }, { status: 400 });
    }

    // Recherche du devis par son ID (seul)
    const devis = await prisma.devis.findUnique({
      where: { id: devisId },
      include: {
        contact: true,  // Assurez-vous que les informations du client sont incluses
        items: true,    // Si vous voulez également les produits
      }, // Recherche uniquement par l'ID du devis
    });

    // Si aucun devis n'est trouvé, retourne une erreur
    if (!devis || !devis.contact) {
      return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
    }

    // Renommez la propriété "contact" en "client"
    const devisWithClient = {
      ...devis,
      client: devis.contact,  // Renommez ici
    };

    // Utilisez le type assertion pour dire à TypeScript que c'est sûr de supprimer "contact"
    delete (devisWithClient as { contact?: any }).contact;

    // Retourne le devis avec les informations du client
    return NextResponse.json(devisWithClient, { status: 200 });

  } catch (error) {
    console.error("Erreur API devis :", error);
    return NextResponse.json({ error: "Erreur serveur, veuillez réessayer plus tard" }, { status: 500 });
  }
}
