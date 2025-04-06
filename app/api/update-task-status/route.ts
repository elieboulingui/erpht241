import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assurez-vous d'avoir configuré Prisma

export async function POST(req: NextRequest) {
  try {
    // Récupérer les données envoyées dans la requête
    const { taskId, newStatus } = await req.json();

    // Mettre à jour le statut de la tâche dans la base de données
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: newStatus,
      },
    });

    // Retourner la tâche mise à jour
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    // Gérer les erreurs
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut de la tâche" },
      { status: 500 }
    );
  }
}
