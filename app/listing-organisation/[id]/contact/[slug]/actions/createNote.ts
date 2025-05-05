"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { inngest } from "@/inngest/client"

interface CreateNoteParams {
  contactId: string
  title: string
  content: string
  color?: string
  isPinned?: boolean
  lastModified?: Date
}

export async function CreateNote({
  contactId,
  title,
  content,
  color = "default",
  isPinned = false,
  lastModified = new Date(),
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

    const note = await prisma.note.create({
      data: {
        title,
        content,
        color,
        isPinned,
        contactId,
        lastModified,
        userId,
      },
    })

    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { organisations: true },
    })

    if (!contact) {
      return { success: false, error: "Contact introuvable" }
    }

    const organisationId = contact.organisations?.[0]?.id
    if (!organisationId) {
      return { success: false, error: "Organisation introuvable pour ce contact" }
    }

    // Inngest : envoyer un événement
    await inngest.send({
      name: "activity/note.created",
      data: {
        action: "create",
        entityType: "note",
        entityId: note.id,
        newData: {
          title,
          content,
          color,
          isPinned,
        },
        organisationId,
        userId,
        createdByUserId: userId,
        contactId,
      },
    })

    return { success: true, data: note }
  } catch (error) {
    console.error("Erreur lors de la création de la note:", error)
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de la note",
    }
  }
}
