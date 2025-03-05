"use server"

import prisma from "@/lib/prisma"; // Assurez-vous que Prisma est bien configuré

export async function getFeedbacks(contactId: string) {
  try {
    const feedbacks = await prisma.feedbackContact.findMany({
      where: {
        contactId
      },
      orderBy: {
        createdAt: "desc"
      },
      
    })

    return {
      success: true,
      data: feedbacks
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des feedbacks:", error)
    return {
      success: false,
      error: "Une erreur est survenue lors de la récupération des commentaires"
    }
  }
}

