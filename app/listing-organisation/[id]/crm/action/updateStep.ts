"use server"

import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"
import { inngest } from "@/inngest/client"

const prisma = new PrismaClient()

export async function updateStep(stepId: string, label: string, color: string | null, organisationId: string) {
  try {
    console.log("Fonction updateStep appelée avec:", { stepId, label, color, organisationId })

    const session = await auth()

    // Checking if the user is authenticated
    if (!session?.user?.id) {
      return { success: false, error: "Utilisateur non authentifié" }
    }

    const userId = session.user.id

    // Get the existing step to store as oldData
    console.log("Recherche de l'étape avec ID:", stepId)
    const existingStep = await prisma.step.findUnique({
      where: {
        id: stepId,
      },
    })
    console.log("Étape trouvée:", existingStep)

    if (!existingStep) {
      console.error("Étape introuvable avec ID:", stepId)
      return { success: false, error: "Étape introuvable" }
    }

    // Check if another step with the same label already exists for the organization
    const duplicateStep = await prisma.step.findFirst({
      where: {
        label,
        organisationId,
        id: { not: stepId }, // Exclude the current step
      },
    })

    if (duplicateStep) {
      return { success: false, error: "Une autre étape avec ce nom existe déjà" }
    }

    // Updating the step
    console.log("Mise à jour de l'étape avec:", { stepId, label, color })
    const updatedStep = await prisma.step.update({
      where: {
        id: stepId,
      },
      data: {
        label,
        color,
      },
    })
    console.log("Étape mise à jour:", updatedStep)

    // Sending event to Inngest
    await inngest.send({
      name: "activity/stepupdated",
      data: {
        action: "Modification d'une étape",
        entityType: "Step",
        entityId: stepId,
        oldData: existingStep,
        newData: updatedStep,
        userId,
        actionDetails: `L'étape '${existingStep.label}' a été modifiée en '${label}' dans l'organisation ${organisationId}`,
        entityName: "Step",
        ipAddress: null,
        organisationId,
      },
    })

    return { success: true, updatedStep }
  } catch (error) {
    console.error("Erreur lors de la modification de l'étape:", error)
    return { success: false, error: "Échec de la modification de l'étape" }
  }
}
