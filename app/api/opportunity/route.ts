import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Le paramètre `stepId` est un exemple si tu veux récupérer les opportunités pour une étape spécifique
export async function GET(request: Request) {
  try {
    // Récupération du paramètre `stepId` depuis les URL ou les query parameters
    const url = new URL(request.url);
    const stepId = url.searchParams.get("stepId");

    // Requête pour récupérer les opportunités avec une possible inclusion d'une étape spécifique
    const opportunities = await prisma.opportunity.findMany({
      where: stepId ? { stepId: stepId } : {}, // Filtre les opportunités si un stepId est fourni
      include: {
        step: true, // Inclut les données liées à l'étape
      },
      orderBy: {
        createdAt: "asc", // Trie les opportunités par date de création (si nécessaire)
      },
    });

    // Vérifier si des opportunités ont été trouvées
    if (opportunities.length === 0) {
      return NextResponse.json(
        { message: "Aucune opportunité trouvée." },
        { status: 404 }
      );
    }

    return NextResponse.json(opportunities, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des opportunités :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des opportunités." },
      { status: 500 }
    );
  }
}
