import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const organisationId = searchParams.get("organisationId");

  if (!organisationId) {
    return NextResponse.json(
      { error: "L'ID de l'organisation est requis" },
      { status: 400 }
    );
  }

  try {
    const stages = await prisma.step.findMany({
      where: {
        organisationId,
      },
     
    });
   console.log(stages)
    return NextResponse.json(stages, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des étapes :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des étapes." },
      { status: 500 }
    );
  }
}
