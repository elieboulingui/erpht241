"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

interface CreateFeedbackParams {
  message: string
  contactId: string
}

export async function CreateFeedback({ message, contactId }: CreateFeedbackParams) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour ajouter un commentaire",
      }
    }

    const userId = session.user.id

    // Créer le commentaire
    const feedback = await prisma.feedbackContact.create({
      data: {
        message,
        contactId,
        userId,
      },
    })

    // Récupérer le contact avec l'organisation
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        organisations: true,
      },
    })

    if (!contact) {
      return {
        success: false,
        error: "Contact introuvable",
      }
    }

    // Journaliser l'activité
    await prisma.activityLog.create({
      data: {
        action: "CREATE",
        entityType: "FeedbackContact",
        entityId: feedback.id,
        userId: userId,
        createdByUserId: userId,
        organisationId: contact.id ?? undefined,
        newData: JSON.stringify(feedback),
        actionDetails: `Commentaire ajouté sur le contact ${contact.name}`,
        entityName: contact.name.trim() || "Contact inconnu",
        feedbackContactId: feedback.id,
        contactId: contact.id,
      },
    })

    // Rafraîchir la page du contact
    revalidatePath(`/contact/${contactId}`)

    return {
      success: true,
      data: feedback,
    }
  } catch (error) {
    console.error("Erreur lors de la création du feedback:", error)
    return {
      success: false,
      error: "Une erreur est survenue lors de l'ajout du commentaire",
    }
  }
}
