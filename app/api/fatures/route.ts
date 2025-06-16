import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id") // <-- modification ici// récupère l'ID depuis /api/facture/[id]/...

  if (!id) {
    return NextResponse.json({ error: "L'ID de l'opportunité est requis" }, { status: 400 })
  }

  try {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        contact: {
          include: {
            Devis: {
              where: {
                status: "FACTURE", // Filtre ici uniquement les devis de type facture
              },
              include: {
                items: true,
              },
            },
          },
        },
      },
    })

    if (!opportunity || !opportunity.contact) {
      return NextResponse.json({ devis: [] }, { status: 200 })
    }

    const contact = opportunity.contact
    const devis = contact.Devis.map((devis) => ({
      ...devis,
      contactId: contact.id,
      contactName: contact.name,
      items: devis.items || [],
    }))

    return NextResponse.json(devis, { status: 200 })
  } catch (error) {
    console.error("Erreur API:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des devis." }, { status: 500 })
  }
}
