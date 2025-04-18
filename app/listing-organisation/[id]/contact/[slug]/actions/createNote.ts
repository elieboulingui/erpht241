"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

interface CreateNoteParams {
  contactId: string
  title: string
  content: string
  color?: string
  isPinned?: boolean
  LastModified: Date
}

export async function CreateNote({
  contactId,
  title,
  content,
  color = "default",
  isPinned = false,
}: CreateNoteParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour créer une note",
      }
    }

    const userId = session.user.id

    // Créer la note
    const note = await prisma.note.create({
      data: {
        title,
        content,
        color,
        isPinned,
        contactId,
        lastModified: new Date(),
        userId: userId,
      },
    })

    // Récupérer le contact (et donc l'organisation liée)
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { organisations: true },
    })

    if (!contact) {
      return {
        success: false,
        error: "Contact introuvable",
      }
    }

    // Créer le log d'activité
    // await prisma.activityLog.create({
    //   data: {
    //     action: "CREATE",
    //     entityType: "Note",
    //     entityId: note.id,
    //     userId,
    //     createdByUserId: userId,
    //     organisationId: contact.id ?? undefined,
    //     contactId: contact.id,
    //     noteId: note.id,
    //     newData: JSON.stringify(note),
    //     actionDetails: `Note ajoutée au contact ${contact.name}`,
    //     entityName: title,
    //   },
    // })

    revalidatePath(`/contact/${contactId}`)

    return {
      success: true,
      data: note,
    }
  } catch (error) {
    console.error("Erreur lors de la création de la note:", error)
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de la note",
    }
  }
}
