import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const contactId = searchParams.get("contactId");  // Récupère le paramètre contactId de l'URL

    if (!contactId) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 }
      );
    }

    // Recherche des tâches associées à l'ID du contact
    const tasks = await prisma.task.findMany({
      where: {
        contactId: contactId,  // Filtre les tâches par contactId
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Log pour vérifier la sortie des tâches
    console.log("Tâches trouvées pour le contact:", contactId, tasks);

    // Retourner les tâches
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);

    // Retourner une erreur en cas de problème avec la récupération des données
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
