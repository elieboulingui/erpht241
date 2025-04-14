"use server"
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TaskType } from "@prisma/client";
import { getSession } from "next-auth/react";

export async function createTask({
  title,
  description,
  status,
  priority,
  type,
  organisationId,
  contactId, // Tu peux garder ce paramètre si tu veux l'utiliser pour l'ActivityLog
}: {
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  type: TaskType;
  organisationId: string;
  contactId: string;
}) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const createdById = session.user.id;

    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });

    if (!organisation) {
      throw new Error("Organisation introuvable");
    }

    const taskStatus = status;
    const taskPriority = priority;

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: taskStatus,
        priority: taskPriority,
        type,
        organisationId,
        createdById,
      },
    });

    // Création du log d'activité
    await prisma.activityLog.create({
      data: {
        action: "CREATE_TASK",
        entityType: "Task",
        entityId: newTask.id,
        newData: newTask,
        userId: createdById,
        createdByUserId: createdById,
        organisationId: organisationId,
        contactId: contactId, // Peut toujours être utile pour le contexte du log
        taskId: newTask.id,
      },
    });

    redirect(`/listing-organisation/${organisationId}/tasks`);
  } catch (error) {
    console.error("Erreur lors de la création de la tâche:", error);
    throw new Error(error instanceof Error ? error.message : "Erreur inconnue");
  }
}
