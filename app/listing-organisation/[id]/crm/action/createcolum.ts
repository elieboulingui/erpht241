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

    if (!session?.user?.id) {
      return { success: false, error: "Utilisateur non authentifié" };
    }

    const userId = session.user.id;

    const existingStep = await prisma.step.findFirst({
      where: {
        label,
        organisationId,
      },
    });

    if (existingStep) {
      return { success: false, error: "Cette étape existe déjà pour l'organisation donnée" };
    }

    const newStep = await prisma.step.create({
      data: {
        label,
        description: "Étape sans description",
        organisationId,
        color: color || "#000000", // Défaut : noir
      },
    });

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
        ipAddress: null,
        organisationId,
      },
    });

    return { success: true, newStep };
  } catch (error) {
    console.error("Erreur lors de la création de l'étape:", error);
    return { success: false, error: "Échec de la création de l'étape" };
  }
}
