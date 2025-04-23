import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { inngest } from "@/inngest/client";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Utilisateur non authentifié" }, { status: 401 });
    }

    const ownerId = session.user.id;

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json({ error: "Format de requête invalide" }, { status: 400 });
    }

    const { name, slug, logo, domain } = body;

    if (!name || !slug || !domain) {
      return NextResponse.json({ error: "Tous les champs requis ne sont pas fournis" }, { status: 400 });
    }

    const validDomains = [
      "AGRICULTURE", "ENERGIE", "LOGISTIQUE", "NUMERIQUE", "SECURITE",
      "TRANSPORT", "INFORMATIQUE", "SANTE", "EDUCATION", "FINANCE",
      "COMMERCE", "CONSTRUCTION", "ENVIRONNEMENT", "TOURISME", "INDUSTRIE",
      "TELECOMMUNICATIONS", "IMMOBILIER", "ADMINISTRATION", "ART_CULTURE", "ALIMENTATION"
    ];

    const domainValue = domain.toUpperCase();

    if (!validDomains.includes(domainValue)) {
      return NextResponse.json({ error: "Le domaine spécifié n'est pas valide" }, { status: 400 });
    }

    const ownerExists = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!ownerExists) {
      return NextResponse.json({ error: "L'utilisateur propriétaire spécifié n'existe pas" }, { status: 404 });
    }

    const existingSlug = await prisma.organisation.findUnique({ where: { slug } });
    if (existingSlug) {
      return NextResponse.json({ error: "Le slug spécifié existe déjà" }, { status: 400 });
    }

    const organisation = await prisma.organisation.create({
      data: {
        name,
        slug,
        logo,
        ownerId,
        domain: domainValue,
        createdByUserId: ownerId,
      },
    });

    // ✅ Envoi de l’événement à Inngest
    await inngest.send({
      name: "organisation/created",
      data: {
        organisation,
        userId: ownerId,
      },
    });

    return NextResponse.json(
      { message: "Organisation créée avec succès", organisation },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erreur générale:", error);
    return NextResponse.json(
      { error: "Une erreur s'est produite lors de la création de l'organisation" },
      { status: 500 }
    );
  }
}
