import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const cardId = context.params.id

  if (!cardId) {
    return NextResponse.json({ error: "L'ID de l'opportunité est requis" }, { status: 400 })
  }

  try {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: cardId },
      include: {
        contact: {
          include: {
            notes: {
              include: {
                createdByUser: true, // ou updatedByUser si tu préfères
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    })

    if (!opportunity?.contact?.notes) {
      return NextResponse.json({ notes: [] }, { status: 200 })
    }

    const notes = opportunity.contact.notes.map((note) => ({
      id: note.id,
      title: note.title,
      content: note.content,
      date: note.createdAt.toLocaleString("fr-FR"),
      author: note.createdByUser
        ? {
            name: note.createdByUser.name,
            initials: note.createdByUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase(),
          }
        : {
            name: "Inconnu",
            initials: "??",
          },
    }))

    return NextResponse.json({ notes }, { status: 200 })
  } catch (error) {
    console.error("Erreur API:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des notes." }, { status: 500 })
  }
}
