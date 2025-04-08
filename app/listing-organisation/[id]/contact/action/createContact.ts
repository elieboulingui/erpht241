import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { contactData, organisationIds = [] } = body

    // Create the contact in the database
    const newContact = await prisma.contact.create({
      data: {
        name: contactData.name,
        logo: contactData.logo,
        adresse: contactData.adresse,
        email: contactData.email,
        phone: contactData.phone,
        status_contact: "COMPAGNIE", // Default value, can be changed based on requirements
        niveau: "CLIENT", // Default value, can be changed based on requirements
        tags: contactData.description ? JSON.stringify([contactData.description]) : null,
        sector: contactData.sector,
        // Connect to organisations if organisationIds are provided
        organisations:
          organisationIds.length > 0
            ? {
                connect: organisationIds.map((id: string) => ({ id })),
              }
            : undefined,
      },
    })

    return NextResponse.json({ success: true, contact: newContact })
  } catch (error) {
    console.error("Error creating contact:", error)
    return NextResponse.json({ success: false, error: "Failed to create contact" }, { status: 500 })
  }
}

