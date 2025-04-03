"use server"
import prisma from "@/lib/prisma"; // Assurez-vous d'avoir configuré Prisma
import { redirect } from "next/navigation";
import { TaskType } from "@prisma/client"; // Import TaskType from Prisma client
import { getSession } from "next-auth/react"; // Assuming you're using next-auth for authentication

// Fonction pour créer une tâche
export async function createTask({
  title,
  description,
  status,
  priority,
  type,
  organisationId,
  contactId,    // ID of the contact associated with the task
}: {
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE"; // Example for TaskStatus
  priority: "LOW" | "MEDIUM" | "HIGH"; // Example for TaskPriority
  type: TaskType;  // Use TaskType as the type
  organisationId: string;
  contactId: string;    // ID of the contact associated with the task
}) {
  try {
    // Retrieve the authenticated session
    const session = await getSession(); // Fetch the session data

    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const createdById = session.user.id; // Access the user ID from the session

    // Ensure the organisation exists
    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });

    if (!organisation) {
      throw new Error("Organisation introuvable");
    }

    // Ensure valid status and priority
    const taskStatus = status as "TODO" | "IN_PROGRESS" | "DONE";
    const taskPriority = priority as "LOW" | "MEDIUM" | "HIGH";

    // Create the task in the database
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: taskStatus,
        priority: taskPriority,
        type,  // Prisma expects TaskType here
        organisationId,
        createdById,  // Added createdById from the authenticated user,    // Added contactId
      },
    });

    // Redirect to the task management page after creation
    redirect(`/listing-organisation/${organisationId}/tasks`);

  } catch (error) {
    console.error("Erreur lors de la création de la tâche:", error);
    throw new Error(error instanceof Error ? error.message : "Erreur inconnue");
  }
}
