"use server"

import prisma from "@/lib/prisma"
import type { Contact } from "@prisma/client"

export async function GetContactsByOrganisationId(id: string): Promise<Contact[]> {
  if (!id) {
    throw new Error("L'ID de l'organisation est requis.")
  }

  try {
    const organisationWithContacts = await prisma.organisation.findUnique({
      where: {
        id,
      },
      include: {
        Contact: {
          where: {
            isArchived: false, 
          },
        },
      },
    })

    if (!organisationWithContacts) {
      return [] // Return empty array instead of throwing error for easier handling
    }

    // Return the contacts associated with the organization
    return organisationWithContacts.Contact
  } catch (error) {
    console.error("Erreur lors de la récupération des contacts:", error)

    // Provide more specific error message if possible
    if (error instanceof Error) {
      throw new Error(`Erreur lors de la récupération des contacts: ${error.message}`)
    }

    throw new Error("Erreur serveur lors de la récupération des contacts")
  }
}
