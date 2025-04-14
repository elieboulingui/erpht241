import prisma from "@/lib/prisma"; // Assurez-vous que le client Prisma est correctement importé
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { taskId, updatedTask } = await req.json(); // Récupérer les données JSON envoyées
  
    console.log('Données reçues:', { taskId, updatedTask }); // Log des données reçues
  
    // Vérification des données reçues
    if (!taskId || !updatedTask) {
      return NextResponse.json({ error: "Task ID and updated task data are required" }, { status: 400 });
    }
  
    // Récupérer les données actuelles de la tâche avant mise à jour
    const oldTask = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!oldTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Mise à jour de la tâche avec les nouvelles données
    const updatedTaskInDb = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: updatedTask.title,
        description: updatedTask.description,
        type: updatedTask.type,
        status: updatedTask.status,
        priority: updatedTask.priority,
        assignee: updatedTask.assignee,
        dueDate: updatedTask.dueDate,
        organisationId: updatedTask.organisationId,
        createdById: updatedTask.createdById,
        updatedAt: new Date(),
        isArchived: updatedTask.isArchived,
        archivedAt: updatedTask.archivedAt,
        archivedBy: updatedTask.archivedBy,
      },
    });

    // Créer un journal d'activité pour la mise à jour de la tâche
    await prisma.activityLog.create({
      data: {
        action: "Mise à jour de tâche",
        entityType: "Tâche",
        entityId: taskId,
        oldData: oldTask,  // Anciennes données
        newData: updatedTaskInDb, // Nouvelles données
        userId: updatedTask.createdById, // ID de l'utilisateur qui effectue l'action
        organisationId: updatedTask.organisationId,
        createdByUserId: updatedTask.createdById,  // ID du créateur de l'activité
        actionDetails: `Mise à jour de la tâche ${taskId} avec les nouveaux détails.`,
        entityName: "Task",
      },
    });

    // Retourner la tâche mise à jour
    return NextResponse.json(updatedTaskInDb);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
