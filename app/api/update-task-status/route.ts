import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assurez-vous d'avoir configuré Prisma

export async function POST(req: NextRequest) {
  try {
    // Récupérer les données envoyées dans la requête
    const { taskId, newStatus } = await req.json();

    // Vérifier que les données nécessaires sont présentes
    if (!taskId || !newStatus) {
      return NextResponse.json(
        { error: "Task ID and new status are required" },
        { status: 400 }
      );
    }

    // Récupérer les anciennes données de la tâche avant la mise à jour
    const oldTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!oldTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    // Mettre à jour le statut de la tâche dans la base de données
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: newStatus,
      },
    });

    // Créer un journal d'activité pour la mise à jour du statut de la tâche
    // await prisma.activityLog.create({
    //   data: {
    //     action: "Mise à jour du statut de la tâche",
    //     entityType: "Tâche",
    //     entityId: taskId,
    //     oldData: oldTask, // Anciennes données
    //     newData: updatedTask, // Nouvelles données
    //     userId: updatedTask.createdById, // ID de l'utilisateur qui effectue l'action
    //     organisationId: updatedTask.organisationId,
    //     createdByUserId: updatedTask.createdById,  // ID du créateur de l'activité
    //     actionDetails: `Mise à jour du statut de la tâche ${taskId} de '${oldTask.status}' à '${newStatus}'.`,
    //     entityName: "Task",
    //   },
    // });

    // Retourner la tâche mise à jour
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    // Gérer les erreurs
    console.error('Erreur lors de la mise à jour du statut de la tâche:', error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut de la tâche" },
      { status: 500 }
    );
  }
}
