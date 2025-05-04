"use server"
import prisma from "@/lib/prisma" // Assurez-vous que Prisma est bien configuré
import { auth } from '@/auth'
import { inngest } from "@/inngest/client" // Importer Inngest

export async function DeleteNote(id: string) {
  // Récupérer la session utilisateur
  const session = await auth()

  // Vérifier si la session existe
  if (!session || !session.user?.id) {
    throw new Error("Vous devez être connecté pour supprimer une note.")
  }

  if (!id) {
    throw new Error("L'ID de la note est requis.")
  }

  try {
    // Récupérer l'état actuel de la note
    const existingNote = await prisma.note.findUnique({
      where: { id },
      include: {
        contact: {
          include: {
            organisations: true, // Inclure les organisations du contact
          },
        },
      },
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

    // Récupérer l'organisation du contact (en supposant qu'un contact a une organisation)
    const organisationId = existingNote.contact?.organisations?.[0]?.id

    // Envoi de l'événement à Inngest pour journaliser l'activité
    await inngest.send({
      name: "note/deleted",  // Nom de l'événement
      data: {
        userId: session.user.id, // ID de l'utilisateur qui a supprimé
        noteId: deletedNote.id, // ID de la note supprimée
        contactId: existingNote.contact.id, // ID du contact lié à la note
        organisationId: organisationId, // ID de l'organisation
        activity: `Note "${existingNote.title}" archivée`, // Détails de l'activité
      },
    })

    return deletedNote
  } catch (error) {
    console.error("Erreur lors de la suppression de la note:", error)
    throw new Error("Erreur serveur lors de la suppression de la note.")
  }
}
