"use server"
import prisma from "@/lib/prisma" // Assurez-vous que Prisma est bien configuré

export async function DeleteNote(id: string) {
  if (!id) {
    throw new Error("L'ID du note est requis.")
  }

  try {
    // Supprimer la note par son ID
    const deletedNote = await prisma.note.update({
      where: {
        id: id, // Utiliser l'ID de la note pour effectuer la mise à jour
      },
      data: {
        isArchived: true, // Marquer comme archivé
        archivedAt: new Date(), // Enregistrer la date d'archivage
      },
    })

    return deletedNote // Retourner la note supprimée pour confirmation
  } catch (error) {
    console.error("Erreur lors de la suppression de la note:", error)
    throw new Error("Erreur serveur lors de la suppression de la note.")
  }
}

