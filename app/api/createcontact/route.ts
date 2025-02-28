import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Validation des données
    const { name, email, phone, stage, tabs, logo, organisationIds, Adresse, Record } = payload;

    if (!name || !email || !organisationIds || !Adresse || !Record || !logo) {
      return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
    }

    // Validation de l'email
    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: "Email invalide" }, { status: 400 });
    }

    // Vérification si le contact existe déjà
    const existingContact = await prisma.contact.findUnique({
      where: {
        email: email,
      },
    });

    if (existingContact) {
      return NextResponse.json({ message: "Ce contact existe déjà." }, { status: 400 });
    }

    // Validation des organisations
    if (!Array.isArray(organisationIds) || organisationIds.length === 0) {
      return NextResponse.json({ message: "Les organisations sont manquantes" }, { status: 400 });
    }

    // Validation du stage
    const validStages = ["LEAD", "WON"];
    if (stage && !validStages.includes(stage)) {
      return NextResponse.json({ message: "Stage invalide" }, { status: 400 });
    }

    // Création du contact
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone ?? '',
        stage: stage ?? "LEAD",  // Stage par défaut "LEAD"
        logo,
        Adresse,
        Record,
        tabs: tabs ?? '',  // Par défaut vide si pas de tabs
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
