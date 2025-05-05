import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const opportunities = await prisma.opportunity.findMany({
      include: {
        step: true, // ⬅️ Inclut les données liées à la Step
      },
    });

    console.log(opportunities);

    return NextResponse.json(opportunities, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des opportunités :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des opportunités." },
      { status: 500 }
    );
  }
}
