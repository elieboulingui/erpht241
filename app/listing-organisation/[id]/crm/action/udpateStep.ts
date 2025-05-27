"use server"

import prisma from "@/lib/prisma"
import { inngest } from "@/inngest/client"

export async function updateStepName(stepId: string, newName: string, userId?: string) {
  try {
    const oldStep = await prisma.step.findUnique({ where: { id: stepId } })
    if (!oldStep) return { success: false, error: "Étape introuvable." }

    const updatedStep = await prisma.step.update({
      where: { id: stepId },
      data: { label: newName },
    })

    // ✅ Envoi à Inngest
    await inngest.send({
      name: "step/updated",
      data: {
        stepId,
        userId: userId ?? null,
        oldData: oldStep,
        newData: updatedStep,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du step :", error)
    return { success: false, error: "Une erreur est survenue." }
  }
}
