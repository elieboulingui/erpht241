"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma" // Assurez-vous d'importer votre client Prisma

interface NoteUpdateData {
  title?: string
  content?: string
  isPinned?: boolean
  color?: string
  lastModified?: Date
}

export async function updateNote(noteId: string, data: NoteUpdateData) {
  try {
    // Mise à jour de la note dans la base de données
    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        title: data.title,
        content: data.content,
        isPinned: data.isPinned,
        color: data.color,
        lastModified: data.lastModified || new Date(),
      },
    })

    console.log(`Note ID: ${noteId} updated successfully`, updatedNote)

    // Revalidation du cache pour rafraîchir les données
    revalidatePath(`/listing-organisation/[id]/contact/${noteId}`)

    return { success: true, data: updatedNote }
  } catch (error) {
    console.error("Error updating note:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur est survenue",
    }
  }
}
