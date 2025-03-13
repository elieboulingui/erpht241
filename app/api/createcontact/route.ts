import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    // Destructure the payload for the fields
    const { name, email, phone, niveau, tags, logo, organisationIds, adresse, status_contact } = payload

    // Validate required data (email and logo are now optional)
    if (!name || !organisationIds || !adresse || !status_contact) {
      return NextResponse.json({ message: "Données manquantes" }, { status: 400 })
    }

    // Validate email format only if email is provided
    if (email && !email.includes("@")) {
      return NextResponse.json({ message: "Email invalide" }, { status: 400 })
    }

    // Check if the contact already exists in any of the organizations (only if email is provided)
    if (email) {
      const existingContactInOrg = await prisma.contact.findFirst({
        where: {
          email: email,
          organisations: {
            some: {
              id: {
                in: organisationIds,
              },
            },
          },
        },
      })

      // Uncomment if you want to prevent duplicates
      // if (existingContactInOrg) {
      //   return NextResponse.json({ message: "Ce contact existe déjà dans l'une des organisations." }, { status: 400 });
      // }
    }

    // Validate the organizations
    if (!Array.isArray(organisationIds) || organisationIds.length === 0) {
      return NextResponse.json({ message: "Les organisations sont manquantes" }, { status: 400 })
    }

    // Validate the niveau value
    const validNiveau = ["PROSPECT_POTENTIAL", "PROSPECT", "CLIENT"]
    if (niveau && !validNiveau.includes(niveau)) {
      return NextResponse.json({ message: "Niveau invalide" }, { status: 400 })
    }

    // Create the contact and associate with multiple organizations
    const contact = await prisma.contact.create({
      data: {
        name,
        email: email || null, // Make email optional
        phone: phone ?? "",
        niveau,
        logo: logo || null, // Make logo optional
        adresse,
        tags: tags ?? "", // Default to empty string if no tags provided
        organisations: {
          connect: organisationIds.map((id: string) => ({ id })),
        },
        status_contact: status_contact ?? "ACTIVE",
      },
    })

    revalidatePath(`/listing-organisation/${organisationIds}/contact`)
    return NextResponse.json({ message: "Contact créé avec succès", contact }, { status: 200 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Un contact avec cet email existe déjà." }, { status: 400 })
    }

    console.error("Erreur serveur:", error)
    return NextResponse.json({ message: `Erreur interne du serveur: ${error.message || "inconnue"}` }, { status: 500 })
  }
}
