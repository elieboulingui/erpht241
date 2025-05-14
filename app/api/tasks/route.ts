import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const opportunityId = searchParams.get("opportunityId")

    if (!opportunityId) {
      return NextResponse.json({ error: "Opportunity ID is required" }, { status: 400 })
    }

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      include: {
        contact: {
          include: {
            Task: {
              where: { isArchived: false },
              include: {
                createdBy: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
      },
    })

    if (!opportunity || !opportunity.contact) {
      return NextResponse.json({ error: "Opportunity or contact not found" }, { status: 404 })
    }

    // Extraire les tâches et injecter le contact
    const tasks = opportunity.contact.Task.map(task => ({
      ...task,
      contact: {
        id: opportunity.contact!.id,
        name: opportunity.contact!.name,
      },
    }))

    return NextResponse.json(tasks, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
