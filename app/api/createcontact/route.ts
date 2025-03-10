
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateEvents } from "swr/_internal";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Destructure the payload for the fields
    const { name, email, phone, stage, tags, logo, organisationIds, adresse, record, status_contact } = payload;

    // Validate required data
    if (!name || !email || !organisationIds || !adresse || !record || !logo || !status_contact) {
      return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
    }

    // Validate email format
    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: "Email invalide" }, { status: 400 });
    }

    // Check if the contact already exists in any of the organizations
    const existingContactInOrg = await prisma.contact.findFirst({
      where: {
        email: email,
        organisations: {
          some: {
            id: {
              in: organisationIds,    // Check if the email exists in any of the provided organizations
            },
          },
        },
      },
    });

    // if (existingContactInOrg) {
    //   return NextResponse.json({ message: "Ce contact existe déjà dans l'une des organisations." }, { status: 400 });
    // }

    // Validate the organizations
    if (!Array.isArray(organisationIds) || organisationIds.length === 0) {
      return NextResponse.json({ message: "Les organisations sont manquantes" }, { status: 400 });
    }

    // Validate the stage value
    const validStages = ["LEAD", "WON" , "QUALIFIED"];
    if (stage && !validStages.includes(stage)) {
      return NextResponse.json({ message: "Stage invalide" }, { status: 400 });
    }

    // Create the contact and associate with multiple organizations
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone ?? '',
        stage: stage ?? "LEAD",  // Default to "LEAD" if not provided
        logo,
        adresse,
        record,
        tags: tags ?? '',  // Default to empty string if no tabs provided
        organisations: {
          connect: organisationIds.map((id: string) => ({ id })),
        },
        status_contact: status_contact ?? "ACTIVE",
      },
    });

    revalidatePath(`/listing-organisation/${organisationIds}/contact`)
    return NextResponse.json({ message: "Contact créé avec succès", contact }, { status: 200 });

  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Un contact avec cet email existe déjà." },
        { status: 400 }
      );
    }

    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { message: `Erreur interne du serveur: ${error.message || "inconnue"}` },
      { status: 500 }
    );
  }
}
