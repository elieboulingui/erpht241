"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré
import { auth } from "@/auth";

interface CreateFeedbackParams {
  message: string
  contactId: string
}

export async function CreateFeedback({ message, contactId }: CreateFeedbackParams) {
  try {
    // Get the current user
    const session = await auth()
    
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez être connecté pour ajouter un commentaire"
      }
    }

    // Create the feedback entry
    const feedback = await prisma.feedbackContact.create({
      data: {
        message,
        contactId,
        userId: session.user.id,
      }
    })

    // Revalidate the contact page to show the new feedback
    revalidatePath(`/contact/${contactId}`)

    return {
      success: true,
      data: feedback
    }
  } catch (error) {
    console.error("Erreur lors de la création du feedback:", error)
    return {
      success: false,
      error: "Une erreur est survenue lors de l'ajout du commentaire"
    }
  }
}

