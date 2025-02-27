// app/api/createcontact/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Assurez-vous que votre instance Prisma est correctement configurée

export async function POST(request: Request) {
  try {
    // Récupérer le corps de la requête
    const payload = await request.json();

    // Vérifier que le payload n'est pas vide ou null
    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { message: "Les données de la requête sont invalides." },
        { status: 400 }
      );
    }

    // Extraire les champs du payload
    const { name, email, phone, stage, tabs, logo, organisationId, Adresse, Record } = payload;

    // Vérification des champs obligatoires
    if (!name || !email || !logo || !organisationId || !Adresse || !Record) {
      return NextResponse.json(
        { message: "Les informations requises sont manquantes." },
        { status: 400 }
      );
    }

    // Vérifier que l'organisation existe
    const organisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });

    if (!organisation) {
      return NextResponse.json(
        { message: "Organisation non trouvée" },
        { status: 400 }
      );
    }

    // Ajouter des valeurs par défaut pour les champs optionnels si nécessaires
    const tabsString = tabs ? tabs : '';
    const phoneString = phone ? phone : ''; // Le téléphone est optionnel
    const stageString = stage ? stage : "LEAD"; // Si aucun stage n'est fourni, on suppose "LEAD"

    // Création du contact dans la base de données
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phoneString,
        stage: stageString,
        logo,
        Adresse,
        Record,
        tabs: tabsString, // Stocker le champ 'tabs' comme une chaîne ou JSON
        organisationId,
      },
    });

    // Retourner la réponse avec le contact créé
    return NextResponse.json({ message: "Contact créé avec succès", contact }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur lors de la création du contact:", error);
    return NextResponse.json(
      { message: "Une erreur inattendue est survenue.", error: error.message },
      { status: 500 }
    );
  }
}
