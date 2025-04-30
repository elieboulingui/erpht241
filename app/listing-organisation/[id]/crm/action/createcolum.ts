// app/actions/stepActions.ts
"use server"

import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"
import { inngest } from "@/inngest/client"

const prisma = new PrismaClient()

export async function addStep(
  label: string,
  organisationId: string,
  color: string | null
) {
  try {
    const session = await auth();

    // Checking if the user is authenticated
    if (!session?.user?.id) {
      return { success: false, error: "Utilisateur non authentifié" };
    }

    const userId = session.user.id;

    // Check if a step with the same label already exists for the organization
    const existingStep = await prisma.step.findFirst({
      where: {
        label,
        organisationId,
      },
    });

    if (existingStep) {
      return { success: false, error: "Cette étape existe déjà pour l'organisation donnée" };
    }

    // Creating the new step
    const newStep = await prisma.step.create({
      data: {
        label,
        description: "Étape sans description", // Default description
        organisationId,
        color,
      },
    });

    // Sending event to Inngest
    await inngest.send({
      name: "activity/stepadded",
      data: {
        action: "Création d'une étape",
        entityType: "Step",
        entityId: newStep.id,
        oldData: null,
        newData: newStep,
        userId,
        actionDetails: `L'étape '${label}' a été ajoutée à l'organisation ${organisationId}`,
        entityName: "Step",
        ipAddress: null, // Add IP address here if needed
        organisationId, // Added here
      },
    });

    return { success: true, newStep };
  } catch (error) {
    console.error("Erreur lors de la création de l'étape:", error);
    return { success: false, error: "Échec de la création de l'étape" };
  }
}
