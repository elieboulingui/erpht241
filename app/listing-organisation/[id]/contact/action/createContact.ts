"use server"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Utilisateur non authentifié" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { contactData, organisationIds = [] } = body

    // Créer le contact
    const newContact = await prisma.contact.create({
      data: {
        name: contactData.name,
        logo: contactData.logo,
        adresse: contactData.adresse,
        email: contactData.email,
        phone: contactData.phone,
        status_contact: "COMPAGNIE",
        niveau: "CLIENT",
        tags: contactData.description ? JSON.stringify([contactData.description]) : null,
        sector: contactData.sector,
        organisations: organisationIds.length > 0
          ? {
              connect: organisationIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
    })

    // Enregistrer l'action dans le journal d'activité
    await prisma.activityLog.create({
      data: {
        action: "Création d’un contact",
        entityType: "Contact",
        entityId: newContact.id,
        oldData: undefined,
        newData: newContact,
        userId,
        actionDetails: `Contact ${newContact.name} créé et lié à ${organisationIds.length} organisation(s)`,
        entityName: newContact.name,
      },
    })

    return NextResponse.json({ success: true, contact: newContact })
  } catch (error) {
    console.error("Error creating contact:", error)
    return NextResponse.json({ success: false, error: "Failed to create contact" }, { status: 500 })
  }
}
