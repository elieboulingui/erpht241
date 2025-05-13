import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const segments = url.pathname.split("/")
  const cardId = segments[segments.indexOf("note") + 1] // Extracts [id] from /note/[id]/devis

  if (!cardId) {
    return NextResponse.json(
      { error: "L'ID de l'opportunité est requis" },
      { status: 400 }
    )
  }

  try {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: cardId },
      include: {
        contact: {
          include: {
            notes: {
              include: {
                createdByUser: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    })

    const notes = opportunity?.contact?.notes?.map((note) => {
      const authorName = note.createdByUser?.name || "Inconnu"
      const initials =
        authorName !== "Inconnu"
          ? authorName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
          : "??"

      return {
        id: note.id,
        title: note.title,
        content: note.content,
        date: note.createdAt.toLocaleString("fr-FR"),
        author: {
          name: authorName,
          initials,
        },
      }
    }) ?? []

    return NextResponse.json({ notes }, { status: 200 })
  } catch (error) {
    console.error("Erreur API:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des notes." },
      { status: 500 }
    )
  }
}
