// app/actions/stepActions.ts
"use server"

import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"
import { inngest } from "@/inngest/client"

const prisma = new PrismaClient()

export async function addStep(label: string,  organisationId: string, color: string | null) {
  try {
    const session = await auth()

    // Vérifier si l'utilisateur est authentifié
    if (!session?.user?.id) {
      return { success: false, error: "Utilisateur non authentifié" }
    }

    const userId = session.user.id

    // Vérifier si une étape avec le même label existe déjà pour l'organisation donnée
    const existingStep = await prisma.step.findUnique({
      where: {
        label_organisationId: {
          label,
          organisationId,
        },
      },
    })

    // Si l'étape existe déjà, retourner une erreur
    if (existingStep) {
      return { success: false, error: "Cette étape existe déjà pour l'organisation donnée" }
    }

    // Créer une nouvelle étape
    const newStep = await prisma.step.create({
      data: {
        label,
        organisationId,
        color, // Peut être null
      },
    })

    // 🔄 Envoi d'un événement à Inngest
    await inngest.send({
      name: "activity/step.added",
      data: {
        action: "Création d'une étape",
        entityType: "Step",
        entityId: newStep.id,
        oldData: null,
        newData: newStep,
        userId,
        actionDetails: `L'étape '${label}' a été ajoutée à l'organisation ${organisationId}`,
        entityName: "Step",
      },
    })

    return { success: true, newStep }
  } catch (error) {
    console.error("Erreur lors de la création de l'étape:", error)
    return { success: false, error: "Échec de la création de l'étape" }
  }
}
