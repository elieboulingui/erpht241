import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const opportunityId = searchParams.get("id")

    if (!opportunityId) {
      return NextResponse.json({ error: "Opportunity ID is required" }, { status: 400 })
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      include: {
        contact: {
          include: {
            Document: true, // Inclure les documents uniquement
          },
        },
      },
    })

    if (!opportunity || !opportunity.contact) {
      return NextResponse.json({ error: "Opportunity or contact not found" }, { status: 404 })
    }

    // Extraire les documents
    const documents = opportunity.contact.Document.map(document => ({
      id: document.id,
      title: document.name,  // Assurez-vous que votre modèle de document a ce champ
      url: document.url,
      type :document.type,
      status : document.status,
      size : document.size,
      date : document.date      // Assurez-vous que votre modèle de document a ce champ
    }))

    return NextResponse.json(documents, { status: 200 })

  } catch (error) {
    console.error("Erreur lors de la récupération des documents:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
