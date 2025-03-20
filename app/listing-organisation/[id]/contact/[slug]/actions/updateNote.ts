"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma" // Assurez-vous d'importer votre client Prisma

interface NoteUpdateData {
  title?: string // Titre de la note
  content?: string // Contenu de la note
  isPinned?: boolean // Indique si la note est épinglée
  color?: string
  lastModified?: Date
}

export async function updateNote(noteId: string, data: NoteUpdateData) {
  try {
    // Mise à jour de la note dans la base de données avec Prisma
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        // Ajout des champs à mettre à jour
        title: data.title,
        content: data.content,
        isPinned: data.isPinned,
        color: data.color,
        lastModified: data.lastModified || new Date(), // Utiliser la date fournie ou la date actuelle
      },
    })

    // Log de débogage pour vérifier que la mise à jour a réussi
    console.log(`Note ID: ${noteId} updated successfully`, updatedNote)

    // Revalidation du cache de la page pour refléter les changements
    revalidatePath(`/listing-organisation/[id]/contact/${noteId}`)

    // Retour d'un résultat de succès
    return { success: true, data: updatedNote }
  } catch (error) {
    // Gestion des erreurs lors de la mise à jour
    console.error("Error updating note:", error)

    // Retour d'un résultat d'échec avec un message d'erreur
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    }
  }
}

