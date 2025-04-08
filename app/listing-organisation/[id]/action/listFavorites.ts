"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function listFavorites(organisationId: string) {
  try {
    // Fetch favorites with contact details for the given organisation
    const favorites = await prisma.favorite.findMany({
      where: {
        organisationId: organisationId,
      },
      include: {
        contact: true, // Include the related contact details
      },
    })

    // Transform the data to match the format expected by the frontend
    const formattedFavorites = favorites.map((favorite) => ({
      title: favorite.contact.name,
      url: `/listing-organisation/${organisationId}/contact/${favorite.contactId}`,
      logo: favorite.contact.logo// Assuming contact has an avatar field
    }))

    return { success: true, data: formattedFavorites }
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return { success: false, error: "Failed to fetch favorites" }
  }
}
