import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assurez-vous que votre instance Prisma est correctement configurée

export async function POST(request: Request) {
  try {
    const { name, email, phone, stage, tabs, logo, organisationId } = await request.json();

    console.log("Données reçues : ", { name, email, phone, stage, tabs, logo, organisationId });

    if (!name || !email || !logo || !organisationId) {
      return NextResponse.json(
        { message: "Les informations sont manquantes." },
        { status: 400 }
      );
    }

    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });

    if (!organisation) {
      return NextResponse.json(
        { message: "Organisation non trouvée" },
        { status: 400 }
      );
    }

    const tabsString = tabs ? tabs : '';

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        stage,
        logo,
        tabs: tabsString, // Stocker le champ 'tabs' comme une chaîne ou JSON
        organisationId,
      },
    });

    return NextResponse.json({ message: "Contact créé avec succès", contact }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur lors de la création du contact:", error);
    return NextResponse.json(
      { message: "Une erreur inattendue est survenue.", error: error.message },
      { status: 500 }
    );
  }
}
