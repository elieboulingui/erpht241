// app/api/member/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma"; // ou ajustez le chemin selon votre setup

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get("organisationId");

    if (!organisationId) {
      return NextResponse.json(
        { error: "Paramètre organisationId manquant" },
        { status: 400 }
      );
    }

    // Récupère les users membres OU propriétaires de l’organisation
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            organisations: {
              some: {
                id: organisationId,
              },
            },
          },
          {
            ownedOrganisations: {
              some: {
                id: organisationId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Erreur GET /api/member :", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
