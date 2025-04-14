'use server'
import prisma from "@/lib/prisma" // Assurez-vous que Prisma est bien configuré
import { auth } from '@/auth'

export async function DeleteNote(id: string) {
  const session = await auth()

  if (!id) {
    throw new Error("L'ID de la note est requis.")
  }

  try {
    // Récupérer l'état actuel de la note
    const existingNote = await prisma.note.findUnique({
      where: { id },
    })

    if (!existingNote) {
      throw new Error("Note introuvable.")
    }

    // Mise à jour : marquer la note comme archivée
    const deletedNote = await prisma.note.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
      },
    })


    // Enregistrement dans le journal d'activité
    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entityType: 'Note',
        entityId: id,
        entityName: existingNote.title || 'Note',
        oldData: { ...existingNote },
        newData: { isArchived: true, archivedAt: new Date() },
        organisationId: existingNote.id, // Assurer que l'organisation est bien définie
        userId: session?.user.id,
        createdByUserId: session?.user.id,
        noteId: id,
        ipAddress:undefined,
        userAgent:undefined,
        actionDetails: `Note "${existingNote.title}" archivée.`,
      },
    })

    return deletedNote
  } catch (error) {
    console.error("Erreur lors de la suppression de la note:", error)
    throw new Error("Erreur serveur lors de la suppression de la note.")
  }
}
