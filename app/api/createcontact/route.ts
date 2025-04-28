import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { inngest } from "@/inngest/client"; // ✅ Ajout Inngest
import { auth } from "@/auth"; // ✅ Ajout pour récupérer la session

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const {
      name,
      email,
      phone,
      niveau,
      tags,
      logo,
      organisationIds,
      adresse,
      status_contact,
      sector,
      createdByUserId,
    } = payload;

    // Récupérer la session utilisateur
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "Utilisateur non authentifié." }, { status: 401 });
    }

    // Récupérer l'adresse IP de l'utilisateur
    const ipResponse = await fetch("https://api.ipify.org/?format=json");
    const ipData = await ipResponse.json();
    const ipAddress = ipData.ip;

    if (!name || !organisationIds || !adresse || !status_contact) {
      return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
    }

    if (email && !email.includes("@")) {
      return NextResponse.json({ message: "Email invalide" }, { status: 400 });
    }

    if (email) {
      const existingContactInOrg = await prisma.contact.findFirst({
        where: {
          email,
          organisations: {
            some: {
              id: { in: organisationIds },
            },
          },
        },
      });

      // Si tu veux empêcher de créer un contact avec le même email dans la même organisation
      // if (existingContactInOrg) {
      //   return NextResponse.json({ message: "Ce contact existe déjà dans l'une des organisations." }, { status: 400 });
      // }
    }

    if (!Array.isArray(organisationIds) || organisationIds.length === 0) {
      return NextResponse.json({ message: "Les organisations sont manquantes" }, { status: 400 });
    }

    const existingOrgs = await prisma.organisation.findMany({
      where: { id: { in: organisationIds } },
      select: { id: true },
    });

    const existingOrgIds = existingOrgs.map((org: { id: any; }) => org.id);
    const nonExistingOrgIds = organisationIds.filter(id => !existingOrgIds.includes(id));

    if (nonExistingOrgIds.length > 0) {
      return NextResponse.json({
        message: `Les organisations suivantes n'existent pas: ${nonExistingOrgIds.join(", ")}`,
      }, { status: 400 });
    }

    const validNiveau = ["PROSPECT_POTENTIAL", "PROSPECT", "CLIENT"];
    if (niveau && !validNiveau.includes(niveau)) {
      return NextResponse.json({ message: "Niveau invalide" }, { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email: email || null,
        phone: phone ?? "",
        niveau,
        logo: logo || null,
        adresse,
        tags: tags ?? "",
        sector: sector ?? "",
        status_contact: status_contact ?? "ACTIVE",
        organisations: {
          connect: organisationIds.map(id => ({ id })),
        },
      },
    });

    // ✅ Déclenche l'événement Inngest avec l'IP et l'ID utilisateur
    await inngest.send({
      name: "contact/created",
      data: {
        contact,
        createdByUserId: createdByUserId ?? userId, // Utilisation de l'ID de l'utilisateur si 'createdByUserId' est manquant
        organisationId: organisationIds[0],
        ipAddress, // Ajout de l'adresse IP
        userId,    // Ajout de l'ID de l'utilisateur authentifié
      },
    });

    revalidatePath(`/listing-organisation/${organisationIds}/contact`);
    return NextResponse.json({ message: "Contact créé avec succès", contact }, { status: 200 });

  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ message: "Un contact avec cet email existe déjà." }, { status: 400 });
    }

    console.error("Erreur serveur:", error);
    return NextResponse.json({ message: `Erreur interne du serveur: ${error.message || "inconnue"}` }, { status: 500 });
  }
}
