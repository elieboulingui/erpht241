"use server"

import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function removeFavorite(contactId: string, organisationId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: "Utilisateur non authentifié" }
    }

    const userId = session.user.id

    const favoriteToDelete = await prisma.favorite.findUnique({
      where: {
        contactId_organisationId: {
          contactId,
          organisationId,
        },
      },
    })

    if (!favoriteToDelete) {
      return { success: false, error: "Le contact n'est pas dans vos favoris" }
    }

    await prisma.favorite.delete({
      where: {
        contactId_organisationId: {
          contactId,
          organisationId,
        },
      },
    })

    await prisma.activityLog.create({
      data: {
        action: "Suppression des favoris",
        entityType: "Favorite",
        entityId: favoriteToDelete.id,
        oldData: favoriteToDelete,
        newData: undefined,
        userId,
        actionDetails: `Le contact avec ID ${contactId} a été supprimé des favoris pour l'organisation ${organisationId}`,
        entityName: "Favorite",
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error removing favorite:", error)
    return { success: false, error: "Échec de la suppression du favori" }
  }
}
