"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { inngest } from "@/inngest/client"  // Importer Inngest

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

    // Journaliser l'activité dans la base de données
    // Envoi de l'événement à Inngest
    await inngest.send({
      name: "feedback.created",  // Nom de l'événement
      data: {
        userId,                 // ID de l'utilisateur qui a créé le commentaire
        feedbackId: feedback.id, // ID du feedback créé
        contactId,              // ID du contact sur lequel le feedback a été ajouté
        organisationId: contact.organisations?.[0]?.id, // ID de l'organisation
        activity: `Feedback créé sur le contact ${contact.name}`, // Détails de l'activité
        feedbackDetails: {
          message: feedback.message, // Message du feedback
        },
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
