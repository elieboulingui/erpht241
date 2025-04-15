import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Enum Domain (doit correspondre à Prisma)
enum Domain {
  AGRICULTURE = "AGRICULTURE",
  ENERGIE = "ENERGIE",
  LOGISTIQUE = "LOGISTIQUE",
  NUMERIQUE = "NUMERIQUE",
  SECURITE = "SECURITE",
  TRANSPORT = "TRANSPORT",
  INFORMATIQUE = "INFORMATIQUE",
  SANTE = "SANTE",
  EDUCATION = "EDUCATION",
  FINANCE = "FINANCE",
  COMMERCE = "COMMERCE",
  CONSTRUCTION = "CONSTRUCTION",
  ENVIRONNEMENT = "ENVIRONNEMENT",
  TOURISME = "TOURISME",
  INDUSTRIE = "INDUSTRIE",
  TELECOMMUNICATIONS = "TELECOMMUNICATIONS",
  IMMOBILIER = "IMMOBILIER",
  ADMINISTRATION = "ADMINISTRATION",
  ART_CULTURE = "ART_CULTURE",
  ALIMENTATION = "ALIMENTATION",
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, logo, domain } = await req.json();

    // Création dynamique de l'objet data
    const data: any = {
      name,
      logo,
    };

    if (domain) {
      const domainValue = Domain[domain.toUpperCase() as keyof typeof Domain];
      if (!domainValue) {
        return NextResponse.json({ message: "Domaine invalide." }, { status: 400 });
      }
      data.domain = domainValue;
    }

    const updatedOrganisation = await prisma.organisation.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      message: "Organisation mise à jour avec succès!",
      organisation: {
        ...updatedOrganisation,
        createdAt: updatedOrganisation.createdAt.toISOString(),
        updatedAt: updatedOrganisation.updatedAt.toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour.", error: error.message },
      { status: 500 }
    );
  }
}
