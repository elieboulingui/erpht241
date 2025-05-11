"use server"

import prisma  from "@/lib/prisma" // adapte ce chemin à ton projet

export async function updateStepName(stepId: string, newName: string) {
  try {
    await prisma.step.update({
      where: { id: stepId },
      data: { label: newName },
    })

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du step :", error)
    return { success: false, error: "Une erreur est survenue." }
  }
}
