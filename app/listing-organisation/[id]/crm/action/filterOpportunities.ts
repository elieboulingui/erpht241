"use server"

import prisma from "@/lib/prisma"

export async function filterOpportunitiesByNames(merchantNames: string[], contactNames: string[]) {
  try {
    console.log("Filtering by merchant names:", merchantNames)
    console.log("Filtering by contact names:", contactNames)

    const whereClause: any = {
      OR: [],
    }

    // Cherche les marchands existants
    if (merchantNames && merchantNames.length > 0) {
      const existingMerchants = await prisma.merchant.findMany({
        where: {
          name: { in: merchantNames },
        },
        select: { id: true },
      })

      if (existingMerchants.length > 0) {
        whereClause.OR.push({
          merchantId: { in: existingMerchants.map(m => m.id) },
        })
      }
    }

    // Cherche les contacts existants
    if (contactNames && contactNames.length > 0) {
      const existingContacts = await prisma.contact.findMany({
        where: {
          name: { in: contactNames },
        },
        select: { id: true },
      })

      if (existingContacts.length > 0) {
        whereClause.OR.push({
          contactId: { in: existingContacts.map(c => c.id) },
        })
      }
    }

    // Si aucun filtre valide n’a été trouvé
    if (whereClause.OR.length === 0) {
      console.log("Aucun marchand ou contact trouvé, retour de toutes les opportunités")
      const allOpportunities = await prisma.opportunity.findMany({
        include: {
          merchant: true,
          contact: true,
          member: true,
          step: true,
        },
      })
      return { success: true, data: allOpportunities }
    }

    // Applique les filtres
    const opportunities = await prisma.opportunity.findMany({
      where: whereClause,
      include: {
        merchant: true,
        contact: true,
        member: true,
        step: true,
      },
    })

    console.log("Opportunités filtrées trouvées:", opportunities.length)
    return { success: true, data: opportunities }

  } catch (error) {
    console.error("Erreur lors du filtrage des opportunités:", error)
    return { success: false, error: (error as Error).message }
  }
}
