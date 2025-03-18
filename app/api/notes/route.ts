// app/api/notes/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  // Récupérer le contactId depuis les paramètres de la requête
  const contactId = req.nextUrl.searchParams.get("contactId");

  // Vérifier si contactId est fourni, sinon renvoyer une erreur
  if (!contactId) {
    return new NextResponse("Contact ID required", { status: 400 });
  }

  try {
    // Récupérer les notes associées au contactId, non archivées
    const notes = await prisma.note.findMany({
      where: {
        contactId,
        isArchived: false, // Assurez-vous que la note n'est pas archivée
      },
      select: {
        id: true,
        title: true,
        content: true,
        color: true,
        isPinned: true,
      },
    });

    // Afficher les notes dans la console (facultatif pour le débogage)
    console.log(notes);

    // Retourner les notes au format JSON
    return NextResponse.json(notes);
  } catch (error) {
    // Gestion des erreurs (erreur interne serveur)
    console.error("[NOTES_GET]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal error",
      { status: 500 }
    );
  }
}
