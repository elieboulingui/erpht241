"use server"

import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"
import { inngest } from "@/inngest/client"

const prisma = new PrismaClient()

export async function addFavorite(contactId: string, organisationId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: "Utilisateur non authentifié" }
    }

    const userId = session.user.id

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        contactId_organisationId: {
          contactId,
          organisationId,
        },
      },
    })

    if (existingFavorite) {
      return { success: false, error: "Ce contact est déjà dans vos favoris" }
    }

    const newFavorite = await prisma.favorite.create({
      data: {
        contactId,
        organisationId,
      },
    })

    // 🔄 Envoie un événement à Inngest au lieu de logger directement
    await inngest.send({
      name: "activity/favorite.added",
      data: {
        action: "Ajout aux favoris",
        entityType: "Favorite",
        entityId: newFavorite.id,
        oldData: null,
        newData: newFavorite,
        userId,
        actionDetails: `Le contact avec ID ${contactId} a été ajouté aux favoris pour l'organisation ${organisationId}`,
        entityName: "Favorite",
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error adding favorite:", error)
    return { success: false, error: "Échec de l'ajout aux favoris" }
  }
}
