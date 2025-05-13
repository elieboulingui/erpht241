import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const id = url.pathname.split("/").at(-2) // Adjust depending on route nesting

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
