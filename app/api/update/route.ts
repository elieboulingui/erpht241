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
        assignee: updatedTask.assignee, // Utilisez `assignee` ici
        dueDate: updatedTask.dueDate,
        organisationId: updatedTask.organisationId,
        createdById: updatedTask.createdById,
        updatedAt: new Date(),
        isArchived: updatedTask.isArchived,
        archivedAt: updatedTask.archivedAt,
        archivedBy: updatedTask.archivedBy,
      },
    });

    // Retourner la tâche mise à jour
    return NextResponse.json(updatedTaskInDb);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
