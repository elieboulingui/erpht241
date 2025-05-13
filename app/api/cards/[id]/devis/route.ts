import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const cardId = params.id

  if (!cardId) {
    return NextResponse.json({ error: "L'ID de l'opportunité est requis" }, { status: 400 })
  }

  try {
    // Récupère l'opportunité avec son contact et les devis du contact
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: cardId },
      include: {
        contact: {
          include: {
            Devis: {
              include: {
                // Include DevisItems for each Devis
                items: true,
              },
            },
          },
        },
      },
    })

    if (!opportunity || !opportunity.contact) {
      return NextResponse.json({ devis: [] }, { status: 200 }) // Pas d'opportunité ou pas de contact
    }

    const contact = opportunity.contact

    const devis = contact.Devis.map((devis) => ({
      ...devis,
      contactId: contact.id,
      contactName: contact.name,
      // Ensure items are included in the response
      items: devis.items || [],
    }))

    console.log(`Found ${devis.length} devis for contact ${contact.name}`)
    // Log the first devis with its items if available
    if (devis.length > 0) {
      console.log(`First devis (${devis[0].devisNumber}) has ${devis[0].items.length} items`)
    }

    return NextResponse.json(devis, { status: 200 })
  } catch (error) {
    console.error("Erreur API:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des devis." }, { status: 500 })
  }
}
