"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { inngest } from "@/inngest/client" // Assurez-vous d'importer inngest

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

    // Créer la note dans la base de données
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

    // Récupérer le contact et l'organisation associée
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: { organisations: true }, // Inclure les informations de l'organisation liée
    })

    if (!contact) {
      return {
        success: false,
        error: "Contact introuvable",
      }
    }

    // Récupérer l'ID de l'organisation liée
    const organisationId = contact.organisations?.[0]?.id

    if (!organisationId) {
      return {
        success: false,
        error: "Organisation introuvable pour ce contact",
      }
    }

    // Envoi des informations à Inngest pour enregistrer l'événement d'activité
    await inngest.send({
      name: "activity/note.created", // Nom de l'événement
      data: {
        userId: session.user.id,  // ID de l'utilisateur qui a créé la note
        noteId: note.id,          // ID de la note créée
        contactId: contactId,     // ID du contact lié à la note
        organisationId: organisationId, // ID de l'organisation liée au contact
        activity: `Note créée pour le contact ${contact.name}`, // Détails de l'événement
        noteDetails: {
          title,
          content,
          color,
          isPinned,
        }, // Détails de la note créée
      },
    })

    // Revalidation du cache pour le contact
  

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
