'use server'
import { inngest } from "@/inngest/client";
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma" // Assurez-vous d'importer votre client Prisma
import { auth } from '@/auth'

// Interface pour les données de mise à jour de la note
interface NoteUpdateData {
  title?: string
  content?: string
  isPinned?: boolean
  color?: string
  lastModified?: Date
}

export async function updateNote(noteId: string, data: NoteUpdateData) {
  const session = await auth()

  try {
    // Récupérer les données actuelles de la note avant la mise à jour
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!existingNote) {
      throw new Error("Note introuvable.")
    }

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
    // Récupérer l'adresse IP et le User-Agent depuis les entêtes de la requête
   
// 🟢 Envoi de l'event à Inngest
await inngest.send({
  name: "activity/updatenote.created",
  data: {
    action: "note.updated",
    entityType: "Note",
    entityId: noteId,
    entityName: existingNote.title ?? "Note",
    oldData: { ...existingNote },
    newData: { ...updatedNote },
    userId: session?.user.id ?? null,
    createdByUserId: session?.user.id ?? null,
    noteId,
    ipAddress: undefined, // Tu peux récupérer via headers si besoin
    userAgent: undefined,
    actionDetails: `Mise à jour de la note "${existingNote.title}".`,
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
