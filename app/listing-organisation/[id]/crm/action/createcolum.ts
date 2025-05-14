"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client";

const prisma = new PrismaClient();

export async function addStep(
  label: string,
  organisationId: string,
  color: string | null
) {
  try {
    // Vérifier si l'utilisateur est authentifié
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Utilisateur non authentifié" };
    }

    const userId = session.user.id;

    // Vérifier si une étape avec le même label existe déjà dans l'organisation
    const existingStep = await prisma.step.findFirst({
      where: {
        label,
        organisationId,
      },
    });

    // Trouver la dernière étape de cette organisation (stepNumber le plus élevé)
    const highestStep = await prisma.step.findFirst({
      where: { organisationId },
      orderBy: { stepNumber: "desc" },
    });

    // Déterminer le numéro de l'étape suivante
    const stepNumber = highestStep ? highestStep.stepNumber + 1 : 1;

    // Créer la nouvelle étape
    const newStep = await prisma.step.create({
      data: {
        label,
        description: "Étape sans description",
        organisationId,
        color: color || "#FFFFFF",
        stepNumber,
      },
    });

    // Envoi de l'activité à inngest
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

    console.log(newStep);
    return { success: true, newStep };

  } catch (error: any) {
    console.error("Erreur lors de la création de l'étape:", error);
    return {
      success: false,
      error: `Échec de la création de l'étape: ${error.message}`,
    };
  }
}
