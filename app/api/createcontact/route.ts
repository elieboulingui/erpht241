import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Destructurer le payload pour les champs
    const { name, email, phone, stage, tabs, logo, organisationIds, Adresse, Record } = payload;

    // Validation des données requises
    if (!name || !email || !organisationIds || !Adresse || !Record || !logo) {
      return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
    }

    // Validation du format de l'email
    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: "Email invalide" }, { status: 400 });
    }

    // Validation des organisations
    if (!Array.isArray(organisationIds) || organisationIds.length === 0) {
      return NextResponse.json({ message: "Les organisations sont manquantes" }, { status: 400 });
    }

    // Vérifier si les organisations existent
    const organisations = await prisma.organisation.findMany({
      where: {
        id: { in: organisationIds },
      },
    });

    if (organisations.length !== organisationIds.length) {
      return NextResponse.json(
        { message: "Certaines organisations spécifiées sont invalides." },
        { status: 400 }
      );
    }

    // Vérification si un contact existe déjà dans les organisations spécifiées
    const existingContactInOrg = await prisma.contact.findFirst({
      where: {
        email: email,
        organisations: {
          some: {
            id: {
              in: organisationIds, // Vérifier si l'email existe dans l'une des organisations
            },
          },
        },
      },
    });

    if (existingContactInOrg) {
      return NextResponse.json(
        { message: "Ce contact existe déjà dans l'une des organisations." },
        { status: 400 }
      );
    }

    // Validation du stage
    const validStages = ["LEAD", "WON"];
    if (stage && !validStages.includes(stage)) {
      return NextResponse.json({ message: "Stage invalide" }, { status: 400 });
    }

    // Créer le contact et l'associer à plusieurs organisations
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone ?? '',
        stage: stage ?? "LEAD",  // Défaut à "LEAD"
        logo,
        adresse: Adresse,
        record: Record,
        tags : tabs ?? '',  // Défaut à vide si non fourni
        organisations: {
          connect: organisationIds.map((id: string) => ({ id })),
        },
      },
    });

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
