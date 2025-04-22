"use server"

import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth" // Assure-toi que ce chemin correspond à ta config

const prisma = new PrismaClient()

export async function addFavorite(contactId: string, organisationId: string) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: "Utilisateur non authentifié" }
    }

    const userId = session.user.id

    // Vérifier si le favori existe déjà
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

    // Créer un nouveau favori
    const newFavorite = await prisma.favorite.create({
      data: {
        contactId,
        organisationId,
      },
    })

    // Enregistrer dans le journal d'activité
    // await prisma.activityLog.create({
    //   data: {
    //     action: "Ajout aux favoris",
    //     entityType: "Favorite",
    //     entityId: newFavorite.id,
    //     oldData: undefined,
    //     newData: newFavorite,
    //     userId: userId,
    //     actionDetails: `Le contact avec ID ${contactId} a été ajouté aux favoris pour l'organisation ${organisationId}`,
    //     entityName: "Favorite",
    //   },
    // })

    return { success: true }
  } catch (error) {
    console.error("Error adding favorite:", error)
    return { success: false, error: "Échec de l'ajout aux favoris" }
  }
}
