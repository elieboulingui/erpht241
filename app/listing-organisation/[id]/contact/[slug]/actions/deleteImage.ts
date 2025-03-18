"use server"

import { revalidatePath } from "next/cache"
import  prisma from "@/lib/prisma" // Assurez-vous que Prisma est bien configuré

/**
 * Supprime l'URL de l'image/logo d'un contact dans la base de données
 * @param contactId L'ID du contact dont l'image doit être supprimée
 */
export async function DeleteImage(contactId: string) {
  try {
    // Mettre à jour le contact en définissant le logo à null
    await prisma.contact.update({
      where: { id: contactId },
      data: {
        logo: null, // Supprimer l'URL du logo
      },
    })

    // Revalider le cache pour refléter les modifications
    revalidatePath(`/contact/${contactId}`)

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image :", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    }
  }
}
