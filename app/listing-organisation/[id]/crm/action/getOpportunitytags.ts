"use server"

import prisma from "@/lib/prisma"

export async function getOpportunitytags(id: string) {
  if (!id) {
    return { error: "ID de l'opportunité manquant" }
  }

  try {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      // ❌ Pas besoin d’include pour les champs scalaires comme 'tags'
    })

    if (!opportunity) {
      return { error: "Opportunité non trouvée" }
    }

    return { data: opportunity }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'opportunité:", error)
    return { error: "Erreur serveur" }
  }
}
